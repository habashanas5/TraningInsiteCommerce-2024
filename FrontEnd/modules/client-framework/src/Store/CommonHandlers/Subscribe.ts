import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { subscribeToList, SubscribeToListApiParameter } from "@insite/client-framework/Services/EmailService";

export interface SubscribeParameter {
    email: string;
    onSuccess?: () => void;
}

type HandlerType = ApiHandlerDiscreteParameter<SubscribeParameter, SubscribeToListApiParameter>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { emailAddress: props.parameter.email };
};

export const SendDataToApi: HandlerType = async props => {
    await subscribeToList(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [PopulateApiParameter, SendDataToApi, ExecuteOnSuccessCallback];

const subscribeHandler = createHandlerChainRunner(chain, "SubscribeHandler");
export default subscribeHandler;
