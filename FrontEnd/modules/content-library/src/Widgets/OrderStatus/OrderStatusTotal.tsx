import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import OrderTotalDisplay, { OrderTotalDisplayStyles } from "@insite/content-library/Components/OrderTotalDisplay";
import { OrderStatusPageContext } from "@insite/content-library/Pages/OrderStatusPage";
import React, { FC } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    order: state.pages.orderStatus.order,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface OrderStatusTotalStyles {
    orderTotal?: OrderTotalDisplayStyles;
}

export const orderStatusTotalStyles: OrderStatusTotalStyles = {};

const styles = orderStatusTotalStyles;

const OrderStatusTotal: FC<Props> = ({ order }) => {
    if (!order) {
        return null;
    }

    return <OrderTotalDisplay order={order} extendedStyles={styles.orderTotal} />;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderStatusTotal),
    definition: {
        allowedContexts: [OrderStatusPageContext],
        group: "Order Status",
    },
};

export default widgetModule;
