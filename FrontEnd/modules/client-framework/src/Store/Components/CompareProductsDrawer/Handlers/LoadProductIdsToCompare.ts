import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { getProductIds } from "@insite/client-framework/Services/ProductCompareService";

export const DispatchProductIdsToCompare: Handler = ({ dispatch }) => {
    dispatch({
        type: "Components/CompareProductsDrawer/SetProductIds",
        productIds: getProductIds(),
    });
};

export const chain = [DispatchProductIdsToCompare];

const loadProductIdsToCompare = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadProductIdsToCompare");
export default loadProductIdsToCompare;
