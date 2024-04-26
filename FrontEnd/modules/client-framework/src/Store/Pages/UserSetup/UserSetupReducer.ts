import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetAccountShipToCollectionApiParameter } from "@insite/client-framework/Services/AccountService";
import UserSetupState from "@insite/client-framework/Store/Pages/UserSetup/UserSetupState";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";
import { Draft } from "immer";

const initialState: UserSetupState = {
    getAccountShipToCollectionParameter: {
        accountId: "",
        sort: "ShipTo",
    },
};

const reducer = {
    "Pages/UserSetup/SetUserId": (draft: Draft<UserSetupState>, action: { userId: string }) => {
        draft.userId = action.userId;
        draft.editingUser = undefined;
        draft.getAccountShipToCollectionParameter.accountId = action.userId;
    },
    "Pages/UserSetup/SetInitialValues": (draft: Draft<UserSetupState>, action: { user: AccountModel }) => {
        draft.editingUser = action.user;
        draft.initialUserEmail = action.user.email;
    },
    "Pages/UserSetup/SetUserFields": (
        draft: Draft<UserSetupState>,
        action: {
            updatedUser?: AccountModel;
            emailErrorMessage?: React.ReactNode;
            firstNameErrorMessage?: React.ReactNode;
            lastNameErrorMessage?: React.ReactNode;
        },
    ) => {
        draft.editingUser = action.updatedUser;
        draft.emailErrorMessage = action.emailErrorMessage;
        draft.firstNameErrorMessage = action.firstNameErrorMessage;
        draft.lastNameErrorMessage = action.lastNameErrorMessage;
    },
    "Pages/UserSetup/UpdateSearchFields": (
        draft: Draft<UserSetupState>,
        action: { parameter: GetAccountShipToCollectionApiParameter & UpdateSearchFieldsType },
    ) => {
        const { type } = action.parameter;
        delete action.parameter.type;
        if (type === "Replace") {
            draft.getAccountShipToCollectionParameter = action.parameter;
        } else if (type === "Initialize") {
            draft.getAccountShipToCollectionParameter = {
                ...initialState.getAccountShipToCollectionParameter,
                ...action.parameter,
            };
        } else {
            draft.getAccountShipToCollectionParameter = {
                ...draft.getAccountShipToCollectionParameter,
                ...action.parameter,
            };

            for (const key in draft.getAccountShipToCollectionParameter) {
                const value = (<any>draft.getAccountShipToCollectionParameter)[key];

                // remove empty parameters
                if (value === "" || value === undefined) {
                    delete (<any>draft.getAccountShipToCollectionParameter)[key];
                }
            }

            for (const key in action.parameter) {
                // go back to page 1 if any other parameters changed
                if (
                    draft.getAccountShipToCollectionParameter.page &&
                    draft.getAccountShipToCollectionParameter.page > 1 &&
                    key !== "page" &&
                    key !== "pageSize"
                ) {
                    draft.getAccountShipToCollectionParameter.page = 1;
                }
            }
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
