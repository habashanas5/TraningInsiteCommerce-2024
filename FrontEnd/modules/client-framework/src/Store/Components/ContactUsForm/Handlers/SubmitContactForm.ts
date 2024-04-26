import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { submitContactUsForm, SubmitContactUsFormApiParameter } from "@insite/client-framework/Services/EmailService";

type SubmitContactFormParameter = {
    emailRecipients: string;
} & HasOnSuccess;

type HandlerType = ApiHandlerDiscreteParameter<SubmitContactFormParameter, SubmitContactUsFormApiParameter>;

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState().components.contactUsForm;
    props.apiParameter = {
        topic: state.fieldValues["topic"],
        firstName: state.fieldValues["firstName"],
        lastName: state.fieldValues["lastName"],
        phoneNumber: state.fieldValues["phoneNumber"],
        emailAddress: state.fieldValues["emailAddress"],
        message: state.fieldValues["message"],
        emailTo: props.parameter.emailRecipients,
    };
};

export const SendDataToApi: HandlerType = async props => {
    await submitContactUsForm(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [PopulateApiParameter, SendDataToApi, ExecuteOnSuccessCallback];

const submitContactForm = createHandlerChainRunner(chain, "SubmitContactForm");
export default submitContactForm;
