import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Cart } from "@insite/client-framework/Services/CartService";
import CheckoutShippingState from "@insite/client-framework/Store/Pages/CheckoutShipping/CheckoutShippingState";
import { BillToModel, CountryModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: CheckoutShippingState = {
    isPreloadingData: false,
    isUpdatingCart: false,
    useBillingAddress: true,
    useOneTimeAddress: false,
    lastSelectedShippingAddress: {} as ShipToModel,
    isBillingAddressUpdateRequired: false,
    isShippingAddressUpdateRequired: false,
};

const reducer = {
    "Pages/CheckoutShipping/SetInitialValues": (
        draft: Draft<CheckoutShippingState>,
        action: {
            cart: Cart;
            shipTo: ShipToModel;
            billTo: BillToModel;
            country: CountryModel | undefined;
        },
    ) => {
        const { cart } = action;
        draft.useBillingAddress = cart.billToId === cart.shipToId;
        draft.useOneTimeAddress = action.shipTo.oneTimeAddress;

        if (action.country) {
            action.billTo.country = action.country;
            action.shipTo.country = action.country;
        }

        draft.billingAddressFormState = {
            address: action.billTo,
            formErrors: {},
        };

        draft.shippingAddressFormState = {
            address: action.shipTo,
            formErrors: {},
        };

        draft.editedCartNotes = undefined;
    },
    "Pages/CheckoutShipping/SetLastSelectedShipTo": (
        draft: Draft<CheckoutShippingState>,
        action: { shipTo: ShipToModel },
    ) => {
        draft.lastSelectedShippingAddress = action.shipTo;
        draft.useBillingAddress = false;
    },
    "Pages/CheckoutShipping/SetNotes": (draft: Draft<CheckoutShippingState>, action: { notes: string }) => {
        draft.editedCartNotes = action.notes;
    },
    "Pages/CheckoutShipping/BeginUpdateCart": (draft: Draft<CheckoutShippingState>) => {
        draft.isUpdatingCart = true;
    },
    "Pages/CheckoutShipping/CompleteUpdateCart": (draft: Draft<CheckoutShippingState>) => {
        draft.isUpdatingCart = false;
    },
    "Pages/CheckoutShipping/CompleteUpdateShipTo": (
        draft: Draft<CheckoutShippingState>,
        action: { shipTo: ShipToModel },
    ) => {
        draft.shippingAddressFormState = {
            address: action.shipTo,
            formErrors: {},
        };
        draft.useOneTimeAddress = false;
    },
    "Pages/CheckoutShipping/CompleteUpdateBillTo": (
        draft: Draft<CheckoutShippingState>,
        action: { billTo: BillToModel },
    ) => {
        draft.billingAddressFormState = {
            address: action.billTo,
            formErrors: {},
        };
    },
    "Pages/CheckoutShipping/SetCartId": (draft: Draft<CheckoutShippingState>, action: { cartId?: string }) => {
        draft.cartId = action.cartId;
    },
    "Pages/CheckoutShipping/SetIsPreloadingData": (
        draft: Draft<CheckoutShippingState>,
        action: { isPreloadingData: boolean },
    ) => {
        draft.isPreloadingData = action.isPreloadingData;
    },
    "Pages/CheckoutShipping/SetOneTimeShippingAddress": (
        draft: Draft<CheckoutShippingState>,
        action: { address: ShipToModel },
    ) => {
        if (!draft.oneTimeAddressState) {
            return;
        }

        draft.oneTimeAddressState.address = action.address;
    },
    "Pages/CheckoutShipping/SetOneTimeShippingAddressFormErrors": (
        draft: Draft<CheckoutShippingState>,
        action: { formErrors: { [key: string]: React.ReactNode } },
    ) => {
        if (!draft.oneTimeAddressState) {
            return;
        }

        draft.oneTimeAddressState.formErrors = action.formErrors;
    },
    "Pages/CheckoutShipping/SetBillingAddress": (
        draft: Draft<CheckoutShippingState>,
        action: { address: BillToModel },
    ) => {
        if (!draft.billingAddressFormState) {
            return;
        }

        draft.billingAddressFormState.address = action.address;
    },
    "Pages/CheckoutShipping/SetBillingAddressFormErrors": (
        draft: Draft<CheckoutShippingState>,
        action: { formErrors: { [key: string]: React.ReactNode } },
    ) => {
        if (!draft.billingAddressFormState) {
            return;
        }

        draft.billingAddressFormState.formErrors = action.formErrors;
    },
    "Pages/CheckoutShipping/SetShippingAddress": (
        draft: Draft<CheckoutShippingState>,
        action: { address: ShipToModel },
    ) => {
        if (!draft.shippingAddressFormState) {
            return;
        }

        draft.shippingAddressFormState.address = action.address;
    },
    "Pages/CheckoutShipping/SetShippingAddressFormErrors": (
        draft: Draft<CheckoutShippingState>,
        action: { formErrors: { [key: string]: React.ReactNode } },
    ) => {
        if (!draft.shippingAddressFormState) {
            return;
        }

        draft.shippingAddressFormState.formErrors = action.formErrors;
    },
    "Pages/CheckoutShipping/SetUseBillingAddress": (
        draft: Draft<CheckoutShippingState>,
        { useBillingAddress, shipTo }: { useBillingAddress: boolean; shipTo: ShipToModel },
    ) => {
        draft.useBillingAddress = useBillingAddress;
        draft.useOneTimeAddress = false;
        draft.shippingAddressFormState = {
            address: shipTo,
            formErrors: {},
        };
    },
    "Pages/CheckoutShipping/SetUseOneTimeAddress": (
        draft: Draft<CheckoutShippingState>,
        { useOneTimeAddress, shipTo }: { useOneTimeAddress: boolean; shipTo: ShipToModel | undefined },
    ) => {
        draft.useOneTimeAddress = useOneTimeAddress;
        draft.useBillingAddress = false;

        if (!shipTo) {
            return;
        }

        draft.shippingAddressFormState = {
            address: shipTo,
            formErrors: {},
        };
    },
    "Pages/CheckoutShipping/SetIsBillingAddressUpdateRequired": (
        draft: Draft<CheckoutShippingState>,
        action: { isBillingAddressUpdateRequired: boolean },
    ) => {
        draft.isBillingAddressUpdateRequired = action.isBillingAddressUpdateRequired;
    },
    "Pages/CheckoutShipping/SetIsShippingAddressUpdateRequired": (
        draft: Draft<CheckoutShippingState>,
        action: { isShippingAddressUpdateRequired: boolean },
    ) => {
        draft.isShippingAddressUpdateRequired = action.isShippingAddressUpdateRequired;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
