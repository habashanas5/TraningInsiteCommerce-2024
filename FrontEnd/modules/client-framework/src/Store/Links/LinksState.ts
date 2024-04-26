import { Dictionary } from "@insite/client-framework/Common/Types";
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";

export default interface LinksState {
    readonly pageLinks: readonly Readonly<PageLinkModel>[];
    readonly pageTypesToNodeId: Dictionary<string>;
    readonly nodeIdToPageLinkPath: Dictionary<readonly number[]>;
    readonly areLinksLoading?: boolean;
}

export interface HasLinksState {
    links: LinksState;
}
