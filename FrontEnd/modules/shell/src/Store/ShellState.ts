import { CategoriesState } from "@insite/client-framework/Store/Data/Categories/CategoriesState";
import { PagesState } from "@insite/client-framework/Store/Data/Pages/PagesState";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import { CompareModalState } from "@insite/shell/Store/CompareModal/CompareModalState";
import ErrorModalState from "@insite/shell/Store/ErrorModal/ErrorModalState";
import { ImportExportModalState } from "@insite/shell/Store/ImportExportModal/ImportExportModalState";
import LogoutWarningModalState from "@insite/shell/Store/LogoutWarningModal/LogoutWarningModalState";
import NeverPublishedModalState from "@insite/shell/Store/NeverPublishedModal/NeverPublishedModalState";
import { PageEditorState } from "@insite/shell/Store/PageEditor/PageEditorState";
import { PageTreeState } from "@insite/shell/Store/PageTree/PageTreeState";
import { PublishModalState } from "@insite/shell/Store/PublishModal/PublishModalState";
import { ShellContextState } from "@insite/shell/Store/ShellContext/ShellContextState";
import { StyleGuideState } from "@insite/shell/Store/StyleGuide/StyleGuideState";

export default interface ShellState {
    readonly compareModal: CompareModalState;
    readonly data: {
        readonly categories: CategoriesState;
        readonly pages: PagesState;
    };
    readonly errorModal: ErrorModalState;
    readonly links: LinksState;
    readonly logoutWarningModal: LogoutWarningModalState;
    readonly importExportModal: ImportExportModalState;
    readonly neverPublishedModal: NeverPublishedModalState;
    readonly pageEditor: PageEditorState;
    readonly pageTree: PageTreeState;
    readonly publishModal: PublishModalState;
    readonly shellContext: ShellContextState;
    readonly styleGuide: StyleGuideState;
}
