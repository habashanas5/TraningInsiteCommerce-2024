import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { PageVersionInfoModel, PublishedPageVersionsModel } from "@insite/shell/Services/ContentAdminService";
import { CompareModalState } from "@insite/shell/Store/CompareModal/CompareModalState";
import { Draft as ImmerDraft } from "immer";

const initialState: CompareModalState = {
    isSideBySide: true,
    isShowingLeftSide: true,
};

type Draft = ImmerDraft<CompareModalState>;

const reducer = {
    "CompareModal/ConfigureComparison": (
        draft: Draft,
        { compareVersions }: Pick<CompareModalState, "compareVersions">,
    ) => {
        draft.compareVersions = compareVersions;
    },
    "CompareModal/CloseModal": () => {
        return initialState;
    },

    "CompareModal/SetIsSideBySide": (draft: Draft, action: { isSideBySide: boolean }) => {
        draft.isSideBySide = action.isSideBySide;
    },

    "CompareModal/SwitchDisplayedSide": (draft: Draft) => {
        draft.isShowingLeftSide = !draft.isShowingLeftSide;
    },

    "CompareModal/BeginLoadingPublishedPageVersions": (draft: Draft) => {
        if (draft.showCompleteVersionHistory) {
            draft.publishedPageVersionsPaginated = undefined;
        } else {
            draft.publishedPageVersions = undefined;
        }
    },

    "CompareModal/CompleteLoadingPublishedPageVersions": (
        draft: Draft,
        {
            publishedPageVersions,
        }: {
            publishedPageVersions: PublishedPageVersionsModel;
        },
    ) => {
        if (draft.showCompleteVersionHistory) {
            draft.publishedPageVersionsPaginated = publishedPageVersions;
        } else {
            draft.publishedPageVersions = publishedPageVersions;
        }
    },

    "CompareModal/CompletePageVersionRestore": (
        draft: Draft,
        {
            pageVersion,
        }: {
            pageVersion: PageVersionInfoModel;
        },
    ) => {
        if (draft.compareVersions) {
            draft.compareVersions.leftVersion = pageVersion;
        }
    },

    "CompareModal/SetShowCompleteVersionHistory": (
        draft: Draft,
        action: { showCompleteVersionHistory: boolean; side?: "left" | "right" },
    ) => {
        draft.showCompleteVersionHistory = action.showCompleteVersionHistory;
        draft.completeVersionHistorySide = action.side;
    },

    "CompareModal/SetLeftVersion": (draft: Draft, action: { pageVersion: PageVersionInfoModel }) => {
        if (draft.compareVersions) {
            draft.compareVersions.leftVersion = action.pageVersion;
        }
    },

    "CompareModal/SetRightVersion": (draft: Draft, action: { pageVersion?: PageVersionInfoModel }) => {
        if (draft.compareVersions) {
            draft.compareVersions.rightVersion = action.pageVersion;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
