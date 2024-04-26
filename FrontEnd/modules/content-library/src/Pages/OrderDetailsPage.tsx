import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import parseQueryStringCaseInsensitive from "@insite/client-framework/Common/Utilities/parseQueryStringCaseInsensitive";
import Zone from "@insite/client-framework/Components/Zone";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getOrderState, OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import loadOrderStatusMappings from "@insite/client-framework/Store/Data/OrderStatusMappings/Handlers/LoadOrderStatusMappings";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import displayOrder from "@insite/client-framework/Store/Pages/OrderDetails/Handlers/DisplayOrder";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import Page from "@insite/mobius/Page";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    let orderNumber;
    if (location && location.search) {
        const parsedQuery = parseQueryStringCaseInsensitive(location.search, {
            orderNumber: "",
        });
        orderNumber = parsedQuery.orderNumber;
    }

    const orderState = getOrderState(state, orderNumber);
    const orderStatusMappingDataView = getOrderStatusMappingDataView(state);
    const isOrderNumberStoredInState = state.pages.orderDetails.orderNumber === orderNumber;

    return {
        orderNumber,
        orderState,
        shouldDisplayOrder: !isOrderNumberStoredInState,
        shouldLoadOrderStatusMappings: !orderStatusMappingDataView.value && !orderStatusMappingDataView.isLoading,
    };
};

const mapDispatchToProps = {
    displayOrder,
    loadOrderStatusMappings,
};

export interface OrderDetailsPageStyles {
    loadFailedWrapper?: InjectableCss;
    loadFailedText?: TypographyPresentationProps;
}

export const orderDetailsPageStyles: OrderDetailsPageStyles = {
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

class OrderDetailsPage extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        // The share entity (for orders) functionality can use this page
        // to render HTML for PDF generation, so we need to leave this SSR
        // ability so that functionality works.
        if (this.props.shouldLoadOrderStatusMappings) {
            this.props.loadOrderStatusMappings();
        }
        if (this.props.orderNumber && this.props.shouldDisplayOrder) {
            this.props.displayOrder({ orderNumber: this.props.orderNumber });
        }
    }

    render() {
        const styles = orderDetailsPageStyles;
        return (
            <Page>
                {this.props.orderState.errorStatusCode === 404 ? (
                    <StyledWrapper {...styles.loadFailedWrapper}>
                        <Typography {...styles.loadFailedText}>{siteMessage("Order_NotFound")}</Typography>
                    </StyledWrapper>
                ) : (
                    <OrderStateContext.Provider value={this.props.orderState}>
                        <Zone contentId={this.props.id} zoneName="Content" />
                    </OrderStateContext.Provider>
                )}
                <Modals />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const mapStateToOrderProps = (state: ApplicationState) => ({
    order: getOrderState(state, state.pages.orderDetails.orderNumber).value,
});

export const OrderDetailsPageContext = "OrderDetailsPage";
