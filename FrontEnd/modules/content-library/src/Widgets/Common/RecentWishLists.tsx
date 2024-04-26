import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadWishLists from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishLists";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import addWishListToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddWishListToCart";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CardContainer from "@insite/content-library/Components/CardContainer";
import CardList from "@insite/content-library/Components/CardList";
import CardListHeading from "@insite/content-library/Components/CardListHeading";
import WishListCard, { WishListCardStyles } from "@insite/content-library/Components/WishListCard";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    numberOfRecords = "numberOfRecords",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.numberOfRecords]: number;
    };
}

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    return {
        recentWishListsDataView: getWishListsDataView(state, recentWishListsParameter),
        myListsPageNavLink: getPageLinkByPageType(state, "MyListsPage"),
        canViewWishLists: (session.isAuthenticated || session.rememberMe) && !session.isGuest,
    };
};

let recentWishListsParameter = {
    page: 1,
    sort: "ModifiedOn DESC",
    expand: ["top3products"],
} as GetWishListsApiParameter;

const mapDispatchToProps = {
    loadWishLists,
    addWishListToCart,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RecentWishListsStyles {
    wishListCardGridItem?: GridItemProps;
    noWishListsText?: TypographyProps;
    wishListCard?: WishListCardStyles;
}

export const recentWishListsStyles: RecentWishListsStyles = {
    wishListCardGridItem: {
        width: 12,
        css: css`
            padding: 0;
        `,
    },
    wishListCard: {
        actionAddToCartButton: {
            typographyProps: {
                size: 14,
            },
        },
    },
};

const styles = recentWishListsStyles;

class RecentWishLists extends React.Component<Props> {
    componentDidMount() {
        recentWishListsParameter.pageSize = this.props.fields.numberOfRecords;
        if (
            this.props.canViewWishLists &&
            !this.props.recentWishListsDataView.value &&
            !this.props.recentWishListsDataView.isLoading
        ) {
            this.props.loadWishLists(recentWishListsParameter);
        }
    }

    componentDidUpdate() {
        if (
            this.props.canViewWishLists &&
            !this.props.recentWishListsDataView.value &&
            !this.props.recentWishListsDataView.isLoading
        ) {
            this.props.loadWishLists(recentWishListsParameter);
        }
    }

    render() {
        if (!this.props.canViewWishLists) {
            return null;
        }

        const {
            recentWishListsDataView: { value: recentWishLists },
            myListsPageNavLink,
        } = this.props;
        const myListsPageUrl = myListsPageNavLink ? myListsPageNavLink.url : undefined;

        return (
            <CardList data-test-selector="cardListRecentWishLists">
                <CardListHeading heading={translate("My Lists")} viewAllUrl={myListsPageUrl} />
                {recentWishLists && recentWishLists.length === 0 && (
                    <GridItem width={12}>
                        <Typography {...styles.noWishListsText}>{siteMessage("WishLists_NoWishlistsFound")}</Typography>
                    </GridItem>
                )}
                {recentWishLists &&
                    recentWishLists.map(wishList => (
                        <CardContainer key={wishList.id}>
                            <GridItem {...styles.wishListCardGridItem}>
                                <WishListCard
                                    wishList={wishList}
                                    addWishListToCart={this.props.addWishListToCart}
                                    extendedStyles={styles.wishListCard}
                                />
                            </GridItem>
                        </CardContainer>
                    ))}
            </CardList>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RecentWishLists),
    definition: {
        group: "Common",
        icon: "List",
        fieldDefinitions: [
            {
                name: fields.numberOfRecords,
                displayName: "Number of Lists Displayed",
                editorTemplate: "IntegerField",
                min: 1,
                defaultValue: 3,
                fieldType: "General",
                sortOrder: 1,
            },
        ],
    },
};

export default widgetModule;
