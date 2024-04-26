import { createHandlerChainRunner, Handler, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { CartResult, getCart, GetCartApiParameter } from "@insite/client-framework/Services/CartService";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

type HandlerType = Handler<
    | {
          cartId: string;
          shouldLoadFullCart?: boolean;
      }
    | ({
          apiParameter: GetCartApiParameter;
      } & HasOnSuccess),
    {
        apiParameter: GetCartApiParameter;
        apiResult: CartResult;
        needFullCart: boolean;
    }
>;
export const DispatchBeginLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/BeginLoadCart",
        id: "cartId" in props.parameter ? props.parameter.cartId : props.parameter.apiParameter.cartId,
    });
};

export const SetNeedFullCart: HandlerType = props => {
    if (!("cartId" in props.parameter)) {
        return;
    }

    const pageType = getCurrentPage(props.getState()).type;
    props.needFullCart =
        props.parameter.shouldLoadFullCart ||
        pageType === "CheckoutShippingPage" ||
        pageType === "CheckoutReviewAndSubmitPage" ||
        pageType === "OrderConfirmationPage";
};

export const PopulateApiParameter: HandlerType = props => {
    if ("apiParameter" in props.parameter) {
        props.apiParameter = props.parameter.apiParameter;
        return;
    }

    props.apiParameter = {
        cartId: props.parameter.cartId,
        expand: ["validation"],
    };

    if (props.needFullCart) {
        props.apiParameter.forceRecalculation = true;
        props.apiParameter.allowInvalidAddress = true;
        props.apiParameter.expand = [
            ...(props.apiParameter.expand || []),
            "cartLines",
            "restrictions",
            "shipping",
            "tax",
            "carriers",
            "paymentOptions",
            "creditCardBillingAddress",
        ];
    }
};

export const GetCart: HandlerType = async props => {
    try {
        props.apiResult = await getCart(props.apiParameter);
    } catch (error) {
        if ("status" in error && (error.status === 404 || error.status === 403)) {
            props.dispatch({
                type: "Data/Carts/FailedToLoadCart",
                cartId: props.apiParameter.cartId,
                status: error.status,
            });
            return false;
        }
        throw error;
    }
};

export const DispatchCompleteLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/CompleteLoadCart",
        model: props.apiResult.cart,
    });
};

export const DispatchCompleteLoadBillTo: HandlerType = props => {
    if (!props.apiResult.billTo) {
        return;
    }

    props.dispatch({
        type: "Data/BillTos/CompleteLoadBillTo",
        model: props.apiResult.billTo,
    });
};

export const DispatchCompleteLoadShipTo: HandlerType = props => {
    if (!props.apiResult.shipTo) {
        return;
    }

    props.dispatch({
        type: "Data/ShipTos/CompleteLoadShipTo",
        model: props.apiResult.shipTo,
    });
};

export const chain = [
    DispatchBeginLoadCart,
    SetNeedFullCart,
    PopulateApiParameter,
    GetCart,
    DispatchCompleteLoadCart,
    DispatchCompleteLoadBillTo,
    DispatchCompleteLoadShipTo,
];

const loadCart = createHandlerChainRunner(chain, "LoadCart");
export default loadCart;
