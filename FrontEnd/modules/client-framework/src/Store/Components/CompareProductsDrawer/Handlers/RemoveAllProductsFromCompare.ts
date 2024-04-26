import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { getProductIds, removeAllProducts } from "@insite/client-framework/Services/ProductCompareService";

export const RemoveAllProductsFromCompare: Handler = () => {
    removeAllProducts();
};

export const DispatchSetProductIds: Handler = ({ dispatch }) => {
    dispatch({
        type: "Components/CompareProductsDrawer/SetProductIds",
        productIds: getProductIds(),
    });
};

export const chain = [RemoveAllProductsFromCompare, DispatchSetProductIds];

const removeAllProductsFromCompare = createHandlerChainRunnerOptionalParameter(
    chain,
    {},
    "RemoveAllProductsFromCompare",
);
export default removeAllProductsFromCompare;
