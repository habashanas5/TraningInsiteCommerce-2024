import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import translate from "@insite/client-framework/Translate";
import { InvoiceModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { css } from "styled-components";

interface OwnProps {
    invoice: InvoiceModel;
    extendedStyles?: InvoiceDetailsBillingAddressStyles;
}

export interface InvoiceDetailsBillingAddressStyles {
    headerText?: TypographyPresentationProps;
    titleText?: TypographyProps;
    addressDisplay?: AddressInfoDisplayStyles;
    wrapper?: InjectableCss;
}

export const billingAddressStyles: InvoiceDetailsBillingAddressStyles = {
    headerText: {
        variant: "h5",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    titleText: {
        variant: "h6",
        as: "h2",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
};

const InvoiceDetailsBillingAddress = ({ invoice, extendedStyles }: OwnProps) => {
    if (!invoice) {
        return null;
    }

    const [styles] = React.useState(() => mergeToNew(billingAddressStyles, extendedStyles));

    return (
        <StyledWrapper {...styles.wrapper} data-test-selector="tst_invoiceDetail_billingAddress">
            <Typography as="h2" {...styles.headerText}>
                {translate("Billing Information")}
            </Typography>
            <Typography {...styles.titleText}>{translate("Billing Address")}</Typography>
            <AddressInfoDisplay
                companyName={invoice.btCompanyName}
                address1={invoice.btAddress1}
                address2={invoice.btAddress2}
                city={invoice.billToCity}
                state={invoice.billToState}
                postalCode={invoice.billToPostalCode}
                country={invoice.btCountry}
                extendedStyles={styles.addressDisplay}
            />
        </StyledWrapper>
    );
};

export default InvoiceDetailsBillingAddress;
