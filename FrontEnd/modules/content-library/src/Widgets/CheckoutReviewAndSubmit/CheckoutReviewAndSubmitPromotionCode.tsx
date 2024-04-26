import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    canApplyPromotionsToCart,
    getCartState,
    getCurrentCartState,
} from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import applyPromotion from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/ApplyPromotion";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    const { isApplyingPromotion, promotionErrorMessage, promotionSuccessMessage, isCheckingOutWithPayPay } =
        state.pages.checkoutReviewAndSubmit;
    return {
        isApplyButtonDisabled: cartState.isLoading || isApplyingPromotion,
        canApplyPromosToCart: canApplyPromotionsToCart(getCurrentCartState(state).value) && !isCheckingOutWithPayPay,
        promotionErrorMessage,
        promotionSuccessMessage,
    };
};

const mapDispatchToProps = {
    applyPromotion,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutReviewAndSubmitPromotionCodeStyles {
    form?: InjectableCss;
    promotionCodeTextField?: TextFieldPresentationProps;
    applyButton?: ButtonPresentationProps;
    applySuccessText?: TypographyPresentationProps;
}

export const promotionCodeFormStyles: CheckoutReviewAndSubmitPromotionCodeStyles = {
    applyButton: {
        variant: "tertiary",
        css: css`
            margin-top: 10px;
        `,
    },
    applySuccessText: {
        color: "success",
        css: css`
            margin-top: 10px;
        `,
        weight: 600,
    },
};

const styles = promotionCodeFormStyles;
const StyledForm = getStyledWrapper("form");

const CheckoutReviewAndSubmitPromotionCode: FC<Props> = ({
    isApplyButtonDisabled,
    promotionSuccessMessage,
    promotionErrorMessage,
    canApplyPromosToCart,
    applyPromotion,
}) => {
    if (!canApplyPromosToCart) {
        return null;
    }

    const [promotionCode, setPromotionCode] = useState("");

    const handlePromotionCodeChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setPromotionCode(event.currentTarget.value);

    const handleSubmit = (event: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
        event.preventDefault();
        applyPromotion({ promotionCode });
    };

    return (
        <>
            <StyledForm {...styles.form} onSubmit={handleSubmit}>
                <TextField
                    {...styles.promotionCodeTextField}
                    label={translate("Have a Promotion Code?")}
                    value={promotionCode}
                    onChange={handlePromotionCodeChange}
                    error={promotionErrorMessage}
                    data-test-selector="promotionCodeTextField"
                />
                {promotionSuccessMessage && (
                    <Typography {...styles.applySuccessText} as="div">
                        {promotionSuccessMessage}
                    </Typography>
                )}
                <Button
                    {...styles.applyButton}
                    type="submit"
                    disabled={isApplyButtonDisabled || promotionCode.length === 0}
                    data-test-selector="applyPromotionCodeButton"
                >
                    {translate("Apply Promotion")}
                </Button>
            </StyledForm>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutReviewAndSubmitPromotionCode),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        displayName: "Promotion Code Form",
    },
};

export default widgetModule;
