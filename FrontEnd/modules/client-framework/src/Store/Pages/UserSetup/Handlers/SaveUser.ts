import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { UpdateAccountApiParameter, updateAccountWithResult } from "@insite/client-framework/Services/AccountService";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import { Session, updateSession } from "@insite/client-framework/Services/SessionService";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import { getCurrentEditingUser } from "@insite/client-framework/Store/Pages/UserSetup/UserSetupSelectors";
import { AccountModel, AccountSettingsModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        onError?: (error: string) => void;
    } & HasOnSuccess,
    UpdateAccountApiParameter,
    ServiceResult<AccountModel>,
    { accountSettings: AccountSettingsModel }
>;

export const PopulateApiParameter: HandlerType = props => {
    const editingUser = getCurrentEditingUser(props.getState());
    if (!editingUser) {
        return false;
    }

    props.accountSettings = getSettingsCollection(props.getState()).accountSettings;

    props.apiParameter = {
        account: {
            ...editingUser,
            userName: props.accountSettings.useEmailAsUserName ? editingUser.email : editingUser.userName,
        },
    };
};

export const CallUpdateAccount: HandlerType = async props => {
    props.apiResult = await updateAccountWithResult(props.apiParameter);
};

export const CallUpdateSessionIfNeeded: HandlerType = async props => {
    const state = props.getState();
    const initialUserEmail = state.pages.userSetup.initialUserEmail;
    const currentUser = getCurrentAccountState(state).value;
    const updatedAccount = props.apiResult.successful ? props.apiResult.result : undefined;
    const isCurrentUser = currentUser && currentUser.id === updatedAccount?.id;
    if (props.accountSettings.useEmailAsUserName && isCurrentUser && updatedAccount?.email !== initialUserEmail) {
        await updateSession({ session: {} as Session });
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.apiResult.successful) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.();
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (!props.apiResult.successful) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.apiResult.errorMessage);
    }
};

export const DispatchCompleteLoadAccount: HandlerType = props => {
    if (props.apiResult.successful) {
        props.dispatch({
            type: "Data/Accounts/CompleteLoadAccount",
            model: props.apiResult.result,
        });
    }
};

export const chain = [
    PopulateApiParameter,
    CallUpdateAccount,
    CallUpdateSessionIfNeeded,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
    DispatchCompleteLoadAccount,
];

const saveUser = createHandlerChainRunner(chain, "SaveUser");
export default saveUser;
