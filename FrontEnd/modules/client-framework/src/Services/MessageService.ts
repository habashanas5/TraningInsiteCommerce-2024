import isApiError from "@insite/client-framework/Common/isApiError";
import {
    ApiParameter,
    get,
    HasPagingParameters,
    patch,
    post,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import { MessageCollectionModel, MessageModel } from "@insite/client-framework/Types/ApiModels";

export interface GetMessagesApiParameter extends ApiParameter, HasPagingParameters {}

export interface UpdateMessageApiParameter {
    message: MessageModel;
}

export interface AddMessageApiParameter extends ApiParameter {
    customerOrderId?: string;
    toUserProfileId?: string;
    toUserProfileName?: string;
    subject: string;
    message: string;
    process: string;
}

const messagesUrl = "/api/v1/messages";

export async function getMessages(parameter: GetMessagesApiParameter) {
    const messageCollection = await get<MessageCollectionModel>(messagesUrl, parameter);
    messageCollection.messages!.forEach(cleanMessage);
    return messageCollection;
}

function cleanMessage(messageModel: MessageModel) {
    messageModel.dateToDisplay = new Date(messageModel.dateToDisplay);
}

export async function updateMessage(parameter: UpdateMessageApiParameter) {
    const { message } = parameter;
    const messageModel = await patch<MessageModel>(`${messagesUrl}/${message.id}`, message);
    cleanMessage(messageModel);
    return messageModel;
}

export async function addMessage(parameter: AddMessageApiParameter): Promise<ServiceResult<MessageModel>> {
    try {
        const messageModel = await post<AddMessageApiParameter, MessageModel>(`${messagesUrl}`, parameter);
        cleanMessage(messageModel);
        return {
            successful: true,
            result: messageModel,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}
