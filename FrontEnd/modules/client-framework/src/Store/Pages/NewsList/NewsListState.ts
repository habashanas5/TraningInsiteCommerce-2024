import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetPagesByParentApiParameter } from "@insite/client-framework/Services/ContentService";

export default interface NewsListState {
    getNewsPagesParameters: SafeDictionary<GetPagesByParentApiParameter>;
}
