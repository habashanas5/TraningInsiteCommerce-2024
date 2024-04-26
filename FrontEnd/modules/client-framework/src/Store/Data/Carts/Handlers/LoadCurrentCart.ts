import {
    createHandlerChainRunnerOptionalParameter,
    Handler,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { CartResult, getCart, GetCartApiParameter } from "@insite/client-framework/Services/CartService";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";

type HandlerType = Handler<
    {
        shouldLoadFullCart?: boolean;
        replaceCart?: boolean;
        getPromotions?: boolean;
    } & HasOnSuccess,
    {
        apiParameter: GetCartApiParameter;
        apiResult: CartResult;
        needFullCart: boolean;
    }
>;

export const DispatchBeginLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/BeginLoadCart",
        id: API_URL_CURRENT_FRAGMENT,
    });
};

export const SetNeedFullCart: HandlerType = props => {
    const pageType = getCurrentPage(props.getState()).type;
    props.needFullCart =
        props.parameter.shouldLoadFullCart ||
        (props.parameter.shouldLoadFullCart !== false &&
            (pageType === "CheckoutShippingPage" ||
                pageType === "CheckoutReviewAndSubmitPage" ||
                pageType === "CartPage" ||
                pageType === "RfqRequestQuotePage"));
};

export const PopulateApiParameter: HandlerType = props => {
    const pageType = getCurrentPage(props.getState()).type;
    props.apiParameter = {
        cartId: API_URL_CURRENT_FRAGMENT,
        expand: ["validation", "shipping"],
    };

    if (props.needFullCart) {
        props.apiParameter.forceRecalculation = true;
        props.apiParameter.allowInvalidAddress = true;
        props.apiParameter.expand = [
            ...(props.apiParameter.expand || []),
            "cartLines",
            "restrictions",
            "tax",
            "carriers",
            "paymentOptions",
            "costCodes",
        ];

        if (pageType === "CartPage") {
            props.apiParameter.expand.push("hiddenproducts");
        }
    }
};

export const GetCart: HandlerType = async props => {
    props.apiResult = await getCart(props.apiParameter);
};

export const SetCarrier: HandlerType = props => {
    const { carrier, carriers } = props.apiResult.cart;
    if (carriers) {
        const carrierLookup = carriers.find(c => c.id === carrier?.id);
        if (carrierLookup) {
            props.apiResult.cart.carrier = carrierLookup;
        }
    }
};

export const DispatchCompleteLoadCart: HandlerType = props => {
    let replaceCart = !props.needFullCart;
    if (typeof props.parameter.replaceCart !== "undefined") {
        replaceCart = props.parameter.replaceCart;
    }

    props.dispatch({
        type: "Data/Carts/CompleteLoadCart",
        model: props.apiResult.cart,
        isCurrent: true,
        replaceCart,
    });
};

export const DispatchLoadCustomers: HandlerType = props => {
    if (props.apiResult.billTo) {
        delete props.apiResult.billTo.accountsReceivable;
        delete props.apiResult.billTo.costCodes;
        props.dispatch({
            type: "Data/BillTos/CompleteLoadBillTo",
            model: props.apiResult.billTo,
        });
    }
    if (props.apiResult.shipTo) {
        props.dispatch({
            type: "Data/ShipTos/CompleteLoadShipTo",
            model: props.apiResult.shipTo,
        });
    }
};

export const DispatchLoadPromotions: HandlerType = props => {
    if (props.parameter.getPromotions) {
        props.dispatch(loadCurrentPromotions());
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginLoadCart,
    SetNeedFullCart,
    PopulateApiParameter,
    GetCart,
    SetCarrier,
    DispatchCompleteLoadCart,
    DispatchLoadCustomers,
    DispatchLoadPromotions,
    ExecuteOnSuccessCallback,
];

const loadCurrentCart = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCurrentCart");
export default loadCurrentCart;
