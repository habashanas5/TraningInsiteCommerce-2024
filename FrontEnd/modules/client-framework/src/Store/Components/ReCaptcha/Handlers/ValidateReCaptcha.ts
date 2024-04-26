import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import {
    createHandlerChainRunnerOptionalParameter,
    Handler,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";

type HandlerType = Handler<HasOnSuccess<boolean>, { errorMessage: string }>;

export const Validate: HandlerType = props => {
    const grecaptcha = (window as { [key: string]: any })["grecaptcha"];
    if (grecaptcha === undefined) {
        return;
    }

    const reCaptchaElement = document.getElementById("reCaptcha");
    if (!reCaptchaElement) {
        return;
    }

    if (getCookie("g-recaptcha-verified")) {
        return;
    }

    const reCaptchaResponse = grecaptcha.getResponse();
    setCookie("g-recaptcha-response", reCaptchaResponse);

    props.errorMessage = reCaptchaResponse ? "" : (siteMessage("ReCaptcha_RequiredErrorMessage") as string);
    props.dispatch({
        type: "Components/ReCaptcha/SetErrorMessage",
        errorMessage: props.errorMessage,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(!props.errorMessage);
};

export const chain = [Validate, ExecuteOnSuccessCallback];

const validateReCaptcha = createHandlerChainRunnerOptionalParameter(chain, {}, "ValidateReCaptcha");
export default validateReCaptcha;
