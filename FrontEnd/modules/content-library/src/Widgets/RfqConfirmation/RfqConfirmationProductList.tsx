import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartLinesList, { CartLinesListStyles } from "@insite/content-library/Components/CartLinesList";
import { RfqConfirmationPageContext } from "@insite/content-library/Pages/RfqConfirmationPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqConfirmation.quoteId),
    settingsCollection: getSettingsCollection(state),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RfqConfirmationProductListStyles {
    centeringWrapper?: InjectableCss;
    cartLinesList?: CartLinesListStyles;
    footerWrapper?: InjectableCss;
    backToTopButton?: ButtonPresentationProps;
}

export const rfqConfirmationProductListStyles: RfqConfirmationProductListStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
    cartLinesList: {
        cardExpanded: {
            productDescriptionAndPartNumbersGridItem: { width: [12, 12, 8, 8, 8] },
            productPriceAndQuantityGridItem: { width: [12, 12, 4, 4, 4] },
            priceGridItem: { width: 9 },
            quantityGridItem: { width: 3 },
            extendedUnitNetPriceGridItem: { width: 0 },
        },
    },
    footerWrapper: {
        css: css`
            display: flex;
            justify-content: center;
        `,
    },
    backToTopButton: {
        variant: "secondary",
        css: css`
            margin: 16px 0;
        `,
    },
};

const styles = rfqConfirmationProductListStyles;

const RfqConfirmationProductList: FC<Props> = ({ quoteState, settingsCollection }) => {
    const backToTopClickHandler = () => {
        window.scrollTo(0, 0);
    };

    if (!quoteState.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner />
            </StyledWrapper>
        );
    }

    const { productSettings } = settingsCollection;

    return (
        <>
            <CartLinesList
                cart={quoteState.value}
                promotions={[]}
                isCondensed={false}
                hideCondensedSelector={true}
                editable={false}
                showSavingsAmount={productSettings.showSavingsAmount}
                showSavingsPercent={productSettings.showSavingsPercent}
                extendedStyles={styles.cartLinesList}
            />
            <StyledWrapper {...styles.footerWrapper}>
                <Button onClick={backToTopClickHandler} {...styles.backToTopButton}>
                    {translate("Back to Top")}
                </Button>
            </StyledWrapper>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqConfirmationProductList),
    definition: {
        displayName: "Product List",
        allowedContexts: [RfqConfirmationPageContext],
        fieldDefinitions: [],
        group: "RFQ Quote Confirmation",
    },
};

export default widgetModule;
