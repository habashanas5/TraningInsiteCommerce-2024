import { setCookie } from "@insite/client-framework/Common/Cookies";
import {
    createHandlerChainRunner,
    Handler,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { fetch } from "@insite/client-framework/ServerSideRendering";

type HandlerType = Handler<{ username: string; password: string } & HasOnSuccess & HasOnError<string>>;

export const RequestAccessToken: HandlerType = async props => {
    const data = new URLSearchParams();
    data.append("grant_type", "password");
    data.append("userName", props.parameter.username);
    data.append("password", props.parameter.password);
    data.append("scope", "iscapi offline_access");

    const response = await fetch("/identity/connect/token", {
        method: "POST",
        body: data.toString(),
        headers: new Headers({
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa("isc:009AC476-B28E-4E33-8BAE-B5F103A142BC")}`,
        }),
    });

    const result = await (response.json() as Promise<{
        readonly error_description: string;
    }>);
    if (!response.ok) {
        props.parameter.onError?.(result.error_description);
        return false;
    }
};

export const SetCookie: HandlerType = () => {
    setCookie("PreviewLoggedIn", "true", { expires: 30 });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [RequestAccessToken, SetCookie, ExecuteOnSuccessCallback];

const previewLogin = createHandlerChainRunner(chain, "PreviewLogin");
export default previewLogin;
