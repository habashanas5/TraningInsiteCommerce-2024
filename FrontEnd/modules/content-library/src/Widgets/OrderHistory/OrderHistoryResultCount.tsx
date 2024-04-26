import { OrdersDataViewContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC, useContext } from "react";

export interface OrderHistoryResultCountStyles {
    orderCountText?: TypographyPresentationProps;
}

export const resultCountStyles: OrderHistoryResultCountStyles = {};

const styles = resultCountStyles;

const OrderHistoryResultCount: FC<WidgetProps> = () => {
    const ordersDataView = useContext(OrdersDataViewContext);

    if (!ordersDataView.value || !ordersDataView.pagination) {
        return null;
    }

    const { totalItemCount } = ordersDataView.pagination;

    if (totalItemCount === 0) {
        return null;
    }

    return (
        <Typography {...styles.orderCountText} data-test-selector="orderHistory_resultCount">
            {totalItemCount} {translate("orders")}
        </Typography>
    );
};

const widgetModule: WidgetModule = {
    component: OrderHistoryResultCount,
    definition: {
        group: "Order History",
        displayName: "Result Count",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
