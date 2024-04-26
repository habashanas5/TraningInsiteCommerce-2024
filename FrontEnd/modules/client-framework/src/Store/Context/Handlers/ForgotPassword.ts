import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import {
    forgotPassword as forgotPasswordApi,
    ForgotPasswordApiParameter,
    Session,
} from "@insite/client-framework/Services/SessionService";

type ResetPasswordParameter = {
    userName: string;
    onError?: (error: string) => void;
} & HasOnSuccess;

type HandlerType = ApiHandlerDiscreteParameter<
    ResetPasswordParameter,
    ForgotPasswordApiParameter,
    ServiceResult<Session>
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { userName: props.parameter.userName };
};

export const UpdateSession: HandlerType = async props => {
    props.apiResult = await forgotPasswordApi(props.apiParameter);
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (!props.apiResult.successful) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.apiResult.errorMessage);
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.apiResult.successful) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.();
    }
};

export const chain = [PopulateApiParameter, UpdateSession, ExecuteOnErrorCallback, ExecuteOnSuccessCallback];

const forgotPassword = createHandlerChainRunner(chain, "ForgotPassword");
export default forgotPassword;
