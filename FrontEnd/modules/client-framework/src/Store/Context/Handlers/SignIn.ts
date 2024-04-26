import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { fetch } from "@insite/client-framework/ServerSideRendering";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { getCart, GetCartApiParameter, updateCart } from "@insite/client-framework/Services/CartService";
import {
    createSession,
    deleteSession,
    Session,
    stopWatchingForOtherTabSessionChange,
    watchForOtherTabSessionChange,
} from "@insite/client-framework/Services/SessionService";
import { getCurrentUserIsGuest } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadSession from "@insite/client-framework/Store/Context/Handlers/LoadSession";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getHomePageUrl, getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { Draft } from "immer";
import cloneDeep from "lodash/cloneDeep";

type HandlerType = ApiHandler<
    SignInParameter,
    SignInResult,
    {
        tokenSuccessfullyRequested?: boolean;
        authenticatedSession?: Session;
    }
>;

export interface SignInParameter {
    userName: string;
    password: string;
    rememberMe: boolean;
    returnUrl?: string | undefined;
    onError?: (error: string, statusCode?: number) => void;
}

export interface SignInResult {
    readonly access_token: string;
    readonly refresh_token: string;
    readonly expires_in: number;
    readonly error_description: string;
}

export const DispatchBeginSignIn: HandlerType = props => {
    props.dispatch({
        type: "Context/BeginSignIn",
    });
};

export const UnassignCartFromGuest: HandlerType = async props => {
    const { value: cart } = getCurrentCartState(props.getState());
    const currentUserIsGuest = getCurrentUserIsGuest(props.getState());
    if (!currentUserIsGuest) {
        return;
    }
    if (!cart) {
        throw new Error("The cart is not loaded. Try reloading the page.");
    }

    if (cart.lineCount > 0) {
        const cartClone = cloneDeep(cart) as Draft<typeof cart>;
        cartClone.unassignCart = true;
        await updateCart({ cart: cartClone });
    }
};

export const SignOutGuest: HandlerType = async props => {
    const currentUserIsGuest = getCurrentUserIsGuest(props.getState());
    if (!currentUserIsGuest) {
        return;
    }

    await deleteSession();
    props.dispatch({
        type: "Context/DeleteSession",
    });
};

export const RequestAccessToken: HandlerType = async props => {
    const data = new URLSearchParams();
    data.append("grant_type", "password");
    data.append("userName", props.parameter.userName);
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

    props.apiResult = await (response.json() as Promise<{
        readonly access_token: string;
        readonly refresh_token: string;
        readonly expires_in: number;
        readonly error_description: string;
    }>);

    props.tokenSuccessfullyRequested = response.ok;

    if (!response.ok) {
        props.parameter.onError?.(props.apiResult.error_description);
    }
};

export const RequestSession: HandlerType = async props => {
    if (!props.tokenSuccessfullyRequested) {
        return;
    }

    const { password, rememberMe, returnUrl, userName } = props.parameter;

    stopWatchingForOtherTabSessionChange(); // Prevent detection of the change we're making here.
    const session = await createSession({
        password,
        rememberMe,
        returnUrl,
        userName,
        accessToken: props.apiResult.access_token,
    });

    if (!session.successful) {
        watchForOtherTabSessionChange(); // This sign-in failed, but another tab might be successful later on.
        props.parameter.onError?.(session.errorMessage, session.statusCode);
        return;
    }

    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: session.result,
    });

    props.authenticatedSession = session.result;
};

export const LoadSessionIfNeeded: HandlerType = props => {
    if (props.authenticatedSession) {
        return;
    }

    const sessionIsEmpty = Object.keys(props.getState().context.session).length === 0;
    if (!sessionIsEmpty) {
        return;
    }

    props.dispatch(loadSession());
};

export const DispatchCompleteSignIn: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteSignIn",
        accessToken: props.apiResult.access_token,
    });
};

