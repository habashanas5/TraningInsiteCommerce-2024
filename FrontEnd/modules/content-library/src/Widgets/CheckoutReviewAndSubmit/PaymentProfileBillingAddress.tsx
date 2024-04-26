import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";

interface OwnProps {
    address: string;
    extendedStyles?: PaymentProfileBillingAddressStyles;
}

export interface PaymentProfileBillingAddressStyles {
    wrapper?: InjectableCss;
    label?: TypographyPresentationProps;
    text?: TypographyPresentationProps;
}

export const paymentProfileBillingAddressStyles: PaymentProfileBillingAddressStyles = {
    label: { weight: 600 },
};

const PaymentProfileBillingAddress = (props: OwnProps) => {
    const [styles] = React.useState(() => mergeToNew(paymentProfileBillingAddressStyles, props.extendedStyles));

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.label} id="paymentProfileBillingAddress">
                {translate("Billing Address")}:
            </Typography>
            <Typography {...styles.text} aria-labelledby="paymentProfileBillingAddress">
                {props.address}
            </Typography>
        </StyledWrapper>
    );
};

export default PaymentProfileBillingAddress;
