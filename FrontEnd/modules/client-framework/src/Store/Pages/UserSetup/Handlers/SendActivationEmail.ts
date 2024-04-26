import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import {
    sendAccountActivationEmail,
    SendAccountActivationEmailApiParameter,
    Session,
} from "@insite/client-framework/Services/SessionService";

type SendActivationEmailParameter = {
    userName: string;
} & HasOnSuccess &
    HasOnError<string>;

type HandlerType = ApiHandlerDiscreteParameter<
    SendActivationEmailParameter,
    SendAccountActivationEmailApiParameter,
    ServiceResult<Session>
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        userName: props.parameter.userName,
    };
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await sendAccountActivationEmail(props.apiParameter);
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

export const chain = [PopulateApiParameter, SendDataToApi, ExecuteOnSuccessCallback, ExecuteOnErrorCallback];

const sendActivationEmail = createHandlerChainRunner(chain, "SendActivationEmail");
export default sendActivationEmail;
