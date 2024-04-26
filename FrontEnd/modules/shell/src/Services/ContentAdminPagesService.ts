import { convertToContentAdminEndpoint } from "@insite/shell/Services/ConvertToContentAdminEndpoints";
import { post as basePost } from "@insite/shell/Services/ServiceBase";

const post = convertToContentAdminEndpoint(basePost, "contentAdminPages");

export const findNodeIdNames = (possibleNodeIds: string[]) =>
    post<{ id: string; name: string }[]>(`findNodeIdNames`, possibleNodeIds);
