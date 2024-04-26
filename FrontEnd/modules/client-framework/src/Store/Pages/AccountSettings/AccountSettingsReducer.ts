import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import AccountSettingsState from "@insite/client-framework/Store/Pages/AccountSettings/AccountSettingsState";
import { AccountModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: AccountSettingsState = {
    emailErrorMessage: "",
    useDefaultCustomer: false,
    initialUseDefaultCustomer: false,
    showSelectDefaultCustomer: false,
};

const reducer = {
    "Pages/AccountSettings/UpdateAccountSettings": (
        draft: Draft<AccountSettingsState>,
        action: {
            isSubscribed?: boolean;
            email?: string;
            emailErrorMessage?: string;
            billToId?: string;
            shipToId?: string;
            useDefaultCustomer?: boolean;
            fulfillmentMethod?: string;
            defaultWarehouse?: WarehouseModel;
        },
    ) => {
        if (!draft.editingAccount) {
            throw new Error("There was no editingAccount set and we are trying to update it.");
        }

        if (typeof action.isSubscribed !== "undefined") {
            draft.editingAccount.isSubscribed = action.isSubscribed;
        }

        if (typeof action.email !== "undefined") {
            draft.editingAccount.email = action.email;
            draft.emailErrorMessage = action.emailErrorMessage;
        }

        if (action.billToId) {
            draft.selectedBillToId = action.billToId;
            draft.selectedShipToId = undefined;
            draft.editingAccount.defaultCustomerId = null;
        }

        if (action.shipToId) {
            draft.selectedShipToId = action.shipToId;
            draft.editingAccount.defaultCustomerId = action.shipToId;
            draft.editingAccount.setDefaultCustomer = draft.editingAccount.defaultCustomerId !== draft.initialShipToId;
        }

        if (action.fulfillmentMethod) {
            draft.editingAccount.defaultFulfillmentMethod = action.fulfillmentMethod;
        }

        if (action.defaultWarehouse) {
            draft.editingAccount.defaultWarehouse = action.defaultWarehouse;
            draft.editingAccount.defaultWarehouseId = action.defaultWarehouse.id;
        }

        if (typeof action.useDefaultCustomer !== "undefined") {
            draft.useDefaultCustomer = action.useDefaultCustomer;
            if (!action.useDefaultCustomer) {
                draft.editingAccount.defaultFulfillmentMethod = FulfillmentMethod.Ship;
                draft.editingAccount.defaultWarehouse = null;
                draft.editingAccount.defaultWarehouseId = null;
                draft.editingAccount.defaultCustomerId = null;
            } else {
                draft.editingAccount.defaultCustomerId =
                    (draft.initialUseDefaultCustomer ? draft.initialShipToId : draft.selectedShipToId) || null;
            }
            draft.editingAccount.setDefaultCustomer =
                draft.editingAccount.defaultCustomerId !== (draft.initialShipToId ?? null);
        }
    },
    "Pages/AccountSettings/SetInitialValues": (
        draft: Draft<AccountSettingsState>,
        action: {
            defaultBillToId?: string;
            defaultShipToId?: string;
            showSelectDefaultCustomer: boolean;
            useDefaultCustomer: boolean;
            account: AccountModel;
        },
    ) => {
        draft.selectedBillToId = action.defaultBillToId;
        draft.selectedShipToId = action.defaultShipToId;
        draft.initialShipToId = draft.selectedShipToId;
        draft.useDefaultCustomer = action.useDefaultCustomer;
        draft.initialUseDefaultCustomer = draft.useDefaultCustomer;
        draft.showSelectDefaultCustomer = action.showSelectDefaultCustomer;
        draft.editingAccount = {
            ...action.account,
            defaultCustomerId: draft.selectedShipToId ?? null,
        };
        delete draft.emailErrorMessage;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
