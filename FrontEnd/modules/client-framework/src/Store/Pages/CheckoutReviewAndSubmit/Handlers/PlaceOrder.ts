import formatDateWithTimezone from "@insite/client-framework/Common/Utilities/formatDateWithTimezone";
import { trackCompletedOrder } from "@insite/client-framework/Common/Utilities/tracking";
import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    Cart,
    CartResult,
    UpdateCartApiParameter,
    updateCartWithResult,
} from "@insite/client-framework/Services/CartService";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import cloneDeep from "lodash/cloneDeep";

const convertDateToApiFormat = (date: Date | null) => (date ? formatDateWithTimezone(date) : "");

interface PlaceOrderParameter {
    paymentMethod: string;
    poNumber: string;
    vatNumber?: string;
    saveCard: boolean;
    cardHolderName: string;
    cardNumber: string;
    cardType: string;
    expirationMonth: number;
    expirationYear: number;
    securityCode: string;
    useBillingAddress: boolean;
    address1: string;
    countryId: string;
    stateId: string;
    city: string;
    postalCode: string;
    onSuccess?: (cartId: string) => void;
    payPalToken?: string;
    payPalPayerId?: string;
    accountHolderName?: string;
    accountNumber?: string;
    routingNumber?: string;
}

type HandlerType = ApiHandlerDiscreteParameter<
    PlaceOrderParameter & HasOnError,
    UpdateCartApiParameter,
    CartResult,
    {
        cartToUpdate: Cart;
    }
>;

export const DispatchBeginPlaceOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/BeginPlaceOrder",
    });
};

export const SetCartStatus: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;

    if (!cart) {
        throw new Error("There was no current cart and we are trying to place the current cart as an order.");
    }

    props.cartToUpdate = {
        ...cloneDeep(cart),
        status: cart.requiresApproval ? "AwaitingApproval" : "Submitted",
        poNumber: props.parameter.poNumber,
        customerVatNumber: props.parameter.vatNumber || "",
    };
};

export const SetPaymentMethod: HandlerType = props => {
    const { cartToUpdate } = props;

    if (props.parameter.payPalPayerId) {
        cartToUpdate.paymentOptions!.isPayPal = true;
        cartToUpdate.paymentOptions!.payPalToken = props.parameter.payPalToken!;
        cartToUpdate.paymentOptions!.payPalPayerId = props.parameter.payPalPayerId;
        cartToUpdate.paymentMethod = null;
        return;
    }

    if (!cartToUpdate.paymentOptions?.paymentMethods?.length) {
        return;
    }

    const paymentMethodDto = cartToUpdate.paymentOptions.paymentMethods.find(
        method => method.name === props.parameter.paymentMethod,
    );
    if (!paymentMethodDto) {
        return;
    }

    cartToUpdate.paymentMethod = paymentMethodDto;
};

export const SetCreditCard: HandlerType = props => {
    const { cartToUpdate } = props;

    if (cartToUpdate.paymentMethod?.isCreditCard) {
        const updatedCreditCard = {
            ...cartToUpdate.paymentOptions!.creditCard!,
            cardHolderName: props.parameter.cardHolderName,
            cardNumber: props.parameter.cardNumber,
            cardType: props.parameter.cardType,
            expirationMonth: props.parameter.expirationMonth,
            expirationYear: props.parameter.expirationYear,
            securityCode: props.parameter.securityCode,
            useBillingAddress: props.parameter.useBillingAddress,
        };

        cartToUpdate.paymentOptions!.storePaymentProfile = props.parameter.saveCard;

        if (!props.parameter.useBillingAddress) {
            const countries = getCurrentCountries(props.getState());
            if (!countries) {
                throw new Error("The active countries for the current website are not available.");
            }

            const selectedCountry = countries.find(country => country.id === props.parameter.countryId);
            if (!selectedCountry) {
                throw new Error("The selected country for the card billing address is not valid.");
            }

            updatedCreditCard.address1 = props.parameter.address1;
            updatedCreditCard.country = selectedCountry.name;
            updatedCreditCard.countryAbbreviation = selectedCountry.abbreviation;

            const selectedState = selectedCountry.states?.find(state => state.id === props.parameter.stateId);
            if (!selectedState) {
                throw new Error("The selected state for the card billing address is not valid.");
            }

            updatedCreditCard.state = selectedState.name;
            updatedCreditCard.stateAbbreviation = selectedState.abbreviation;
            updatedCreditCard.city = props.parameter.city;
            updatedCreditCard.postalCode = props.parameter.postalCode;
        }

        cartToUpdate.paymentOptions!.creditCard = updatedCreditCard;
    }
};

