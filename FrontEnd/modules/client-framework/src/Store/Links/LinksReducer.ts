import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import { Draft } from "immer";

const initialState: LinksState = {
    pageLinks: [],
    pageTypesToNodeId: {},
    nodeIdToPageLinkPath: {},
};

const reducer = {
    "Links/BeginLoadPageLinks": (draft: Draft<LinksState>) => {
        draft.areLinksLoading = true;
    },

    "Links/CompleteLoadPageLinks": (draft: Draft<LinksState>, action: { pageLinks: PageLinkModel[] }) => {
        draft.pageLinks = action.pageLinks;
        draft.nodeIdToPageLinkPath = {};
        draft.pageTypesToNodeId = {};
        draft.areLinksLoading = false;

        const loadLinks = (pageLinks: PageLinkModel[], path: number[], parentId?: string) => {
            let index = 0;
            for (const pageLink of pageLinks) {
                const childPath = path.concat([index]);
                draft.nodeIdToPageLinkPath[pageLink.id] = childPath;
                if (pageLink.type) {
                    draft.pageTypesToNodeId[pageLink.type] = pageLink.id;
                }
                if (pageLink.children) {
                    loadLinks(pageLink.children, childPath, pageLink.id);
                }

                pageLink.parentId = parentId;

                index++;
            }
        };

        loadLinks(draft.pageLinks, []);
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
