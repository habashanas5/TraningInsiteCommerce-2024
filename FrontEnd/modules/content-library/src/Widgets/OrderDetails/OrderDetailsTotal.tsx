import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import OrderTotalDisplay, { OrderTotalDisplayStyles } from "@insite/content-library/Components/OrderTotalDisplay";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import { GridContainerProps } from "@insite/mobius/GridContainer";
import { GridItemProps } from "@insite/mobius/GridItem";
import { TypographyProps } from "@insite/mobius/Typography";
import React, { FC, useContext } from "react";

export interface OrderDetailsTotalStyles {
    orderTotal?: OrderTotalDisplayStyles;

    /**
     * @deprecated Use orderTotal.container instead.
     */
    container?: GridContainerProps;
    /**
     * @deprecated Use orderTotal.subtotalLabelGridItem instead.
     */
    subtotalLabelGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.subtotalLabel instead.
     */
    subtotalLabel?: TypographyProps;
    /**
     * @deprecated Use orderTotal.subtotalValueGridItem instead.
     */
    subtotalValueGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.subtotalValue instead.
     */
    subtotalValue?: TypographyProps;
    /**
     * @deprecated Use orderTotal.discountsLabelGridItem instead.
     */
    discountsLabelGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.discountsLabel instead.
     */
    discountsLabel?: TypographyProps;
    /**
     * @deprecated Use orderTotal.discountsValueGridItem instead.
     */
    discountsValueGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.discountsValue instead.
     */
    discountsValue?: TypographyProps;
    /**
     * @deprecated Use orderTotal.shippingAndHandlingLabelGridItem instead.
     */
    shippingAndHandlingLabelGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.shippingAndHandlingLabel instead.
     */
    shippingAndHandlingLabel?: TypographyProps;
    /**
     * @deprecated Use orderTotal.shippingAndHandlingValueGridItem instead.
     */
    shippingAndHandlingValueGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.shippingAndHandlingValue instead.
     */
    shippingAndHandlingValue?: TypographyProps;
    /**
     * @deprecated Use orderTotal.otherChargesLabelGridItem instead.
     */
    otherChargesLabelGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.otherChargesLabel instead.
     */
    otherChargesLabel?: TypographyProps;
    /**
     * @deprecated Use orderTotal.otherChargesValueGridItem instead.
     */
    otherChargesValueGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.otherChargesValue instead.
     */
    otherChargesValue?: TypographyProps;
    /**
     * @deprecated Use orderTotal.taxLabelGridItem instead.
     */
    taxLabelGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.taxLabel instead.
     */
    taxLabel?: TypographyProps;
    /**
     * @deprecated Use orderTotal.taxValueGridItem instead.
     */
    taxValueGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.taxValue instead.
     */
    taxValue?: TypographyProps;
    /**
     * @deprecated Use orderTotal.totalLabelGridItem instead.
     */
    totalLabelGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.totalLabel instead.
     */
    totalLabel?: TypographyProps;
    /**
     * @deprecated Use orderTotal.totalValueGridItem instead.
     */
    totalValueGridItem?: GridItemProps;
    /**
     * @deprecated Use orderTotal.totalValue instead.
     */
    totalValue?: TypographyProps;
}

export const totalStyles: OrderDetailsTotalStyles = {};

const styles = totalStyles;

const OrderDetailsTotal: FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    return <OrderTotalDisplay order={order} extendedStyles={styles.orderTotal || styles} />;
};

const widgetModule: WidgetModule = {
    component: OrderDetailsTotal,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
