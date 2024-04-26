import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartLinesList, { CartLinesListStyles } from "@insite/content-library/Components/CartLinesList";
import { RequisitionConfirmationPageContext } from "@insite/content-library/Pages/RequisitionConfirmationPage";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const { showSavingsAmount, showSavingsPercent } = getSettingsCollection(state).productSettings;
    return {
        cart: getCartState(state, state.pages.requisitionConfirmation.cartId).value,
        promotionsDataView: getPromotionsDataView(state, state.pages.requisitionConfirmation.cartId),
        showSavingsAmount,
        showSavingsPercent,
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RequisitionConfirmationProductListStyles {
    centeringWrapper?: InjectableCss;
    cartLinesList?: CartLinesListStyles;
}

export const requisitionConfirmationProductListStyles: RequisitionConfirmationProductListStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
    cartLinesList: {
        wrapper: {
            css: css`
                margin-top: 20px;
            `,
        },
        cardExpanded: {
            productDescriptionAndPartNumbersGridItem: { width: [12, 12, 6, 12, 6] },
            productPriceAndQuantityGridItem: { width: [12, 12, 6, 12, 6] },
        },
    },
};

const styles = requisitionConfirmationProductListStyles;

const RequisitionConfirmationProductList = ({
    cart,
    promotionsDataView,
    showSavingsAmount,
    showSavingsPercent,
}: Props) => {
    if (!cart || !promotionsDataView.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner />
            </StyledWrapper>
        );
    }

    return (
        <CartLinesList
            cart={cart}
            promotions={promotionsDataView.value}
            isCondensed={false}
            hideCondensedSelector={true}
            editable={false}
            showSavingsAmount={showSavingsAmount}
            showSavingsPercent={showSavingsPercent}
            extendedStyles={styles.cartLinesList}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RequisitionConfirmationProductList),
    definition: {
        displayName: "Product List",
        allowedContexts: [RequisitionConfirmationPageContext],
        group: "Requisition Confirmation",
    },
};

export default widgetModule;
