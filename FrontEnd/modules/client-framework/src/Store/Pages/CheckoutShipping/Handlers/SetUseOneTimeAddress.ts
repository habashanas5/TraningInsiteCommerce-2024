import { createHandlerChainRunner, Handler, makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { Cart } from "@insite/client-framework/Services/CartService";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import setCurrentShipTo from "@insite/client-framework/Store/Context/Handlers/SetCurrentShipTo";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import loadShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTos";
import { getShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import validateShippingAddressForm from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/ValidateShippingAddressForm";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import cloneDeep from "lodash/cloneDeep";

type HandlerType = Handler<
    {
        useOneTimeAddress: boolean;
    },
    {
        cart: Cart;
        shipTosForBillTo: ShipToModel[];
        shipToForEditing: ShipToModel;
    }
>;

export const ValidateContext: HandlerType = ({ getState }) => {
    const state = getState();
    const {
        context: { session },
    } = state;
    const { allowOneTimeAddresses } = getSettingsCollection(state).customerSettings;
    if (session.fulfillmentMethod === FulfillmentMethod.PickUp) {
        throw new Error("A shipping address does not apply to a pickup order.");
    }
    if (!allowOneTimeAddresses) {
        throw new Error("This action can only be performed if creating one-time addresses is allowed.");
    }
};

export const PopulateCart: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;
    if (!cart) {
        throw new Error(
            "The cart is not loaded. It must be loaded before the addresses associated with it can be edited.",
        );
    }

    props.cart = cart;
};

export const GetShipTosForBillTo: HandlerType = async props => {
    const { dispatch, getState, cart } = props;
    const state = getState();
    const shipTosParameter: GetShipTosApiParameter = {
        billToId: cart.billToId,
        expand: ["validation"],
        exclude: ["showAll"],
    };
    let shipTosDataView = getShipTosDataView(state, shipTosParameter);
    if (!shipTosDataView.value) {
        const awaitableLoadShiptos = makeHandlerChainAwaitable(loadShipTos);
        await awaitableLoadShiptos(shipTosParameter)(dispatch, getState);

        shipTosDataView = getShipTosDataView(state, shipTosParameter);
    }

    props.shipTosForBillTo = shipTosDataView.value!;
};

export const SetShipToForEditing: HandlerType = props => {
    const {
        getState,
        parameter: { useOneTimeAddress },
        cart,
        shipTosForBillTo,
    } = props;
    const state = getState();

    if (useOneTimeAddress) {
        const shipTo = shipTosForBillTo.find(o => o.oneTimeAddress);
        if (!shipTo) {
            throw new Error("The one-time address shipto was not found in the cart. It must be loaded with the cart.");
        }

        props.shipToForEditing = {
            ...cloneDeep(shipTo),
            firstName: "",
            lastName: "",
            attention: "",
            companyName: "",
            address1: "",
            address2: "",
            address3: "",
            address4: "",
            city: "",
            state: null,
            postalCode: "",
            phone: "",
            email: "",
            fax: "",
        };

        const countries = getCurrentCountries(state);
        if (!countries) {
            throw new Error("There were no countries loaded yet");
        }

        props.shipToForEditing.country = countries.length === 1 ? countries[0] : null;
    } else {
        const {
            pages: {
                checkoutShipping: { lastSelectedShippingAddress },
            },
        } = getState();
        let shipTo: ShipToModel | undefined = lastSelectedShippingAddress;
        if (shipTo.id === cart.billToId) {
            shipTo = shipTosForBillTo.find(o => o.isDefault);
            if (!shipTo) {
                shipTo = shipTosForBillTo.find(o => !o.isNew && !o.oneTimeAddress && o.id !== cart.billToId);
            }
            if (!shipTo) {
                throw new Error(
                    "No applicable shipto (e.g. one-time, billto) was found in the cart. At least one shipto must be available to allow editing.",
                );
            }
        }

        props.shipToForEditing = shipTo;
    }
};

export const SetCurrentShipTo: HandlerType = props => {
    if (!props.parameter.useOneTimeAddress) {
        props.dispatch(
            setCurrentShipTo({
                shipToId: props.shipToForEditing.id,
            }),
        );
    }
};

export const ValidateShippingAddress: HandlerType = async props => {
    let addressFieldsDataView = getAddressFieldsDataView(props.getState());
    if (!addressFieldsDataView.value) {
        addressFieldsDataView = getAddressFieldsDataView(props.getState());
    }

    const awaitableValidate = makeHandlerChainAwaitable<Parameters<typeof validateShippingAddressForm>[0], boolean>(
        validateShippingAddressForm,
    );
    const isShippingAddressValid = await awaitableValidate({
        address: props.shipToForEditing,
        validation: props.shipToForEditing.validation!,
        fieldDisplay: addressFieldsDataView.value!.shipToAddressFields,
    })(props.dispatch, props.getState);

    props.dispatch({
        type: "Pages/CheckoutShipping/SetIsShippingAddressUpdateRequired",
        isShippingAddressUpdateRequired: !isShippingAddressValid,
    });
};

export const DispatchSetUseOneTimeAddress: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/SetUseOneTimeAddress",
        useOneTimeAddress: props.parameter.useOneTimeAddress,
        shipTo: props.shipToForEditing,
    });
};

export const chain = [
    ValidateContext,
    PopulateCart,
    GetShipTosForBillTo,
    SetShipToForEditing,
    SetCurrentShipTo,
    ValidateShippingAddress,
    DispatchSetUseOneTimeAddress,
];

const setUseOneTimeAddress = createHandlerChainRunner(chain, "SetUseOneTimeAddress");
export default setUseOneTimeAddress;
