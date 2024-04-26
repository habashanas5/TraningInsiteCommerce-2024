import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { deleteSession, stopWatchingForOtherTabSessionChange } from "@insite/client-framework/Services/SessionService";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";

type HandlerType = Handler;

export const DeleteSession: HandlerType = () => {
    stopWatchingForOtherTabSessionChange(); // Prevent reload caused by this sign-out, which could interfere with the RedirectToHomePage step.
    return deleteSession();
};

export const RedirectToHomePage: HandlerType = props => {
    const state = props.getState();
    window.location.href = getHomePageUrl(state);
};

export const chain = [DeleteSession, RedirectToHomePage];

const signOut = createHandlerChainRunnerOptionalParameter(chain, {}, "SignOut");
export default signOut;
