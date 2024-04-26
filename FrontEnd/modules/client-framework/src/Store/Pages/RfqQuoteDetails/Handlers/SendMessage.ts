import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { addMessage, AddMessageApiParameter } from "@insite/client-framework/Services/MessageService";
import loadQuote from "@insite/client-framework/Store/Data/Quotes/Handlers/LoadQuote";
import { MessageModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        quote: QuoteModel;
        message: string;
        onError?: (error: string) => void;
    } & HasOnSuccess,
    AddMessageApiParameter,
    MessageModel
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        customerOrderId: props.parameter.quote.id,
        message: props.parameter.message,
        toUserProfileName: props.parameter.quote.initiatedByUserName,
        subject: `Quote ${props.parameter.quote.orderNumber} communication`,
        process: "RFQ",
    };
};

export const SendDataToApi: HandlerType = async props => {
    const result = await addMessage(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const DispatchLoadQuote: HandlerType = props => {
    props.dispatch(loadQuote({ quoteId: props.parameter.quote.id }));
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [PopulateApiParameter, SendDataToApi, DispatchLoadQuote, ExecuteOnSuccessCallback];

const sendMessage = createHandlerChainRunner(chain, "SendMessage");
export default sendMessage;
