import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getHomePageUrl, getPageLinkByNodeId } from "@insite/client-framework/Store/Links/LinksSelectors";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import translate from "@insite/client-framework/Translate";
import Breadcrumbs, { BreadcrumbsPresentationProps } from "@insite/mobius/Breadcrumbs";
import { LinkProps } from "@insite/mobius/Link";
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    return {
        links: state.components.breadcrumbs.links,
        linksState: state.links,
        nodeId: getCurrentPage(state).nodeId,
        homePageUrl: getHomePageUrl(state),
    };
};

export interface PageBreadcrumbsStyles {
    breadcrumbs?: BreadcrumbsPresentationProps;
}

export const pageBreadcrumbStyles: PageBreadcrumbsStyles = {};

type Props = ReturnType<typeof mapStateToProps>;

const PageBreadcrumbs = (props: Props) => {
    let links = props.links || generateLinksFrom(props.linksState, props.nodeId, props.homePageUrl);
    if (links.length > 0) {
        // we need to always direct to the language-specific homepage URL
        const homePageLink = { children: translate("Home"), href: props.homePageUrl };
        const linksWithoutHomePageLink = [...links].splice(1, links.length);
        links = [homePageLink, ...linksWithoutHomePageLink];
    }

    return <Breadcrumbs links={links} data-test-selector="pageBreadcrumbs" {...pageBreadcrumbStyles.breadcrumbs} />;
};

export function generateLinksFrom(linksState: LinksState, nodeId: string, homePageUrl: string) {
    const links: LinkProps[] = [];
    let currentLink = getPageLinkByNodeId({ links: linksState }, nodeId);

    while (currentLink) {
        links.unshift({ children: currentLink.title, href: currentLink.url });
        currentLink = currentLink.parentId
            ? getPageLinkByNodeId({ links: linksState }, currentLink.parentId)
            : undefined;
    }

    return links;
}

export default connect(mapStateToProps)(PageBreadcrumbs);
