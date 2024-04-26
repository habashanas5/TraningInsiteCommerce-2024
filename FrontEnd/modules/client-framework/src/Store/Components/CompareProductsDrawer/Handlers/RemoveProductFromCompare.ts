import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getProductIds, removeProduct } from "@insite/client-framework/Services/ProductCompareService";

type Parameter = {
    productId: string;
};

type HandlerType = Handler<Parameter>;

export const RemoveProductIdToCompare: HandlerType = ({ parameter: { productId } }) => {
    removeProduct(productId);
};

export const DispatchSetProductIds: HandlerType = ({ dispatch }) => {
    dispatch({
        type: "Components/CompareProductsDrawer/SetProductIds",
        productIds: getProductIds(),
    });
};

export const chain = [RemoveProductIdToCompare, DispatchSetProductIds];

const removeProductIdToCompare = createHandlerChainRunner(chain, "RemoveProductIdToCompare");
export default removeProductIdToCompare;
