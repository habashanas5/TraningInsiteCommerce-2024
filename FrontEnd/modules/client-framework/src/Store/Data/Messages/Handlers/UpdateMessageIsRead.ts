import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { updateMessage, UpdateMessageApiParameter } from "@insite/client-framework/Services/MessageService";
import { getById } from "@insite/client-framework/Store/Data/DataState";
import { MessageModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    { message: MessageModel; isRead: boolean },
    UpdateMessageApiParameter,
    MessageModel
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        message: {
            ...props.parameter.message,
            isRead: props.parameter.isRead,
        },
    };
};

export const UpdateMessage: HandlerType = async props => {
    // The server returns a mostly worthless message object, grab the existing one and update the isRead on it
    const worthlessMessageModel = await updateMessage(props.apiParameter);
    const message = {
        // create a copy to ensure redux updates properly
        ...getById(props.getState().data.messages, props.apiParameter.message.id).value!,
    };
    message.isRead = worthlessMessageModel.isRead;
    props.apiResult = message;
};

export const DispatchCompleteLoadMessage: HandlerType = props => {
    props.dispatch({
        type: "Data/Messages/CompleteLoadMessage",
        model: props.apiResult,
    });
};

export const chain = [PopulateApiParameter, UpdateMessage, DispatchCompleteLoadMessage];

const updateMessageIsRead = createHandlerChainRunner(chain, "UpdateMessageIsRead");
export default updateMessageIsRead;
