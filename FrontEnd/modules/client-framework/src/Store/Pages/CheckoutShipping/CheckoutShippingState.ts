import { BillToModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";

type OneTimeAddressState = {
    address: ShipToModel;
    formErrors: {
        [key: string]: React.ReactNode;
    };
};

type BillingAddressFormState = {
    address: BillToModel;
    formErrors: {
        [key: string]: React.ReactNode;
    };
};

type ShippingAddressFormState = {
    address: ShipToModel;
    formErrors: {
        [key: string]: React.ReactNode;
    };
};

export default interface CheckoutShippingState {
    cartId?: string;
    editedCartNotes?: string;
    isPreloadingData: boolean;
    isUpdatingCart: boolean;
    useBillingAddress: boolean;
    useOneTimeAddress: boolean;
    oneTimeAddressState?: OneTimeAddressState;
    billingAddressFormState?: BillingAddressFormState;
    shippingAddressFormState?: ShippingAddressFormState;
    lastSelectedShippingAddress: ShipToModel;
    isBillingAddressUpdateRequired: boolean;
    isShippingAddressUpdateRequired: boolean;
}
