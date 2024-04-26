import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import translate from "@insite/client-framework/Translate";
import Clickable from "@insite/mobius/Clickable";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import React from "react";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: PayPalButtonStyles;
    error?: string;
    submitPayPalRequest: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface PayPalButtonStyles {
    container?: InjectableCss;
    image?: LazyImageProps;
    errorText?: TypographyPresentationProps;
}

export const payPalButtonStyles: PayPalButtonStyles = {
    container: {
        css: css`
            padding-top: 1em;
        `,
    },
    errorText: {
        color: "danger",
        weight: 600,
    },
};

const PayPalButton = ({ extendedStyles, submitPayPalRequest, error }: OwnProps) => {
    const [styles] = React.useState(() => mergeToNew(payPalButtonStyles, extendedStyles));
    const inputId = uniqueId();

    return (
        <StyledWrapper {...styles.container} data-test-selector="payPalButton">
            <Clickable
                id={inputId}
                onClick={submitPayPalRequest}
                title={translate("PayPal Express Checkout")}
                data-test-selector="payPalButtonClickable"
            >
                <LazyImage
                    src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/checkout-logo-large.png"
                    altText={translate("Express Checkout")}
                    {...styles.image}
                ></LazyImage>
            </Clickable>
            {error && (
                <Typography {...styles.errorText} data-test-selector="payPalButtonError">
                    {error}
                </Typography>
            )}
        </StyledWrapper>
    );
};

export default PayPalButton;
