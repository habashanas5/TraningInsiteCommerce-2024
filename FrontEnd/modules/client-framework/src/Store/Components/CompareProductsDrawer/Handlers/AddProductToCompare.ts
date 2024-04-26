import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { addProduct, getProductIds } from "@insite/client-framework/Services/ProductCompareService";

type Parameter = {
    productId: string;
};

type HandlerType = Handler<Parameter>;

export const AddProductIdToCompare: HandlerType = ({ parameter: { productId } }) => {
    addProduct(productId);
};

export const DispatchSetProductIds: HandlerType = ({ dispatch }) => {
    dispatch({
        type: "Components/CompareProductsDrawer/SetProductIds",
        productIds: getProductIds(),
    });
};

export const chain = [AddProductIdToCompare, DispatchSetProductIds];

const addProductIdToCompare = createHandlerChainRunner(chain, "AddProductIdToCompare");
export default addProductIdToCompare;
