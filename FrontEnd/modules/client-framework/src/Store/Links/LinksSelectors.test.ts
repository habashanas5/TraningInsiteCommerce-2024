import { Dictionary } from "@insite/client-framework/Common/Types";
import { Category } from "@insite/client-framework/Services/CategoryService";
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getHomePageUrl, getLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import LinksState from "@insite/client-framework/Store/Links/LinksState";

describe("getLink", () => {
    const categories: Dictionary<Category> = {};
    categories["some_id"] = {
        path: "/test",
        shortDescription: "test title",
    } as Category;

    const nodeIdToPageLinkPath: Dictionary<readonly number[]> = {};
    nodeIdToPageLinkPath["test"] = [0];

    const pageTypesToNodeId: Dictionary<string> = {};
    pageTypesToNodeId["HomePage"] = "test";

    const pageLinks: Readonly<PageLinkModel>[] = [
        {
            title: "test",
            url: "/homepage",
        } as PageLinkModel,
    ];

    const initializeState = () => {
        return {
            data: {
                categories: {
                    byId: categories,
                    isLoading: {},
                },
            },
        } as ApplicationState;
    };

    const initializeStateWithLinkNodes = () => {
        return {
            data: {
                categories: {
                    byId: categories,
                    isLoading: {},
                },
            },
            links: {
                pageLinks,
                nodeIdToPageLinkPath,
                pageTypesToNodeId,
            } as LinksState,
        } as ApplicationState;
    };

    test("Should get language-specific homepage url", () => {
        const state = initializeStateWithLinkNodes();
        const result = getHomePageUrl(state);

        expect(result).toBe("/homepage");
    });

    test("Should get default homepage url", () => {
        const state = initializeState();
        const result = getHomePageUrl(state);

        expect(result).toBe("/");
    });

    test("should return url and title for Category type", () => {
        const state = initializeState();
        const result = getLink(state, { type: "Category", value: "some_id" });

        expect(result).toHaveProperty("url", "/test");
        expect(result).toHaveProperty("title", "test title");
    });

    test("should return undefined url and title for Category type if doesn't exist", () => {
        const state = initializeState();
        const result = getLink(state, { type: "Category", value: "some_id_2" });

        expect(result).toHaveProperty("url", undefined);
        expect(result).toHaveProperty("title", undefined);
    });
});
