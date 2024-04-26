import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getMessages, GetMessagesApiParameter } from "@insite/client-framework/Services/MessageService";
import { MessageCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetMessagesApiParameter, MessageCollectionModel>;

export const DispatchBeginLoadMessage: HandlerType = props => {
    props.dispatch({
        type: "Data/Messages/BeginLoadMessages",
        parameter: props.apiParameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getMessages(props.apiParameter);
};

export const DispatchCompleteLoadMessage: HandlerType = props => {
    props.dispatch({
        type: "Data/Messages/CompleteLoadMessages",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [PopulateApiParameter, DispatchBeginLoadMessage, RequestDataFromApi, DispatchCompleteLoadMessage];

const loadMessages = createHandlerChainRunner(chain, "LoadMessages");
export default loadMessages;
