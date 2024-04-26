import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadOrders from "@insite/client-framework/Store/Data/Orders/Handlers/LoadOrders";
import { getOrdersDataView } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CardContainer, { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import CardList, { CardListStyles } from "@insite/content-library/Components/CardList";
import CardListHeading from "@insite/content-library/Components/CardListHeading";
import OrderSummaryCard, { OrderSummaryCardStyles } from "@insite/content-library/Components/OrderSummaryCard";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
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
    const isAuthenticated = session.isAuthenticated && !session.isGuest;
    return {
        ordersDataView: getOrdersDataView(state, recentOrdersParameter),
        orderHistoryPageLink: getPageLinkByPageType(state, "OrderHistoryPage"),
        settingsCollection: getSettingsCollection(state),
        canViewOrders: isAuthenticated && (session.userRoles || "").indexOf("Requisitioner") === -1,
    };
};

const mapDispatchToProps = {
    loadOrders,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RecentOrdersStyles {
    cardList?: CardListStyles;
    errorGridItem?: GridItemProps;
    errorText?: TypographyPresentationProps;
    noOrdersFoundGridItem?: GridItemProps;
    noOrdersFoundText?: TypographyPresentationProps;
    cardContainer?: CardContainerStyles;
    orderSummaryCard?: OrderSummaryCardStyles;
}

export const recentOrdersStyles: RecentOrdersStyles = {
    errorGridItem: { width: 12 },
    noOrdersFoundGridItem: { width: 12 },
};

let recentOrdersParameter: GetOrdersApiParameter = {
    page: 1,
    sort: "OrderDate DESC",
};

const styles = recentOrdersStyles;

class RecentOrders extends React.Component<Props> {
    componentDidMount() {
        recentOrdersParameter.pageSize = this.props.fields.numberOfRecords;
        if (this.props.canViewOrders && !this.props.ordersDataView.value) {
            this.props.loadOrders(recentOrdersParameter);
        }
    }

    render() {
        const { ordersDataView, orderHistoryPageLink, settingsCollection, canViewOrders } = this.props;
        if (!canViewOrders || !ordersDataView.value) {
            return null;
        }

        const orderHistoryUrl = orderHistoryPageLink ? orderHistoryPageLink.url : undefined;

        return (
            <CardList
                css={css`
                    padding-bottom: 50px;
                `}
                extendedStyles={styles.cardList}
            >
                <CardListHeading heading={translate("Recent Orders")} viewAllUrl={orderHistoryUrl} />
                {ordersDataView.value.length === 0 && (
                    <GridItem {...styles.noOrdersFoundGridItem}>
                        <Typography {...styles.noOrdersFoundText}>{translate("No orders found")}</Typography>
                    </GridItem>
                )}
                {ordersDataView.value.map(
                    order =>
                        order !== null && (
                            <CardContainer key={order.id} extendedStyles={styles.cardContainer}>
                                <OrderSummaryCard
                                    order={order}
                                    orderSettings={settingsCollection.orderSettings}
                                    extendedStyles={styles.orderSummaryCard}
                                />
                            </CardContainer>
                        ),
                )}
            </CardList>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RecentOrders),
    definition: {
        group: "Common",
        icon: "List",
        fieldDefinitions: [
            {
                name: fields.numberOfRecords,
                displayName: "Number of Recent Orders Displayed",
                editorTemplate: "IntegerField",
                min: 1,
                defaultValue: 5,
                fieldType: "General",
                sortOrder: 1,
            },
        ],
    },
};

export default widgetModule;
