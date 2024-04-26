import { ApiParameter, get, post } from "@insite/client-framework/Services/ApiService";
import { ShareEntityModel, TellAFriendModel } from "@insite/client-framework/Types/ApiModels";

const emailsUrl = "/api/v1/email";
const emailSubscriptionUrl = "/email";

export interface TellAFriendApiParameter extends ApiParameter {
    tellAFriendModel: TellAFriendModel;
}

export interface SubscribeToListApiParameter extends ApiParameter {
    emailAddress: string;
}

export interface ShareEntityApiParameter extends ApiParameter {
    shareEntityModel: ShareEntityModel;
    url: string;
}

export interface ShareEntityGenerateFromWebpageApiParameter {
    shareEntityModel: ShareEntityModel;
    urlPathToLoadForAttachmentHtml: string;
}

export interface SubmitContactUsFormApiParameter extends ApiParameter {
    topic?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    emailAddress?: string;
    message?: string;
    emailTo?: string;
}

export function tellAFriend(parameter: TellAFriendApiParameter) {
    return post<TellAFriendModel>(`${emailsUrl}/tellafriend`, parameter.tellAFriendModel);
}

export function shareEntity(parameter: ShareEntityApiParameter) {
    return post<ShareEntityModel>(parameter.url, parameter.shareEntityModel);
}

export function shareEntityGenerateFromWebpage(parameter: ShareEntityGenerateFromWebpageApiParameter) {
    return post<ShareEntityGenerateFromWebpageApiParameter, ShareEntityModel>("/.spire/shareEntity", parameter);
}

export function subscribeToList(parameter: SubscribeToListApiParameter) {
    return post<SubscribeToListApiParameter>(`${emailSubscriptionUrl}/SubscribeToList`, parameter);
}

export function submitContactUsForm(parameter: SubmitContactUsFormApiParameter) {
    return post<SubmitContactUsFormApiParameter, void>(`${emailsUrl}/contactUs`, parameter);
}
