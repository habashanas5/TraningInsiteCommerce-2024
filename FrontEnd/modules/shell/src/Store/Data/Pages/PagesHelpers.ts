import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import { getStorablePage } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";

export function loadPageOnSite(pageId: string) {
    sendToSite({
        type: "LoadUrl",
        url: `/Content/Page/${pageId}`,
    });
}

export function updatePageOnSite(state: ShellState) {
    const page = getStorablePage(state, state.shellContext.websiteId, undefined, false);

    sendToSite({
        type: "UpdatePage",
        page,
    });
}
