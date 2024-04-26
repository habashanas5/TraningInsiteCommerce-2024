import {
    createHandlerChainRunnerOptionalParameter,
    Handler,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { Cart } from "@insite/client-framework/Services/CartService";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import validateAddress, { AddressErrors } from "@insite/client-framework/Store/CommonHandlers/ValidateAddress";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import { getShipTosDataView, getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import loadShipTos from "@insite/client-framework/Store/Pages/Addresses/Handlers/LoadShipTos";
import { BillToModel, CountryModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import cloneDeep from "lodash/cloneDeep";

type HandlerType = Handler<
    {},
    {
        cart: Cart;
        billTo: BillToModel;
        shipTo: ShipToModel;
        country: CountryModel | undefined;
        shipTos: ShipToModel[];
    }
>;

export const SetCart: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;
    if (!cart) {
        throw new Error("There was no current cart and we are trying to use it to set initial values");
    }

    props.cart = cart;
};

export const SetBillTo: HandlerType = props => {
    if (!props.cart.billToId) {
        return;
    }

    const state = props.getState();
    const billTo = getBillToState(state, props.cart.billToId).value;
    if (!billTo) {
        throw new Error("The bill to for the current cart was not loaded.");
    }

    props.billTo = cloneDeep(billTo);
};

export const SetShipTo: HandlerType = props => {
    if (!props.cart.shipToId) {
        return;
    }

    const state = props.getState();
    const shipTo = getShipToState(state, props.cart.shipToId).value;
    if (!shipTo) {
        throw new Error("The ship to for the current cart was not loaded.");
    }

    props.shipTo = cloneDeep(shipTo);
};

export const GetCountryForBillToAndShipTo: HandlerType = props => {
    const countries = getCurrentCountries(props.getState());
    if (!countries) {
        throw new Error("There were no countries loaded yet");
    }

    if (countries.length === 1) {
        props.country = countries[0];
    }
};

export const DispatchSetInitialValues: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/SetInitialValues",
        cart: props.cart,
        shipTo: props.shipTo,
        billTo: props.billTo,
        country: props.country,
    });
};

export const LoadShipTos: HandlerType = async props => {
    const loadShipTosParameter: GetShipTosApiParameter = {
        billToId: props.billTo.id,
        expand: ["validation"],
        exclude: ["createNew", "oneTime", "showAll"],
    };

    const getShipTos = () => getShipTosDataView(props.getState(), loadShipTosParameter).value;
    let shipTos = getShipTos();
    if (!shipTos) {
        const awaitableLoadShipTos = makeHandlerChainAwaitable(loadShipTos);
        await awaitableLoadShipTos(loadShipTosParameter)(props.dispatch, props.getState);
        shipTos = getShipTos();
    }

    if (!shipTos?.length) {
        throw new Error("Could not find any shiptos for the selected billto.");
    }

    props.shipTos = shipTos;
};

export const DispatchSetLastSelectedShipTo: HandlerType = props => {
    const {
        pages: {
            checkoutShipping: { useOneTimeAddress },
        },
    } = props.getState();
    if (useOneTimeAddress) {
        return;
    }

    props.dispatch({
        type: "Pages/CheckoutShipping/SetLastSelectedShipTo",
        shipTo: props.shipTo,
    });
};

export const ValidateBillingAddress: HandlerType = async ({ dispatch, getState, billTo }) => {
    const state = getState();
    const {
        pages: {
            checkoutShipping: { billingAddressFormState },
        },
    } = state;
    if (!billingAddressFormState) {
        return;
    }

    let addressFieldsDataView = getAddressFieldsDataView(state);
    if (!addressFieldsDataView.value) {
        addressFieldsDataView = getAddressFieldsDataView(state);
    }

    const awaitableValidate = makeHandlerChainAwaitable<Parameters<typeof validateAddress>[0], AddressErrors>(
        validateAddress,
    );
    const billingAddressErrors = await awaitableValidate({
        address: billTo,
        validationRules: billTo.validation!,
        addressFieldDisplayCollection: addressFieldsDataView.value!.billToAddressFields,
    })(dispatch, getState);
    const isBillingAddressValid = Object.keys(billingAddressErrors).length === 0;

    dispatch({
        type: "Pages/CheckoutShipping/SetIsBillingAddressUpdateRequired",
        isBillingAddressUpdateRequired: !isBillingAddressValid,
    });
};

export const ValidateShippingAddress: HandlerType = async ({ dispatch, getState, shipTo }) => {
    const state = getState();
    const {
        context: { session },
    } = state;
    if (session.fulfillmentMethod === FulfillmentMethod.PickUp) {
        return;
    }

    let addressFieldsDataView = getAddressFieldsDataView(state);
    if (!addressFieldsDataView.value) {
        addressFieldsDataView = getAddressFieldsDataView(state);
    }

    const awaitableValidate = makeHandlerChainAwaitable<Parameters<typeof validateAddress>[0], AddressErrors>(
        validateAddress,
    );
    const shippingAddressErrors = await awaitableValidate({
        address: shipTo,
        validationRules: shipTo.validation!,
        addressFieldDisplayCollection: addressFieldsDataView.value!.shipToAddressFields,
    })(dispatch, getState);
    const isShippingAddressValid = Object.keys(shippingAddressErrors).length === 0;

    dispatch({
        type: "Pages/CheckoutShipping/SetIsShippingAddressUpdateRequired",
        isShippingAddressUpdateRequired: !isShippingAddressValid,
    });
};

export const chain = [
    SetCart,
    SetBillTo,
    SetShipTo,
    GetCountryForBillToAndShipTo,
    DispatchSetInitialValues,
    DispatchSetLastSelectedShipTo,
    ValidateBillingAddress,
    ValidateShippingAddress,
];

const setInitialValues = createHandlerChainRunnerOptionalParameter(chain, {}, "SetInitialValues");
export default setInitialValues;
