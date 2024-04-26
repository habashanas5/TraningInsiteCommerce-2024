import { GetMessagesApiParameter } from "@insite/client-framework/Services/MessageService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getMessagesDataView(state: ApplicationState, parameter: GetMessagesApiParameter) {
    return getDataView(state.data.messages, parameter);
}
