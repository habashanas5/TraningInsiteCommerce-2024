import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { getAccount, GetAccountApiParameter } from "@insite/client-framework/Services/AccountService";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    { accountId: string } & HasOnSuccess,
    GetAccountApiParameter,
    AccountModel
>;

export const DispatchBeginLoadAccount: HandlerType = props => {
    props.dispatch({
        type: "Data/Accounts/BeginLoadAccount",
        id: props.parameter.accountId,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        accountId: props.parameter.accountId,
        expand: ["approvers", "roles"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getAccount(props.apiParameter);
};

export const DispatchCompleteLoadAccount: HandlerType = props => {
    props.dispatch({
        type: "Data/Accounts/CompleteLoadAccount",
        overriddenId: props.parameter.accountId,
        model: props.apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => props.parameter.onSuccess?.();

export const chain = [
    DispatchBeginLoadAccount,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadAccount,
    ExecuteOnSuccessCallback,
];

const loadAccount = createHandlerChainRunner(chain, "LoadAccount");
export default loadAccount;
