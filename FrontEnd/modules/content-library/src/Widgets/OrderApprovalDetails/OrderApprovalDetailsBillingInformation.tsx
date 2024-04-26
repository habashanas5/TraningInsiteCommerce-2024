import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { Cart } from "@insite/client-framework/Services/CartService";
import translate from "@insite/client-framework/Translate";
import { BillToModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { FC, useState } from "react";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    billTo: BillToModel;
    extendedStyles?: OrderApprovalDetailsBillingInformationStyles;
}

export interface OrderApprovalDetailsBillingInformationStyles {
    billingInformationGridContainer?: GridContainerProps;
    billingInformationTitleGridItem?: GridItemProps;
    billingInformationTitle?: TypographyProps;
    billingInformationBillingAddressGridItem?: GridItemProps;
    billingAddressTitle: TypographyProps;
    billingAddress?: AddressInfoDisplayStyles;
    billingInformationCreditCardAddressGridItem?: GridItemProps;
    billingCreditCardAddressTitle?: TypographyProps;
    creditCardBillingAddress?: AddressInfoDisplayStyles;
}

export const orderConfirmationBillingInformationStyles: OrderApprovalDetailsBillingInformationStyles = {
    billingInformationGridContainer: {
        gap: 10,
    },
    billingInformationTitleGridItem: {
        width: 12,
    },
    billingInformationTitle: {
        variant: "h5",
        as: "h2",
        css: css`
            @media print {
                font-size: 15px;
            }
            padding-top: 0;
            margin-bottom: 0;
        `,
    },
    billingInformationBillingAddressGridItem: {
        width: [12, 12, 4, 4, 4],
        printWidth: 4,
        css: css`
            flex-direction: column;
        `,
    },
    billingAddressTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    billingInformationCreditCardAddressGridItem: {
        width: [6, 6, 4, 4, 4],
        printWidth: 4,
        css: css`
            flex-direction: column;
        `,
    },
    billingCreditCardAddressTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
};

type Props = OwnProps;

const OrderApprovalDetailsBillingInformation = ({ cart, extendedStyles, billTo }: Props) => {
    const [mergedStyles] = useState(() => mergeToNew(orderConfirmationBillingInformationStyles, extendedStyles));

    return (
        <GridContainer {...mergedStyles.billingInformationGridContainer}>
            <GridItem {...mergedStyles.billingInformationTitleGridItem}>
                <Typography {...mergedStyles.billingInformationTitle}>{translate("Billing Information")}</Typography>
            </GridItem>
            <GridItem {...mergedStyles.billingInformationBillingAddressGridItem}>
                <Typography {...mergedStyles.billingAddressTitle}>{translate("Billing Address")}</Typography>
                <AddressInfoDisplay
                    companyName={billTo.companyName}
                    address1={billTo.address1}
                    address2={billTo.address2}
                    address3={billTo.address3}
                    address4={billTo.address4}
                    city={billTo.city}
                    postalCode={billTo.postalCode}
                    state={billTo.state ? billTo.state.abbreviation : undefined}
                    extendedStyles={mergedStyles.billingAddress}
                />
            </GridItem>
            {cart.creditCardBillingAddress && (
                <GridItem
                    {...mergedStyles.billingInformationCreditCardAddressGridItem}
                    data-test-selector="creditCardBillingAddress"
                >
                    <Typography {...mergedStyles.billingCreditCardAddressTitle}>
                        {translate("Credit Card Address")}
                    </Typography>
                    <AddressInfoDisplay
                        address1={cart.creditCardBillingAddress.address1}
                        address2={cart.creditCardBillingAddress.address2}
                        city={cart.creditCardBillingAddress.city}
                        postalCode={cart.creditCardBillingAddress.postalCode}
                        state={cart.creditCardBillingAddress.stateAbbreviation}
                        extendedStyles={mergedStyles.creditCardBillingAddress}
                    />
                </GridItem>
            )}
        </GridContainer>
    );
};

export default OrderApprovalDetailsBillingInformation;
