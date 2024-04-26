import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import UserListState from "@insite/client-framework/Store/Pages/UserList/UserListState";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";
import { Draft } from "immer";

const initialState: UserListState = {
    getAccountsParameter: {
        expand: ["administration"],
        sort: "UserName",
    },
};

const reducer = {
    "Pages/UserList/UpdateSearchFields": (
        draft: Draft<UserListState>,
        action: { parameter: GetAccountsApiParameter & UpdateSearchFieldsType },
    ) => {
        const { type } = action.parameter;
        delete action.parameter.type;
        if (type === "Replace") {
            draft.getAccountsParameter = action.parameter;
        } else if (type === "Initialize") {
            draft.getAccountsParameter = { ...initialState.getAccountsParameter, ...action.parameter };
        } else {
            draft.getAccountsParameter = { ...draft.getAccountsParameter, ...action.parameter };

            for (const key in draft.getAccountsParameter) {
                const value = (<any>draft.getAccountsParameter)[key];

                // remove empty parameters
                if (value === "" || value === undefined) {
                    delete (<any>draft.getAccountsParameter)[key];
                }
            }

            for (const key in action.parameter) {
                // go back to page 1 if any other parameters changed
                if (
                    draft.getAccountsParameter.page &&
                    draft.getAccountsParameter.page > 1 &&
                    key !== "page" &&
                    key !== "pageSize"
                ) {
                    draft.getAccountsParameter.page = 1;
                }
            }
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
