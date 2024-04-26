import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";
import activateInvite from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/ActivateInvite";
import loadWishListIfNeeded from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListIfNeeded";
import setAllWishListLinesIsSelected from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetAllWishListLinesIsSelected";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import { generateLinksFrom } from "@insite/content-library/Components/PageBreadcrumbs";
import Page from "@insite/mobius/Page";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ id?: string; invite?: string }>(location.search);
    const homePageUrl = getHomePageUrl(state);
    const id = parsedQuery.id;
    return {
        invite: parsedQuery.invite,
        location,
        homePageUrl,
        wishListId: id,
        wishListState: getWishListState(state, id),
        parentNodeId: getCurrentPage(state).parentId,
        links: state.links,
        breadcrumbLinks: state.components.breadcrumbs.links,
    };
};

const mapDispatchToProps = {
    activateInvite,
    loadWishListIfNeeded,
    setAllWishListLinesIsSelected,
    setBreadcrumbs,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & PageProps & HasHistory;

interface State {
    inviteIsNotAvailable: boolean;
}

export interface MyListsDetailsPageStyles {
    inviteIsNotAvailableWrapper?: InjectableCss;
    inviteIsNotAvailableText?: TypographyPresentationProps;
}

export const myListsDetailsPageStyles: MyListsDetailsPageStyles = {
    inviteIsNotAvailableWrapper: {
        css: css`
            display: flex;
            height: 200px;
            justify-content: center;
            align-items: center;
            background-color: ${getColor("common.accent")};
        `,
    },
    inviteIsNotAvailableText: { weight: "bold" },
};

class MyListsDetailsPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            inviteIsNotAvailable: false,
        };
    }

    private checkState() {
        if (!this.props.breadcrumbLinks && this.props.wishListState.value) {
            const newLinks = generateLinksFrom(this.props.links, this.props.parentNodeId, this.props.homePageUrl);
            newLinks.push({ children: this.props.wishListState.value?.name });
            this.props.setBreadcrumbs({ links: newLinks });
        }
    }

    componentDidMount(): void {
        if (this.props.wishListId) {
            this.props.setAllWishListLinesIsSelected({ isSelected: false });
            this.props.loadWishListIfNeeded({ wishListId: this.props.wishListId });
        }

        if (this.props.invite) {
            this.props.activateInvite({
                invite: this.props.invite,
                onSuccess: wishList => {
                    this.props.history.replace(`${this.props.location.pathname}?id=${wishList.id}`);
                },
                onError: () => {
                    this.setState({ inviteIsNotAvailable: true });
                },
                onComplete(wishListProps) {
                    if (wishListProps.result?.wishList) {
                        this.onSuccess?.(wishListProps.result.wishList);
                    } else if (wishListProps.result?.errorMessage) {
                        this.onError?.(wishListProps.result.errorMessage);
                    }
                },
            });
        }
    }

    UNSAFE_componentWillMount() {
        this.checkState();
    }

    componentDidUpdate(): void {
        if (
            !this.props.wishListState.value &&
            !this.props.wishListState.isLoading &&
            this.props.wishListId &&
            !this.props.wishListState.errorStatusCode
        ) {
            this.props.loadWishListIfNeeded({ wishListId: this.props.wishListId });
        }

        this.checkState();
    }

    render() {
        const styles = myListsDetailsPageStyles;
        return (
            <Page>
                {this.state.inviteIsNotAvailable || this.props.wishListState.errorStatusCode === 404 ? (
                    <StyledWrapper {...styles.inviteIsNotAvailableWrapper}>
                        <Typography {...styles.inviteIsNotAvailableText}>
                            {this.state.inviteIsNotAvailable
                                ? siteMessage("Lists_InviteIsNotAvailable")
                                : siteMessage("Lists_List_NotFound")}
                        </Typography>
                    </StyledWrapper>
                ) : (
                    <Zone contentId={this.props.id} zoneName="Content" />
                )}
                <Modals />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(MyListsDetailsPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const MyListsDetailsPageContext = "MyListsDetailsPage";
