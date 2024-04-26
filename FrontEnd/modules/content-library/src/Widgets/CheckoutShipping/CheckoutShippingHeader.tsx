import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutShippingPageContext } from "@insite/content-library/Pages/CheckoutShippingPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutShipping;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    const { isUpdatingCart } = state.pages.checkoutShipping;
    return {
        isContinueButtonDisabled: !cartState.value || cartState.isLoading || isUpdatingCart,
        pageTitle: getCurrentPage(state).fields.title,
    };
};

type Props = ReturnType<typeof mapStateToProps> & WidgetProps;

export interface CheckoutShippingHeaderStyles {
    container?: GridContainerProps;
    gridItem?: GridItemProps;
    heading?: TypographyPresentationProps;
    buttonsWrapper?: InjectableCss;
    continueButton?: ButtonPresentationProps;
}

export const pageHeaderStyles: CheckoutShippingHeaderStyles = {
    gridItem: { width: 12 },
    heading: { variant: "h2" },
    buttonsWrapper: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        position: fixed;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        z-index: 1;
                    `,
                    css`
                        margin-left: auto;
                    `,
                    css`
                        margin-left: auto;
                    `,
                    css`
                        margin-left: auto;
                    `,
                    css`
                        margin-left: auto;
                    `,
                ])}
        `,
    },
    continueButton: {
        css: css`
            width: 100%;
        `,
    },
};

const styles = pageHeaderStyles;

const CheckoutShippingHeader: FC<Props> = ({ pageTitle, isContinueButtonDisabled }) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.gridItem}>
                <Typography {...styles.heading} as="h1">
                    {pageTitle}
                </Typography>
                <StyledWrapper {...styles.buttonsWrapper}>
                    <Button
                        type="submit"
                        disabled={isContinueButtonDisabled}
                        {...styles.continueButton}
                        data-test-selector="checkoutShipping_continue"
                    >
                        {translate("Continue")}
                    </Button>
                </StyledWrapper>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(CheckoutShippingHeader),
    definition: {
        displayName: "Page Header",
        group: "Checkout - Shipping",
        allowedContexts: [CheckoutShippingPageContext],
    },
};

export default widgetModule;
