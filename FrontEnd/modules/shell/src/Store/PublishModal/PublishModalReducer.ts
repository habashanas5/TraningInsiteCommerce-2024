import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Dictionary } from "@insite/client-framework/Common/Types";
import {
    PagePublishInfo,
    PageVersionInfoModel,
    PublishedPageVersionsModel,
} from "@insite/shell/Services/ContentAdminService";
import { PublishModalState } from "@insite/shell/Store/PublishModal/PublishModalState";
import { Draft } from "immer";

const initialState: PublishModalState = {
    pagePublishInfosState: {
        isLoading: false,
    },
    pagePublishInfoIsSelected: [],
};

const reducer = {
    "PublishModal/SetPublishButtonExpanded": (
        draft: Draft<PublishModalState>,
        action: { publishButtonExpanded: boolean },
    ) => {
        draft.publishButtonExpanded = action.publishButtonExpanded;
    },

    "PublishModal/SetShowModal": (
        draft: Draft<PublishModalState>,
        action: { showModal: boolean; isBulkPublish?: true },
    ) => {
        delete draft.publishButtonExpanded;
        draft.showModal = action.showModal;
        draft.isBulkPublish = action.isBulkPublish;
    },

    "PublishModal/TogglePublishInTheFuture": (draft: Draft<PublishModalState>) => {
        if (draft.publishInTheFuture) {
            delete draft.publishInTheFuture;
            delete draft.publishOn;
            delete draft.rollbackOn;
        } else {
            draft.publishInTheFuture = true;
        }
    },

    "PublishModal/BeginLoadingPublishInfo": (draft: Draft<PublishModalState>) => {
        draft.pagePublishInfosState = {
            isLoading: true,
        };
    },

    "PublishModal/CompleteLoadingPublishInfo": (
        draft: Draft<PublishModalState>,
        {
            pagePublishInfos,
            publishOn,
            rollbackOn,
            isEditingExistingPublish,
            failedPageIds,
        }: {
            pagePublishInfos: PagePublishInfo[];
            publishOn?: Date | null;
            rollbackOn?: Date | null;
            isEditingExistingPublish?: boolean;
            failedPageIds?: Dictionary<boolean> | null;
        },
    ) => {
        draft.pagePublishInfosState = {
            isLoading: false,
            value: pagePublishInfos,
        };

        draft.pagePublishInfoIsSelected = pagePublishInfos.map(() => true);

        if (publishOn !== undefined) {
            draft.publishOn = publishOn ?? undefined;
        }
        if (rollbackOn !== undefined) {
            draft.rollbackOn = rollbackOn ?? undefined;
        }
        if (isEditingExistingPublish !== undefined) {
            draft.isEditingExistingPublish = isEditingExistingPublish;
        }
        if (failedPageIds !== undefined) {
            draft.failedToPublishPageIds = failedPageIds ?? undefined;
        }
    },

    "PublishModal/ClearPublishInfo": (draft: Draft<PublishModalState>) => {
        draft.pagePublishInfosState = {
            isLoading: false,
        };
    },

    "PublishModal/SetPublishOn": (draft: Draft<PublishModalState>, action: { publishOn?: Date }) => {
        draft.publishOn = action.publishOn;
    },

    "PublishModal/SetRollbackOn": (draft: Draft<PublishModalState>, action: { rollbackOn?: Date }) => {
        draft.rollbackOn = action.rollbackOn;
    },

    "PublishModal/SetFailedToPublishPageIds": (
        draft: Draft<PublishModalState>,
        action: { failedPageIds: Dictionary<boolean> },
    ) => {
        draft.failedToPublishPageIds = action.failedPageIds;
    },

    "PublishModal/SetIsSelected": (draft: Draft<PublishModalState>, action: { index: number; isSelected: boolean }) => {
        draft.pagePublishInfoIsSelected[action.index] = action.isSelected;
    },

    "PublishModal/SetIsSelectedForAll": (draft: Draft<PublishModalState>, action: { isSelected: boolean }) => {
        draft.pagePublishInfoIsSelected = draft.pagePublishInfosState.value!.map(() => action.isSelected);
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
