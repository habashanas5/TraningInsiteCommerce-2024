import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import setPageMetadata from "@insite/client-framework/Common/Utilities/setPageMetadata";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { DealerStateContext, getDealerState } from "@insite/client-framework/Store/Data/Dealers/DealersSelectors";
import {
    getAlternateLanguageUrls,
    getCurrentPage,
    getLocation,
} from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getHomePageUrl, getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import displayDealer from "@insite/client-framework/Store/Pages/DealerDetails/Handlers/DisplayDealer";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import { generateLinksFrom } from "@insite/content-library/Components/PageBreadcrumbs";
import { LinkProps } from "@insite/mobius/Link";
import Page from "@insite/mobius/Page";
import cloneDeep from "lodash/cloneDeep";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ id?: string; invite?: string }>(location.search);
    const id = parsedQuery.id;
    const homePageUrl = getHomePageUrl(state);
    const page = getCurrentPage(state);
    return {
        homePageUrl,
        dealerId: id,
        dealerState: getDealerState(state, id),
        links: state.links,
        dealerDetailsPageLink: getPageLinkByPageType(state, "DealerDetailsPage"),
        nodeId: page.nodeId,
        breadcrumbLinks: state.components.breadcrumbs.links,
        websiteName: state.context.website.name,
        dealerPath: location.pathname,
        websiteSettings: getSettingsCollection(state).websiteSettings,
        alternateLanguageUrls: getAlternateLanguageUrls(state, page.id),
    };
};

const mapDispatchToProps = {
    displayDealer,
    setBreadcrumbs,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

interface State {
    metadataUpdatedForId?: string;
}

class DealerDetailsPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    private checkState(prevProps?: Props) {
        const { dealerState, breadcrumbLinks } = this.props;
        if (!dealerState.value) {
            return;
        }

        if (!breadcrumbLinks || (prevProps && dealerState.value?.id !== prevProps.dealerState?.value?.id)) {
            this.setPageBreadcrumbs();
        }
    }

    UNSAFE_componentWillMount(): void {
        const { dealerId, displayDealer } = this.props;
        if (dealerId) {
            displayDealer({ dealerId });
            this.setMetadata(false);
            this.checkState();
        }
    }

    componentDidUpdate(prevProps: Props) {
        this.checkState(prevProps);
        const { dealerState } = this.props;
        if (dealerState.value && dealerState.value.id !== this.state.metadataUpdatedForId) {
            this.setMetadata(true);
        }
    }

    setMetadata(isUpdate: boolean) {
        const {
            dealerState: { value: dealer },
            websiteName,
            dealerPath,
            websiteSettings,
            alternateLanguageUrls,
        } = this.props;
        if (!dealer) {
            return;
        }

        setPageMetadata(
            {
                currentPath: dealerPath,
                title: dealer.name,
                websiteName,
                alternateLanguageUrls,
            },
            websiteSettings,
        );

        if (isUpdate) {
            this.setState({
                metadataUpdatedForId: dealer.id,
            });
        }
    }

    setPageBreadcrumbs() {
        const { dealerState, links, nodeId, dealerDetailsPageLink, homePageUrl, setBreadcrumbs } = this.props;
        if (!dealerState.value) {
            return;
        }

        const breadcrumbs = generateLinksFrom(links, nodeId, homePageUrl);
        const updatedBreadcrumbs = cloneDeep(breadcrumbs) as LinkProps[];
        updatedBreadcrumbs.forEach(link => {
            link.children = link.children === dealerDetailsPageLink?.title ? dealerState.value.name : link.children;
        });
        setBreadcrumbs({ links: updatedBreadcrumbs });
    }

    render() {
        return (
            <Page>
                <DealerStateContext.Provider value={this.props.dealerState}>
                    <Zone contentId={this.props.id} zoneName="Content" />
                </DealerStateContext.Provider>
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(DealerDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const DealerDetailsPageContext = "DealerDetailsPage";