export const RedirectToChangeCustomer: HandlerType = props => {
    if (!props.authenticatedSession?.redirectToChangeCustomerPageOnSignIn) {
        watchForOtherTabSessionChange(); // This sign-in failed, but another tab might be successful later on.
        return;
    }

    const homePageUrl = getPageLinkByPageType(props.getState(), "HomePage")?.url;
    const dashboardPageUrl = getPageLinkByPageType(props.getState(), "MyAccountPage")?.url;
    const changeCustomerPageUrl = getPageLinkByPageType(props.getState(), "ChangeCustomerPage")?.url;
    if (homePageUrl && changeCustomerPageUrl) {
        const shouldAddReturnUrl = props.parameter.returnUrl && props.parameter.returnUrl !== homePageUrl;
        const returnUrl = shouldAddReturnUrl
            ? props.parameter.returnUrl
            : props.authenticatedSession.dashboardIsHomepage
            ? dashboardPageUrl!
            : undefined;

        window.location.href = changeCustomerPageUrl + (returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : "");
        return false;
    }
};

export const NavigateToReturnUrl: HandlerType = async props => {
    if (!props.authenticatedSession) {
        return;
    }

    const state = props.getState();
    let returnUrl = props.parameter.returnUrl;
    const dashboardPageUrl = getPageLinkByPageType(props.getState(), "MyAccountPage")?.url;
    const defaultUrl =
        props.authenticatedSession.dashboardIsHomepage && dashboardPageUrl
            ? dashboardPageUrl
            : props.authenticatedSession.customLandingPage
            ? props.authenticatedSession.customLandingPage
            : getHomePageUrl(state);
    const checkoutShippingUrl = getPageLinkByPageType(state, "CheckoutShippingPage")?.url;

    if (returnUrl?.toLowerCase() === checkoutShippingUrl?.toLowerCase()) {
        const cartResult = await getCart({
            cartId: API_URL_CURRENT_FRAGMENT,
            expand: ["cartLines", "hiddenproducts"],
        } as GetCartApiParameter);

        const { canCheckOut, canBypassCheckoutAddress } = cartResult.cart;
        const checkoutReviewAndSubmitUrl = getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage")?.url;
        const cartUrl = getPageLinkByPageType(state, "CartPage")?.url;

        if (!canCheckOut || props.authenticatedSession.isRestrictedProductExistInCart) {
            returnUrl = cartUrl;
        } else if (canBypassCheckoutAddress) {
            returnUrl = checkoutReviewAndSubmitUrl;
        }
    }

    if (returnUrl?.includes("SwitchingLanguage")) {
        returnUrl = returnUrl.split("?")[0];
    }
    if (
        returnUrl?.toLowerCase() === getHomePageUrl(state).toLowerCase() &&
        props.authenticatedSession?.customLandingPage
    ) {
        // need to send to custom landing page if the return URL is a language specific homepage
        if (returnUrl?.endsWith("/")) {
            returnUrl = returnUrl.substring(0, returnUrl.length - 1);
        }
        if (props.authenticatedSession?.customLandingPage.startsWith("/")) {
            returnUrl = `${returnUrl}${props.authenticatedSession?.customLandingPage}`;
        } else {
            returnUrl = `${returnUrl}/${props.authenticatedSession?.customLandingPage}`;
        }
    } else if (
        returnUrl?.toLowerCase() === getHomePageUrl(state).toLowerCase() &&
        props.authenticatedSession.dashboardIsHomepage &&
        dashboardPageUrl
    ) {
        // case where returnUrl is a language-specific homepage but we should redirect to the dashboard
        returnUrl = defaultUrl;
    }

    window.location.href = returnUrl || defaultUrl;
};

export const chain = [
    DispatchBeginSignIn,
    UnassignCartFromGuest,
    SignOutGuest,
    RequestAccessToken,
    RequestSession,
    LoadSessionIfNeeded,
    DispatchCompleteSignIn,
    RedirectToChangeCustomer,
    NavigateToReturnUrl,
];

const signIn = createHandlerChainRunner(chain, "SignIn");
export default signIn;
