import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import OrderLinesList, { OrderLinesListStyles } from "@insite/content-library/Components/OrderLinesList";
import { OrderStatusPageContext } from "@insite/content-library/Pages/OrderStatusPage";
import React, { FC } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    order: state.pages.orderStatus.order,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface OrderStatusProductListStyles {
    orderLines?: OrderLinesListStyles;
}

export const orderStatusProductListStyles: OrderStatusProductListStyles = {};

const styles = orderStatusProductListStyles;

const OrderStatusProductList: FC<Props> = ({ order }) => {
    if (!order) {
        return null;
    }

    return <OrderLinesList order={order} extendedStyles={styles.orderLines} />;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderStatusProductList),
    definition: {
        allowedContexts: [OrderStatusPageContext],
        displayName: "Product List",
        group: "Order Status",
    },
};

export default widgetModule;
