import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import {
    resetPassword as resetPasswordApi,
    ResetPasswordApiParameter,
    Session,
} from "@insite/client-framework/Services/SessionService";

type HandlerType = ApiHandlerDiscreteParameter<
    ResetPasswordApiParameter & HasOnSuccess & { onError?: (error: string) => void },
    ResetPasswordApiParameter,
    ServiceResult<Session>
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const UpdateSession: HandlerType = async props => {
    props.apiResult = await resetPasswordApi(props.apiParameter);
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

export const chain = [PopulateApiParameter, UpdateSession, ExecuteOnSuccessCallback, ExecuteOnErrorCallback];

const resetPassword = createHandlerChainRunner(chain, "ResetPassword");
export default resetPassword;
