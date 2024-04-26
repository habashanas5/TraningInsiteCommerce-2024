import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import { updateContext } from "@insite/client-framework/Context";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { Session, updateSession, UpdateSessionApiParameter } from "@insite/client-framework/Services/SessionService";
import { LanguageModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ languageId: string }, UpdateSessionApiParameter, Session>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            language: {
                id: props.parameter.languageId,
            } as LanguageModel,
        } as Session,
    };
};

export const UpdateSession: HandlerType = async props => {
    props.apiResult = await updateSession(props.apiParameter);
};

export const UpdateContext: HandlerType = props => {
    updateContext({ languageId: props.parameter.languageId });
};

export const InformShell: HandlerType = props => {
    sendToShell({
        type: "ChangeWebsiteLanguage",
        languageId: props.parameter.languageId,
    });
};

export const ReloadPage: HandlerType = () => {
    let href = window.location.href;
    const switchingLanguageParameter = "SwitchingLanguage=true";
    if (!href.includes(switchingLanguageParameter)) {
        if (window.location.href.indexOf("?") === -1) {
            href += "?";
        } else {
            href += "&";
        }
        href += switchingLanguageParameter;
    }
    window.location.href = href;
};

export const chain = [PopulateApiParameter, UpdateSession, UpdateContext, InformShell, ReloadPage];

const setLanguage = createHandlerChainRunner(chain, "SetLanguage");
export default setLanguage;
