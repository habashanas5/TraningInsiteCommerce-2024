import CategoriesReducer from "@insite/client-framework/Store/Data/Categories/CategoriesReducer";
import LinksReducer from "@insite/client-framework/Store/Links/LinksReducer";
import CompareModalReducer from "@insite/shell/Store/CompareModal/CompareModalReducer";
import PagesReducer from "@insite/shell/Store/Data/Pages/PagesReducer";
import ErrorModalReducer from "@insite/shell/Store/ErrorModal/ErrorModalReducer";
import ImportExportModalReducer from "@insite/shell/Store/ImportExportModal/ImportExportModalReducer";
import LogoutWarningModalReducer from "@insite/shell/Store/LogoutWarningModal/LogoutWarningModalReducer";
import NeverPublishedModalReducer from "@insite/shell/Store/NeverPublishedModal/NeverPublishedModalReducer";
import PageEditorReducer from "@insite/shell/Store/PageEditor/PageEditorReducer";
import PageTreeReducer from "@insite/shell/Store/PageTree/PageTreeReducer";
import PublishModalReducer from "@insite/shell/Store/PublishModal/PublishModalReducer";
import ShellContextReducer from "@insite/shell/Store/ShellContext/ShellContextReducer";
import StyleGuideReducer from "@insite/shell/Store/StyleGuide/StyleGuideReducer";
import { combineReducers } from "redux";

const dataReducers = {
    categories: CategoriesReducer,
    pages: PagesReducer,
};

const dataReducer = combineReducers(dataReducers as any);

export type DataReducers = typeof dataReducers;

export const reducers = {
    compareModal: CompareModalReducer,
    data: dataReducer,
    errorModal: ErrorModalReducer,
    importExportModal: ImportExportModalReducer,
    links: LinksReducer,
    logoutWarningModal: LogoutWarningModalReducer,
    neverPublishedModal: NeverPublishedModalReducer,
    pageEditor: PageEditorReducer,
    pageTree: PageTreeReducer,
    publishModal: PublishModalReducer,
    shellContext: ShellContextReducer,
    styleGuide: StyleGuideReducer,
};

type Reducers = Omit<typeof reducers, "data">;

export type AnyShellAction = Parameters<Reducers[keyof Reducers]>[1] | Parameters<DataReducers[keyof DataReducers]>[1];
