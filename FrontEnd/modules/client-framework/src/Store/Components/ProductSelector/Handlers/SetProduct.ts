import { createFromProduct, ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    Handler,
} from "@insite/client-framework/HandlerCreator";
import {
    ConfigurationType,
    getProductById,
    GetProductByIdApiV2Parameter,
    GetProductVariantChildApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadProduct from "@insite/client-framework/Store/Data/Products/Handlers/LoadProduct";
import loadProducts from "@insite/client-framework/Store/Data/Products/Handlers/LoadProducts";
import loadVariantChild from "@insite/client-framework/Store/Data/Products/Handlers/LoadVariantChild";
import loadVariantChildren from "@insite/client-framework/Store/Data/Products/Handlers/LoadVariantChildren";
import {
    getProductState,
    getVariantChildrenDataView,
    hasEnoughInventory,
} from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

interface Parameter {
    variantId?: string;
    productId?: string;
    searchTerm?: string;
    validateProduct?: boolean;
    skipInventoryValidation?: boolean;
    denyFixedConfiguration?: boolean;
}

interface Props {
    apiParameter: GetProductByIdApiV2Parameter | GetProductVariantChildApiV2Parameter;
    variantChildren?: ProductModel[] | null;
    product?: ProductModel;
    productInfo?: ProductInfo;
}

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginSetProduct: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/BeginSetProduct",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    if (props.parameter.variantId && props.parameter.productId) {
        props.apiParameter = {
            id: props.parameter.variantId,
            variantParentId: props.parameter.productId,
            expand: ["detail"],
        };
    } else if (props.parameter.productId) {
        props.apiParameter = {
            id: props.parameter.productId,
            expand: ["detail", "variantTraits"],
        };
    }
};

export const RequestDataFromApi: HandlerType = async props => {
    const {
        apiParameter,
        parameter: { searchTerm },
    } = props;
    if (!apiParameter && !searchTerm) {
        return;
    }

    if (apiParameter) {
        props.product = getProductState(props.getState(), apiParameter.id).value;
        if (
            !props.product ||
            !props.product.detail ||
            (props.product.isVariantParent && !props.product.variantTraits)
        ) {
            if (props.parameter.variantId) {
                props.product = await executeAwaitableHandlerChain(
                    loadVariantChild,
                    props.apiParameter as GetProductVariantChildApiV2Parameter,
                    props,
                );
            } else {
                props.product = await executeAwaitableHandlerChain(loadProduct, props.apiParameter, props);
            }
        }
    } else if (searchTerm) {
        props.product = (
            (await executeAwaitableHandlerChain(
                loadProducts,
                { extendedNames: [searchTerm], expand: ["variantTraits"] },
                props,
            )) as ProductModel[]
        )[0];
    }
};

export const ReplaceProductIfNeeded: HandlerType = async props => {
    const product = props.product;
    if (product && product.canAddToCart && product.isDiscontinued && product.detail?.replacementProductId) {
        props.product = await getProductById({ id: product.detail.replacementProductId });
    }
};

export const LoadInventory: HandlerType = async props => {
    const product = props.product;
    if (!product) {
        return;
    }
    props.productInfo = createFromProduct(product);

    let loadedInventory = false;

    props.dispatch(
        loadRealTimeInventory({
            productIds: [product.id],
            onComplete: realTimeInventoryProps => {
                if (realTimeInventoryProps.error) {
                    if (props.productInfo) {
                        props.productInfo.failedToLoadInventory = true;
                    }
                } else if (props.productInfo) {
                    props.productInfo.inventory = realTimeInventoryProps.apiResult?.realTimeInventoryResults?.find(
                        o => o.productId === product.id,
                    );
                }
                loadedInventory = true;
            },
        }),
    );

    await waitFor(() => loadedInventory);
};

export const RequestVariantChildrenFromApi: HandlerType = async props => {
    if (!props.product?.variantTraits || props.product.variantTraits.length === 0) {
        return;
    }

    props.variantChildren = getVariantChildrenDataView(props.getState(), props.product.id).value;
    if (!props.variantChildren) {
        props.variantChildren = await executeAwaitableHandlerChain(
            loadVariantChildren,
            { productId: props.product.id },
            props,
        );
    }
};

export const DispatchUpdateOptions: HandlerType = props => {
    if (!props.product) {
        return;
    }

    props.dispatch({
        type: "Components/ProductSelector/UpdateOptions",
        result: props.product,
    });
};

export const ValidateProduct: HandlerType = ({ parameter, product, productInfo, getState, dispatch }) => {
    if (!parameter.validateProduct || !product || !productInfo) {
        return;
    }

    if (
        product.canConfigure ||
        (product.configurationType !== ConfigurationType.None &&
            (product.configurationType !== ConfigurationType.Fixed || parameter.denyFixedConfiguration))
    ) {
        dispatch({
            type: "Components/ProductSelector/SetErrorType",
            errorType: "productIsConfigurable",
        });
    }

    if (product.isVariantParent) {
        dispatch({
            type: "Components/ProductSelector/OpenVariantModal",
            productId: product.id,
        });

        return false;
    }

    if (!parameter.skipInventoryValidation && !hasEnoughInventory(getState(), { product, productInfo })) {
        dispatch({
            type: "Components/ProductSelector/SetErrorType",
            errorType: "productIsUnavailable",
        });
    }
};

export const DispatchCompleteSetProduct: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/CompleteSetProduct",
        productInfo: props.productInfo,
    });
};

export const chain = [
    DispatchBeginSetProduct,
    PopulateApiParameter,
    RequestDataFromApi,
    ReplaceProductIfNeeded,
    LoadInventory,
    RequestVariantChildrenFromApi,
    DispatchUpdateOptions,
    ValidateProduct,
    DispatchCompleteSetProduct,
];

const setProduct = createHandlerChainRunner(chain, "SetProduct");
export default setProduct;
