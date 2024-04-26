import { updateContext } from "@insite/client-framework/Context";
import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { Cart, getCart, GetCartApiParameter } from "@insite/client-framework/Services/CartService";

import {
    FulfillmentMethod,
    getSession as getSessionApi,
    Session,
    UpdateSessionApiParameter,
    updateSessionWithResult,
    UpdateSessionWithResultApiParameter,
} from "@insite/client-framework/Services/SessionService";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getHomePageUrl, getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { BillToModel, ShipToModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        billToId?: string;
        shipToId?: string;
        fulfillmentMethod: string;
        pickUpWarehouse: WarehouseModel | null;
        isDefault?: boolean;
        returnUrl?: string;
        skipRedirect?: boolean;
    } & HasOnSuccess &
        HasOnError<string>,
    UpdateSessionApiParameter,
    Session,
    {
        cart: Cart;
    }
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            customerWasUpdated: false,
            shipToId: props.parameter.shipToId,
            billToId: props.parameter.billToId,
            fulfillmentMethod: props.parameter.fulfillmentMethod,
            pickUpWarehouse:
                props.parameter.fulfillmentMethod === FulfillmentMethod.PickUp ? props.parameter.pickUpWarehouse : null,
        },
    };
};

/**
 * Since the chain will not force a reload of the page, the chain should get an updated session.
 */
export const UpdateSession: HandlerType = async props => {
    const newApiParameter: UpdateSessionWithResultApiParameter = { ...props.apiParameter };
    if (props.apiParameter.session.billToId) {
        newApiParameter.session.billTo = {
            id: props.parameter.billToId,
            isDefault: props.parameter.isDefault,
        } as BillToModel;
    }
    if (props.apiParameter.session.shipToId !== undefined) {
        newApiParameter.session.shipTo = { id: props.parameter.shipToId } as ShipToModel;
    }

    const result = await updateSessionWithResult(newApiParameter);
    if (result.successful) {
        props.apiResult = await getSessionApi({});
    } else {
        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const UpdateContext: HandlerType = props => {
    updateContext({
        shipToId: props.parameter.shipToId,
        billToId: props.parameter.billToId,
    });
};

/**
 * We need to make sure we correctly update the session with the new shipToId and billToId.
 * Since the server will not correctly send the shipToId in the API request.
 * The ShipTo will update after a full request with the BillToIdShipToId cookie is able to be processed.
 */
export const DispatchCompleteLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: {
            ...props.apiResult,
            shipToId: props.parameter.shipToId,
            billToId: props.parameter.billToId,
        },
    });
};

export const ResetBillTosAndShipTosData: HandlerType = props => {
    if (!props.parameter.skipRedirect) {
        return;
    }

    props.dispatch({
        type: "Data/BillTos/Reset",
    });
    props.dispatch({
        type: "Data/ShipTos/Reset",
    });
    props.dispatch({
        type: "Data/Carts/Reset",
    });
    props.dispatch({
        type: "Data/Orders/Reset",
    });
};

export const FireOnSuccess: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

/**
 * @deprecated Not needed anymore
 */
export const LoadCurrentCart: HandlerType = () => {};

export const NavigateToReturnUrl: HandlerType = async props => {
    if (props.parameter.skipRedirect) {
        return;
    }

    const state = props.getState();
    const session = getSession(state);
    const homePageUrl = getPageLinkByPageType(state, "HomePage")?.url;
    let languageSpecificLandingPage = session.customLandingPage;
    if (homePageUrl && homePageUrl !== "/") {
        if (languageSpecificLandingPage && languageSpecificLandingPage.startsWith("/")) {
            languageSpecificLandingPage = homePageUrl.concat(session.customLandingPage);
        } else {
            languageSpecificLandingPage = homePageUrl.concat("/", session.customLandingPage);
        }
    }
    const defaultUrl = session.dashboardIsHomepage
        ? getPageLinkByPageType(state, "MyAccountPage")?.url
        : session.customLandingPage
        ? languageSpecificLandingPage
        : homePageUrl;

    const checkoutShippingUrl = getPageLinkByPageType(state, "CheckoutShippingPage")?.url;
    let returnUrl = props.parameter.returnUrl;
    if (props.apiParameter.session.shipToId === "") {
        returnUrl = `${getPageLinkByPageType(state, "AddressesPage")?.url}?isNewShipTo=true`;
    } else if (returnUrl?.toLowerCase() === checkoutShippingUrl?.toLowerCase()) {
        const cartResult = await getCart({
            cartId: API_URL_CURRENT_FRAGMENT,
            expand: ["cartLines", "hiddenproducts"],
        } as GetCartApiParameter);
        const { canCheckOut, canBypassCheckoutAddress } = cartResult.cart;
        const checkoutReviewAndSubmitUrl = getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage")?.url;
        const cartUrl = getPageLinkByPageType(state, "CartPage")?.url;
        if (!canCheckOut || session.isRestrictedProductExistInCart) {
            returnUrl = cartUrl;
        } else if (canBypassCheckoutAddress) {
            returnUrl = checkoutReviewAndSubmitUrl;
        }
    }

    window.location.href = returnUrl || defaultUrl || getHomePageUrl(state);
};

export const chain = [
    PopulateApiParameter,
    UpdateSession,
    UpdateContext,
    DispatchCompleteLoadSession,
    ResetBillTosAndShipTosData,
    FireOnSuccess,
    NavigateToReturnUrl,
];

const changeCustomerContext = createHandlerChainRunner(chain, "ChangeCustomerContext");
export default changeCustomerContext;
