import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { getReturnUrl } from "@insite/client-framework/Services/ProductCompareService";

export const DispatchSetProductCompareReturnUrl: Handler = ({ dispatch }) => {
    dispatch({
        type: "Components/CompareProductsDrawer/SetReturnUrl",
        returnUrl: getReturnUrl(),
    });
};

export const chain = [DispatchSetProductCompareReturnUrl];

const loadProductCompareReturnUrl = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadProductCompareReturnUrl");
export default loadProductCompareReturnUrl;
