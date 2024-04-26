import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadVmiLocation from "@insite/client-framework/Store/Data/VmiLocations/Handlers/LoadVmiLocation";
import {
    getVmiLocationState,
    VmiLocationStateContext,
} from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import { generateLinksFrom } from "@insite/content-library/Components/PageBreadcrumbs";
import Page from "@insite/mobius/Page";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    let vmiLocationId;
    if (location && location.search) {
        const parsedQuery = parseQueryString<{ id: string }>(location.search);
        vmiLocationId = parsedQuery.id;
    }

    const vmiLocationState = getVmiLocationState(state, vmiLocationId);
    const homePageUrl = getHomePageUrl(state);

    return {
        vmiLocationId,
        vmiLocationState,
        parentNodeId: getCurrentPage(state).parentId,
        links: state.links,
        breadcrumbLinks: state.components.breadcrumbs.links,
        homePageUrl,
    };
};

const mapDispatchToProps = {
    loadVmiLocation,
    setBreadcrumbs,
};

export interface VmiLocationDetailsPageStyles {
    loadFailedWrapper?: InjectableCss;
    loadFailedText?: TypographyPresentationProps;
}

export const vmiLocationDetailsPageStyles: VmiLocationDetailsPageStyles = {
    loadFailedWrapper: {
        css: css`
            display: flex;
            height: 200px;
            justify-content: center;
            align-items: center;
            background-color: ${getColor("common.accent")};
        `,
    },
    loadFailedText: { weight: "bold" },
};

type Props = ResolveThunks<typeof mapDispatchToProps> & PageProps & ReturnType<typeof mapStateToProps>;

class VmiLocationDetailsPage extends React.PureComponent<Props> {
    private checkState(prevProps?: Props) {
        if (!this.props.breadcrumbLinks && this.props.vmiLocationState.value) {
            const newLinks = generateLinksFrom(this.props.links, this.props.parentNodeId, this.props.homePageUrl);
            newLinks.push({ children: this.props.vmiLocationState.value?.name });
            this.props.setBreadcrumbs({ links: newLinks });
        }
    }

    private loadVmiLocationIfRequired() {
        if (
            this.props.vmiLocationId &&
            !this.props.vmiLocationState.isLoading &&
            (!this.props.vmiLocationState.value || !this.props.vmiLocationState.value.customer)
        ) {
            this.props.loadVmiLocation({ id: this.props.vmiLocationId });
        }
    }

    UNSAFE_componentWillMount() {
        this.loadVmiLocationIfRequired();
        this.checkState();
    }

    componentDidUpdate(prevProps: Props) {
        if (!this.props.vmiLocationState.isLoading && !this.props.vmiLocationState.value) {
            this.props.setBreadcrumbs({ links: undefined });
        }
        this.loadVmiLocationIfRequired();
        this.checkState(prevProps);
    }

    render() {
        const styles = vmiLocationDetailsPageStyles;
        return (
            <Page>
                {this.props.vmiLocationState.errorStatusCode === 404 ? (
                    <StyledWrapper {...styles.loadFailedWrapper}>
                        <Typography {...styles.loadFailedText}>{siteMessage("Vmi_VmiLocationNotFound")}</Typography>
                    </StyledWrapper>
                ) : (
                    <VmiLocationStateContext.Provider value={this.props.vmiLocationState}>
                        <Zone contentId={this.props.id} zoneName="Content" />
                    </VmiLocationStateContext.Provider>
                )}
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiLocationDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: false,
        pageType: "System",
    },
};

export default pageModule;

export const VmiLocationDetailsPageContext = "VmiLocationDetailsPage";
