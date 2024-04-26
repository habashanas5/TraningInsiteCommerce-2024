import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartLinesList, { CartLinesListStyles } from "@insite/content-library/Components/CartLinesList";
import { OrderConfirmationPageContext } from "@insite/content-library/Pages/OrderConfirmationPage";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    cartState: getCartState(state, state.pages.orderConfirmation.cartId),
    promotionsDataView: getPromotionsDataView(state, state.pages.orderConfirmation.cartId),
    settingsCollection: getSettingsCollection(state),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface OrderConfirmationProductListStyles {
    centeringWrapper?: InjectableCss;
    orderLinesList?: CartLinesListStyles;
}

export const productListStyles: OrderConfirmationProductListStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
};

const styles = productListStyles;

const OrderConfirmationProductList: FC<Props> = ({ cartState, promotionsDataView, settingsCollection }) => {
    const [isCondensed, setIsCondensed] = useState(false);

    if (!cartState.value || !promotionsDataView.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner />
            </StyledWrapper>
        );
    }

    const { productSettings } = settingsCollection;

    return (
        <CartLinesList
            cart={cartState.value}
            promotions={promotionsDataView.value}
            isCondensed={isCondensed}
            onChangeIsCondensed={(event: React.SyntheticEvent<Element, Event>, value: boolean) => setIsCondensed(value)}
            editable={false}
            showSavingsAmount={productSettings.showSavingsAmount}
            showSavingsPercent={productSettings.showSavingsPercent}
            extendedStyles={styles.orderLinesList}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderConfirmationProductList),
    definition: {
        displayName: "Product List",
        allowedContexts: [OrderConfirmationPageContext],
        group: "Order Confirmation",
    },
};

export default widgetModule;
