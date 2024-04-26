import { Dictionary } from "@insite/client-framework/Common/Types";
import LoadedState from "@insite/client-framework/Types/LoadedState";
import { PagePublishInfo } from "@insite/shell/Services/ContentAdminService";

export interface PublishModalState {
    publishButtonExpanded?: boolean;
    showModal?: boolean;
    isBulkPublish?: true;
    publishInTheFuture?: true;
    pagePublishInfosState: LoadedState<PagePublishInfo[]>;
    publishOn?: Date;
    rollbackOn?: Date;
    isEditingExistingPublish?: boolean;
    failedToPublishPageIds?: Dictionary<boolean>;
    pagePublishInfoIsSelected: boolean[];
}
