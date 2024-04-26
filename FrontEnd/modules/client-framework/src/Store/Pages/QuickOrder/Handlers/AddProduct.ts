import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import cloneDeep from "lodash/cloneDeep";

type Parameter = {
    productInfo: ProductInfo;
    product: ProductModel;
};

type Props = {
    productInfo: ProductInfo;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginAddProduct: HandlerType = props => {
    props.dispatch({
        type: "Pages/QuickOrder/BeginAddProduct",
    });
};

export const CopyCurrentValues: HandlerType = props => {
    props.productInfo = cloneDeep(props.parameter.productInfo);
};

export const ChangeProductQtyForExistingProduct: HandlerType = props => {
    const quickOrderProductInfos = props.getState().pages.quickOrder.productInfos;
    const { productId, qtyOrdered, unitOfMeasure } = props.productInfo;
    const existingProductInfo = quickOrderProductInfos.find(
        o => o.productId === productId && o.unitOfMeasure === unitOfMeasure,
    );
    if (!existingProductInfo) {
        return;
    }

    props.productInfo.qtyOrdered = existingProductInfo.qtyOrdered + qtyOrdered;
};

export const GetPrice: HandlerType = async props => {
    const { productId, unitOfMeasure, qtyOrdered } = props.productInfo;

    if (props.parameter.product.quoteRequired) {
        return;
    }

    let loadedPricing = false;

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: [{ productId, unitOfMeasure, qtyOrdered }],
            onComplete: realTimePricingProps => {
                if (realTimePricingProps.apiResult) {
                    props.productInfo.pricing = realTimePricingProps.apiResult.realTimePricingResults?.find(
                        o => o.productId === productId,
                    );
                } else if (realTimePricingProps.error) {
                    props.productInfo.failedToLoadPricing = true;
                }

                loadedPricing = true;
            },
        }),
    );

    await waitFor(() => loadedPricing);
};

export const GetInventory: HandlerType = async props => {
    const { productId } = props.productInfo;

    let loadedInventory = false;

    props.dispatch(
        loadRealTimeInventory({
            productIds: [productId],
            onComplete: realTimeInventoryProps => {
                loadedInventory = true;
                if (realTimeInventoryProps.error) {
                    if (props.productInfo) {
                        props.productInfo.failedToLoadInventory = true;
                    }
                } else {
                    props.productInfo.inventory = realTimeInventoryProps?.apiResult?.realTimeInventoryResults?.find(
                        o => o.productId === productId,
                    );
                }
            },
        }),
    );

    await waitFor(() => loadedInventory);
};

export const DispatchCompleteAddProduct: HandlerType = props => {
    props.dispatch({
        type: "Pages/QuickOrder/CompleteAddProduct",
        productInfo: props.productInfo,
    });
};

export const chain = [
    DispatchBeginAddProduct,
    CopyCurrentValues,
    ChangeProductQtyForExistingProduct,
    GetPrice,
    GetInventory,
    DispatchCompleteAddProduct,
];

const addProduct = createHandlerChainRunner(chain, "AddProduct");
export default addProduct;
