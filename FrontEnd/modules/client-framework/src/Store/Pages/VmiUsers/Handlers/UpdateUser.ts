import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { updateVmiUser, UpdateVmiUserApiParameter } from "@insite/client-framework/Services/AccountService";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import loadAccounts from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccounts";
import { VmiUserModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        userId: string;
        role?: string;
        vmiLocationIds: string[] | null;
        removeVmiPermissions?: boolean;
        reloadVmiUsers?: boolean;
    } & HasOnError<string> &
        HasOnSuccess,
    UpdateVmiUserApiParameter,
    ServiceResult<VmiUserModel>
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        vmiUser: {
            userId: props.parameter.userId,
            role: props.parameter.role,
            vmiLocationIds: props.parameter.vmiLocationIds,
            removeVmiPermissions: props.parameter.removeVmiPermissions,
        },
    };
};

export const CallUpdateVmiUser: HandlerType = async props => {
    props.apiResult = await updateVmiUser(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.apiResult.successful) {
        props.parameter.onSuccess?.();
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (!props.apiResult.successful) {
        props.parameter.onError?.(props.apiResult.errorMessage);
    }
};

export const DispatchLoadAccounts: HandlerType = props => {
    if (props.parameter.reloadVmiUsers) {
        const getVmiUsersParameter = props.getState().pages.vmiUsers.getVmiUsersParameter;
        props.dispatch(loadAccounts(getVmiUsersParameter));
    }
};

export const chain = [
    PopulateApiParameter,
    CallUpdateVmiUser,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
    DispatchLoadAccounts,
];

const updateUser = createHandlerChainRunner(chain, "UpdateUser");
export default updateUser;
