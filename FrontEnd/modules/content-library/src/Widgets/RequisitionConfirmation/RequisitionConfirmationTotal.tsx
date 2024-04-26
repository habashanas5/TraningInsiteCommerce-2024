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
import { RequisitionConfirmationPageContext } from "@insite/content-library/Pages/RequisitionConfirmationPage";
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const promotions = getPromotionsDataView(state, state.pages.requisitionConfirmation.cartId).value;

    return {
        cart: getCartState(state, state.pages.requisitionConfirmation.cartId).value,
        orderPromotions: promotions ? getOrderPromotions(promotions) : undefined,
        shippingPromotions: promotions ? getShippingPromotions(promotions) : undefined,
        discountTotal: promotions ? getDiscountTotal(promotions) : undefined,
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RequisitionConfirmationTotalStyles {
    cartTotal?: CartTotalDisplayStyles;
}

export const requisitionConfirmationTotalStyles: RequisitionConfirmationTotalStyles = {};

const styles = requisitionConfirmationTotalStyles;

const RequisitionConfirmationTotal = ({ cart, orderPromotions, shippingPromotions, discountTotal }: Props) => {
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
    component: connect(mapStateToProps)(RequisitionConfirmationTotal),
    definition: {
        displayName: "Total",
        allowedContexts: [RequisitionConfirmationPageContext],
        group: "Requisition Confirmation",
    },
};

export default widgetModule;
