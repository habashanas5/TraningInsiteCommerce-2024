import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    Handler,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { ProductModel, ProductPriceDto, RealTimePricingModel } from "@insite/client-framework/Types/ApiModels";

interface Parameter {
    productId: string;
    unitOfMeasure: string;
    qtyOrdered: number;
    product: ProductModel;
}

interface Props {
    pricing?: ProductPriceDto;
}

type HandlerType = Handler<Parameter, Props>;

export const UpdatePrice: HandlerType = async props => {
    const {
        parameter: { productId, unitOfMeasure, qtyOrdered, product },
    } = props;
    if (product.quoteRequired) {
        return;
    }

    const realTimePricingModel = await executeAwaitableHandlerChain<
        Parameters<typeof loadRealTimePricing>[0],
        RealTimePricingModel
    >(loadRealTimePricing, { productPriceParameters: [{ productId, unitOfMeasure, qtyOrdered }] }, props);
    props.pricing = realTimePricingModel.realTimePricingResults?.find(o => o.productId === productId);
};

export const DispatchCompleteChangeQty: HandlerType = ({
    parameter: { productId, qtyOrdered, unitOfMeasure },
    dispatch,
    pricing,
}) => {
    dispatch({
        type: "Pages/QuickOrder/ChangeProductQtyOrdered",
        productId,
        qtyOrdered,
        unitOfMeasure,
        pricing,
    });
};

export const chain = [UpdatePrice, DispatchCompleteChangeQty];

const changeProductQty = createHandlerChainRunner(chain, "ChangeProductQty");
export default changeProductQty;
