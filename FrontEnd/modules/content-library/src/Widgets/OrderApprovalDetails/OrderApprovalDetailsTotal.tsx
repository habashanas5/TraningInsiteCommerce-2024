import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getDiscountTotal,
    getOrderPromotions,
    getPromotionsDataView,
    getShippingPromotions,
} from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import { OrderApprovalDetailsPageContext } from "@insite/content-library/Pages/OrderApprovalDetailsPage";
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const promotions = getPromotionsDataView(state, state.pages.orderApprovalDetails.cartId).value;

    return {
        orderPromotions: promotions ? getOrderPromotions(promotions) : undefined,
        shippingPromotions: promotions ? getShippingPromotions(promotions) : undefined,
        discountTotal: promotions ? getDiscountTotal(promotions) : undefined,
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & HasCartContext;

export interface OrderApprovalDetailsTotalStyles {
    cartTotal?: CartTotalDisplayStyles;
}

export const orderApprovalDetailsTotalStyles: OrderApprovalDetailsTotalStyles = {};

const styles = orderApprovalDetailsTotalStyles;

const OrderApprovalDetailsTotal = ({ cart, orderPromotions, shippingPromotions, discountTotal }: Props) => {
    if (!cart) {
        return null;
    }

    return (
        <CartTotalDisplay
            cart={cart}
            orderPromotions={orderPromotions}
            shippingPromotions={shippingPromotions}
            discountTotal={discountTotal}
            extendedStyles={styles.cartTotal}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withCart(OrderApprovalDetailsTotal)),
    definition: {
        group: "Order Approval Details",
        allowedContexts: [OrderApprovalDetailsPageContext],
        displayName: "Order Approval Total",
    },
};

export default widgetModule;
