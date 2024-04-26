import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import {
    getDiscountTotal,
    getOrderPromotions,
    getPromotionsDataView,
    getShippingPromotions,
} from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import { OrderConfirmationPageContext } from "@insite/content-library/Pages/OrderConfirmationPage";
import React, { FC } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const promotionsDataView = getPromotionsDataView(state, state.pages.orderConfirmation.cartId);
    let orderPromotions;
    let shippingPromotions;
    let discountTotal;
    if (promotionsDataView.value) {
        orderPromotions = getOrderPromotions(promotionsDataView.value);
        shippingPromotions = getShippingPromotions(promotionsDataView.value);
        discountTotal = getDiscountTotal(promotionsDataView.value);
    }

    return {
        cartState: getCartState(state, state.pages.orderConfirmation.cartId),
        orderPromotions,
        shippingPromotions,
        discountTotal,
        promotionsDataView,
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface OrderConfirmationTotalStyles {
    cartTotal?: CartTotalDisplayStyles;
}

export const orderConfirmationTotalStyles: OrderConfirmationTotalStyles = {};

const styles = orderConfirmationTotalStyles;

const OrderConfirmationTotal: FC<Props> = props => {
    if (!props.cartState.value || !props.promotionsDataView.value) {
        return null;
    }

    return (
        <CartTotalDisplay
            cart={props.cartState.value}
            orderPromotions={props.orderPromotions}
            discountTotal={props.discountTotal}
            shippingPromotions={props.shippingPromotions}
            extendedStyles={styles.cartTotal}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderConfirmationTotal),
    definition: {
        group: "Order Confirmation",
        allowedContexts: [OrderConfirmationPageContext],
        displayName: "Order Confirmation Total",
    },
};

export default widgetModule;
