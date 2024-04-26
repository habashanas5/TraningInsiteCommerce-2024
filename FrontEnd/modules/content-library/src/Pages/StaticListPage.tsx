import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";
import loadWishListIfNeeded from "@insite/client-framework/Store/Pages/StaticList/Handlers/LoadWishListIfNeeded";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import { generateLinksFrom } from "@insite/content-library/Components/PageBreadcrumbs";
import Page from "@insite/mobius/Page";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ id?: string }>(location.search);
    const homePageUrl = getHomePageUrl(state);
    const id = parsedQuery.id;
    return {
        homePageUrl,
        wishListId: id,
        wishListState: getWishListState(state, id),
        parentNodeId: getCurrentPage(state).parentId,
        links: state.links,
        breadcrumbLinks: state.components.breadcrumbs.links,
    };
};

const mapDispatchToProps = {
    loadWishListIfNeeded,
    setBreadcrumbs,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface StaticListPageStyles {}

export const staticListPageStyles: StaticListPageStyles = {};

const StaticListPage = ({
    id,
    wishListId,
    wishListState,
    loadWishListIfNeeded,
    parentNodeId,
    links,
    breadcrumbLinks,
    homePageUrl,
    setBreadcrumbs,
}: Props) => {
    useEffect(() => {
        if (wishListId && !wishListState.value && !wishListState.isLoading) {
            loadWishListIfNeeded({ wishListId });
        }
    }, [wishListState]);

    useEffect(() => {
        if (!breadcrumbLinks && wishListState.value) {
            const newLinks = generateLinksFrom(links, parentNodeId, homePageUrl);
            newLinks.push({ children: wishListState.value?.name });
            setBreadcrumbs({ links: newLinks });
        }
    }, [breadcrumbLinks, wishListState.value]);

    return (
        <>
            <Page>
                <Zone contentId={id} zoneName="Content" />
            </Page>
            <Modals />
        </>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(StaticListPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const StaticListPageContext = "StaticListPage";