export const SetECheck: HandlerType = props => {
    const { cartToUpdate } = props;

    if (cartToUpdate.paymentMethod?.isECheck) {
        if (!props.parameter.accountHolderName) {
            throw new Error("Specify Account Holder Name.");
        }

        if (!props.parameter.accountNumber) {
            throw new Error("Specify Account Number.");
        }

        if (!props.parameter.routingNumber) {
            throw new Error("Specify Routing Number.");
        }

        const updatedECheck = {
            ...cartToUpdate.paymentOptions!.eCheck!,
            accountHolder: props.parameter.accountHolderName!,
            accountNumber: props.parameter.accountNumber!,
            routingNumber: props.parameter.routingNumber!,
            useBillingAddress: props.parameter.useBillingAddress,
        };

        if (!props.parameter.useBillingAddress) {
            const countries = getCurrentCountries(props.getState());
            if (!countries) {
                throw new Error("The active countries for the current website are not available.");
            }

            const selectedCountry = countries.find(country => country.id === props.parameter.countryId);
            if (!selectedCountry) {
                throw new Error("The selected country for the card billing address is not valid.");
            }

            updatedECheck.address1 = props.parameter.address1;
            updatedECheck.country = selectedCountry.name;
            updatedECheck.countryAbbreviation = selectedCountry.abbreviation;

            const selectedState = selectedCountry.states?.find(state => state.id === props.parameter.stateId);
            if (!selectedState) {
                throw new Error("The selected state for the card billing address is not valid.");
            }

            updatedECheck.state = selectedState.name;
            updatedECheck.stateAbbreviation = selectedState.abbreviation;
            updatedECheck.city = props.parameter.city;
            updatedECheck.postalCode = props.parameter.postalCode;
        }

        cartToUpdate.paymentOptions!.eCheck = updatedECheck;
    }
};

export const PopulateApiParameter: HandlerType = props => {
    if (!props.cartToUpdate) {
        return;
    }

    const {
        pages: {
            checkoutReviewAndSubmit: { requestedDeliveryDate, requestedPickupDate },
        },
    } = props.getState();
    const tempDeliveryDate =
        typeof requestedDeliveryDate !== "undefined"
            ? requestedDeliveryDate
            : props.cartToUpdate.requestedDeliveryDateDisplay;
    const tempPickupDate =
        typeof requestedPickupDate !== "undefined"
            ? requestedPickupDate
            : props.cartToUpdate.requestedPickupDateDisplay;

    props.apiParameter = {
        cart: {
            ...props.cartToUpdate,
            requestedDeliveryDate: convertDateToApiFormat(tempDeliveryDate),
            requestedPickupDate: convertDateToApiFormat(tempPickupDate),
        },
    };
};

export const UpdateCart: HandlerType = async props => {
    const result = await updateCartWithResult(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.();
        props.dispatch({
            type: "Pages/CheckoutReviewAndSubmit/SetPlaceOrderErrorMessage",
            errorMessage: result.errorMessage,
        });
        props.dispatch({
            type: "Pages/CheckoutReviewAndSubmit/CompletePlaceOrder",
        });
        return false;
    }
};

export const ReloadCurrentCart: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (cartId) {
        props.dispatch(loadCart({ cartId }));
    } else {
        props.dispatch(loadCurrentCart());

        if (props.cartToUpdate?.isAwaitingApproval) {
            props.dispatch(loadCart({ cartId: props.cartToUpdate.id }));
        }
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.(props.apiResult.cart.id);
};

export const SendTracking: HandlerType = props => {
    trackCompletedOrder(props.cartToUpdate, props.apiResult.billTo);
};

export const DispatchCompletePlaceOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/CompletePlaceOrder",
    });
};

export const DispatchResetOrderApprovals: HandlerType = props => {
    props.dispatch({
        type: "Data/OrderApprovals/Reset",
    });
};

export const DispatchResetOrders: HandlerType = props => {
    props.dispatch({
        type: "Data/Orders/Reset",
    });
};

export const DispatchResetPaymentProfiles: HandlerType = props => {
    if (props.parameter.saveCard) {
        props.dispatch({
            type: "Data/PaymentProfiles/Reset",
        });
    }
};

export const DispatchResetQuotes: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (cartId) {
        props.dispatch({
            type: "Data/Quotes/Reset",
        });
        props.dispatch({
            type: "Data/JobQuotes/Reset",
        });
    }
};

export const chain = [
    DispatchBeginPlaceOrder,
    SetCartStatus,
    SetPaymentMethod,
    SetCreditCard,
    SetECheck,
    PopulateApiParameter,
    UpdateCart,
    ReloadCurrentCart,
    ExecuteOnSuccessCallback,
    SendTracking,
    DispatchCompletePlaceOrder,
    DispatchResetOrders,
    DispatchResetPaymentProfiles,
    DispatchResetOrderApprovals,
    DispatchResetQuotes,
];

const placeOrder = createHandlerChainRunner(chain, "PlaceOrder");
export default placeOrder;
