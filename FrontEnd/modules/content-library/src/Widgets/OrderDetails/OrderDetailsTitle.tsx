import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { useContext } from "react";

export interface OrderDetailsTitleStyles {
    titleText: TypographyProps;
}

export const titleStyles: OrderDetailsTitleStyles = {
    titleText: {
        variant: "h2",
        as: "h1",
    },
};

const styles = titleStyles;

const OrderDetailsTitle: React.FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    return (
        <Typography {...styles.titleText} data-test-selector="orderDetails_orderNumber">
            {order.erpOrderNumber
                ? `${translate("Order #")}${order.erpOrderNumber}`
                : `${translate("Web Order #")}${order.webOrderNumber}`}
        </Typography>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsTitle,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
