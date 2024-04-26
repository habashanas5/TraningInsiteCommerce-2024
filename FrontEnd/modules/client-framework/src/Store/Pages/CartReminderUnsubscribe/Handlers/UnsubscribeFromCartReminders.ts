import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import {
    Session,
    UpdateSessionApiParameter,
    updateSessionWithResult,
} from "@insite/client-framework/Services/SessionService";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        userName?: string;
        unsubscribeToken?: string;
    },
    UpdateSessionApiParameter,
    Session,
    {
        userEmail?: string;
        unsubscribeError?: string;
    }
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            userName: props.parameter.userName,
            cartReminderUnsubscribeToken: props.parameter.unsubscribeToken,
        },
    };
};

export const SendDataToApi: HandlerType = async props => {
    const result = await updateSessionWithResult(props.apiParameter);
    if (result.successful) {
        props.userEmail = result.result.cartReminderUnsubscribeEmail;
    } else {
        props.unsubscribeError = result.errorMessage;
        return false;
    }
};

export const DispatchCompleteUnsubscribeFromCartReminders: HandlerType = props => {
    props.dispatch({
        type: "Pages/CartReminderUnsubscribe/CompleteUnsubscribeFromCartReminders",
        userEmail: props.userEmail,
        unsubscribeError: props.unsubscribeError,
    });
};

export const chain = [PopulateApiParameter, SendDataToApi, DispatchCompleteUnsubscribeFromCartReminders];

const unsubscribeFromCartReminders = createHandlerChainRunner(chain, "UnsubscribeFromCartReminders");
export default unsubscribeFromCartReminders;
