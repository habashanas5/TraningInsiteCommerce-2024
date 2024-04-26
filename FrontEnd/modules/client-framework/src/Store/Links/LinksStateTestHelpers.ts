import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import { WriteableState } from "@insite/client-framework/Store/ApplicationState";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

export const withPageLinks = (
    useApplicationState: () => WriteableState,
    pageLinks: RecursivePartial<PageLinkModel>[],
) => {
    const state = useApplicationState();
    if (!state.links) {
        state.links = {
            nodeIdToPageLinkPath: {},
            pageLinks,
            pageTypesToNodeId: {},
        };
    }

    const loadLinks = (pageLinks: RecursivePartial<PageLinkModel>[], path: number[], parentId?: string) => {
        let index = 0;
        for (const pageLink of pageLinks) {
            if (!pageLink.children) {
                pageLink.children = [];
            }
            if (!pageLink.id) {
                throw new Error("PageLink needs id");
            }
            const childPath = path.concat([index]);
            state.links!.nodeIdToPageLinkPath![pageLink.id] = childPath;
            if (pageLink.type) {
                state.links!.pageTypesToNodeId![pageLink.type] = pageLink.id;
            }
            if (pageLink.children) {
                loadLinks(pageLink.children, childPath, pageLink.id);
            }

            pageLink.parentId = parentId;

            index++;
        }
    };

    loadLinks(pageLinks, []);
};
