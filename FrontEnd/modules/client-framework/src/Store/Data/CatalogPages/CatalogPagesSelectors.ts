import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById } from "@insite/client-framework/Store/Data/DataState";

export function getCatalogPageStateByPath(state: ApplicationState, path: string | undefined) {
    return getById(state.data.catalogPages, path, id => state.data.catalogPages.idByPath[id.toLowerCase()] ?? "");
}
