import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import { withPageLinks as actualWithPageLinks } from "@insite/client-framework/Store/Links/LinksStateTestHelpers";
import ItemListWidgetModule, { ItemList } from "@insite/content-library/Widgets/Basic/ItemList";
import { elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import Link from "@insite/mobius/Link";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";
import "jest-styled-components";

describe("ItemList Widget", () => {
    const { renderWidget, useFields, useApplicationState } = setupWidgetRendering(ItemList, ItemListWidgetModule);

    const withPageLinks = (pageLinks: RecursivePartial<PageLinkModel>[]) => {
        actualWithPageLinks(useApplicationState, pageLinks);
    };

    test("Is rendering", () => {
        const itemList = renderWidget().find(ItemList);

        elementIsRendering(itemList);
    });

    test("Override title works", () => {
        const fields = useFields();
        fields.overrideTitle = "OverrideTitle";
        fields.nodeId = {
            value: "0",
            type: "Page",
        };

        withPageLinks([{ id: "0", title: "PageTitle", children: [{ url: "/1", title: "1", id: "1" }] }]);

        const title = renderWidget().find("h3");
        expect(title.text()).toBe("OverrideTitle");
    });

    test("Root page title is used if no Override Title", () => {
        const fields = useFields();
        fields.nodeId = {
            value: "0",
            type: "Page",
        };

        withPageLinks([{ id: "0", title: "PageTitle", children: [{ url: "/1", title: "1", id: "1" }] }]);

        const title = renderWidget().find("h3");
        expect(title.text()).toBe("PageTitle");
    });

    test("Renders links", () => {
        const fields = useFields();
        fields.nodeId = {
            value: "0",
            type: "Page",
        };

        withPageLinks([{ id: "0", title: "PageTitle", children: [{ url: "/1", title: "1", id: "1" }] }]);

        const link = renderWidget().find(Link);
        expect(link.props().href).toBe("/1");
    });

    test("Renders links", () => {
        const fields = useFields();
        fields.nodeId = {
            value: "0",
            type: "Page",
        };

        withPageLinks([
            {
                id: "0",
                title: "PageTitle",
                children: [{ url: "/1", title: "1", id: "1", excludeFromNavigation: true }],
            },
        ]);

        const link = renderWidget().find(Link);
        expect(link.length).toBe(0);
    });
});
