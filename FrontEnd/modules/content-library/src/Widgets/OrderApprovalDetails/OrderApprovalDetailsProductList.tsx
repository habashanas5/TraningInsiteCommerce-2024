import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartLinesList, { CartLinesListStyles } from "@insite/content-library/Components/CartLinesList";
import { OrderApprovalDetailsPageContext } from "@insite/content-library/Pages/OrderApprovalDetailsPage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const settingsCollection = getSettingsCollection(state);
    return {
        showSavingsAmount: settingsCollection.productSettings?.showSavingsAmount,
        showSavingsPercent: settingsCollection.productSettings?.showSavingsPercent,
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & HasCartContext;

export interface OrderApprovalDetailsProductListStyles {
    centeringWrapper?: InjectableCss;
    orderLinesList?: CartLinesListStyles;
}

export const productListStyles: OrderApprovalDetailsProductListStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
};

export const styles = productListStyles;

const OrderApprovalDetailsProductList = ({ showSavingsAmount, showSavingsPercent, cart }: Props) => {
    const [isCondensed, setIsCondensed] = useState(false);

    if (!cart) {
        return null;
    }

    return (
        <CartLinesList
            cart={cart}
            isCondensed={isCondensed}
            onChangeIsCondensed={(event: React.SyntheticEvent<Element, Event>, value: boolean) => setIsCondensed(value)}
            editable={false}
            showSavingsAmount={showSavingsAmount}
            showSavingsPercent={showSavingsPercent}
            extendedStyles={styles.orderLinesList}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withCart(OrderApprovalDetailsProductList)),
    definition: {
        displayName: "Product List",
        allowedContexts: [OrderApprovalDetailsPageContext],
        group: "Order Approval Details",
    },
};

export default widgetModule;
