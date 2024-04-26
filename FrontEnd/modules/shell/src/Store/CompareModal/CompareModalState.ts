import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { PageVersionInfoModel, PublishedPageVersionsModel } from "@insite/shell/Services/ContentAdminService";

export interface CompareModalState {
    compareVersions?: {
        name: string;
        pageId: string;
        languageId: string;
        deviceType?: string;
        personaId?: string;
        stageMode: DeviceType;
        leftVersion?: PageVersionInfoModel;
        rightVersion?: PageVersionInfoModel;
        canSelectVersion?: boolean;
    };
    publishedPageVersions?: PublishedPageVersionsModel;
    publishedPageVersionsPaginated?: PublishedPageVersionsModel;
    showCompleteVersionHistory?: boolean;
    completeVersionHistorySide?: "left" | "right";
    isSideBySide: boolean;
    isShowingLeftSide: boolean;
}
