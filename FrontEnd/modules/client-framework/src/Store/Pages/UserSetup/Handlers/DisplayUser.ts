import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { GetAccountApiParameter } from "@insite/client-framework/Services/AccountService";
import { getAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import loadAccount from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccount";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ userId: string }, GetAccountApiParameter, AccountModel>;

export const DispatchSetUserId: HandlerType = props => {
    props.dispatch({
        type: "Pages/UserSetup/SetUserId",
        userId: props.parameter.userId,
    });
};

export const DispatchLoadAccountIfNeeded: HandlerType = async props => {
    const { dispatch, getState, parameter } = props;
    const accountState = getAccountState(getState(), parameter.userId);
    if (!accountState.value || !accountState.value.availableRoles || !accountState.value.availableApprovers) {
        const awaitableLoadAccount = makeHandlerChainAwaitable(loadAccount);
        await awaitableLoadAccount({ accountId: parameter.userId })(dispatch, getState);
    }
};

export const DispatchSetInitialValues: HandlerType = props => {
    const user = getAccountState(props.getState(), props.parameter.userId).value;
    if (!user) {
        throw new Error("There was no user and we were trying to set initial values for the user setup page.");
    }

    props.dispatch({
        type: "Pages/UserSetup/SetInitialValues",
        user,
    });
};

export const chain = [DispatchSetUserId, DispatchLoadAccountIfNeeded, DispatchSetInitialValues];

const displayUser = createHandlerChainRunner(chain, "DisplayUser");
export default displayUser;
