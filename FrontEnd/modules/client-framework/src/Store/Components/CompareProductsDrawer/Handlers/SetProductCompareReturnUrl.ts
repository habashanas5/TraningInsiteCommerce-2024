import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { setReturnUrl } from "@insite/client-framework/Services/ProductCompareService";

type Parameter = {
    returnUrl: string;
};

type HandlerType = Handler<Parameter>;

export const SetProductCompareReturnUrl: HandlerType = ({ parameter: { returnUrl } }) => {
    setReturnUrl(returnUrl);
};

export const DispatchSetProductCompareReturnUrl: HandlerType = ({ parameter: { returnUrl }, dispatch }) => {
    dispatch({
        type: "Components/CompareProductsDrawer/SetReturnUrl",
        returnUrl,
    });
};

export const chain = [SetProductCompareReturnUrl, DispatchSetProductCompareReturnUrl];

const setProductCompareReturnUrl = createHandlerChainRunner(chain, "SetProductCompareReturnUrl");
export default setProductCompareReturnUrl;
