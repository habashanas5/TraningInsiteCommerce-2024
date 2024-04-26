import { Dictionary } from "@insite/client-framework/Common/Types";
import ContentItemModel from "@insite/client-framework/Types/ContentItemModel";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";

export default interface PageProps extends ContentItemModel {
    name: string;
    nodeId: string;
    sortOrder: number;
    variantName?: string;
    layoutPageId?: string;
}

/** All the data needed for saving a page, and provided when retrieving. */
export interface PageModel extends PageProps {
    widgets: WidgetProps[];
    websiteId: string;
}

export type ItemProps = PageProps | WidgetProps;

/** Cleans a page object to mitigate potential problems with the source data. */
export function cleanPage(page: PageModel) {
    // Remove widgets that don't have a path to the page content key.
    // In a perfect world, this wouldn't be necessary, but it's a tradeoff for a simple, flat redux page state.
    const idsOnPage: Dictionary<true | undefined> = {};
    idsOnPage[page.id] = true;

    let length: number;
    let newLength = 1;
    do {
        length = newLength;

        page.widgets.forEach(widget => {
            if (idsOnPage[widget.parentId]) {
                idsOnPage[widget.id] = true;
            }
        });

        newLength = Object.keys(idsOnPage).length;
    } while (length !== newLength);

    page.widgets = page.widgets.filter(widget => idsOnPage[widget.parentId]);
    delete page["fields"];
    page.widgets.forEach(widget => {
        delete widget["fields"];
    });
}
