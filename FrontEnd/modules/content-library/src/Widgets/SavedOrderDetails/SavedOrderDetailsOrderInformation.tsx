import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { SavedOrderDetailsPageContext } from "@insite/content-library/Pages/SavedOrderDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { css } from "styled-components";

export interface SavedOrderDetailsOrderInformationStyles {
    orderInformationGridContainer?: GridContainerProps;
    mainInformationGridContainer?: GridContainerProps;
    mainInformationGridItem?: GridItemProps;
    orderDateGridItem?: GridItemProps;
    orderDateTitle?: TypographyPresentationProps;
    orderDateText?: TypographyPresentationProps;
    shippingInformationGridItem?: GridItemProps;
    shippingAddressTitle?: TypographyPresentationProps;
    shippingAddress?: AddressInfoDisplayStyles;
    billingInformationGridItem?: GridItemProps;
    billingAddressTitle: TypographyPresentationProps;
    billingAddress?: AddressInfoDisplayStyles;
}

export const savedOrderDetailsOrderInformationStyles: SavedOrderDetailsOrderInformationStyles = {
    orderInformationGridContainer: {
        gap: 15,
    },
    mainInformationGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    orderDateGridItem: {
        width: 3,
        css: css`
            flex-direction: column;
        `,
    },
    orderDateTitle: {
        variant: "h6",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    shippingInformationGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    shippingAddressTitle: {
        variant: "h6",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    billingInformationGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    billingAddressTitle: {
        variant: "h6",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
};

const styles = savedOrderDetailsOrderInformationStyles;
type Props = WidgetProps & HasCartContext;

const SavedOrderDetailsOrderInformation = ({ cart }: Props) => {
    if (!cart || !cart.shipTo || !cart.billTo) {
        return null;
    }

    return (
        <GridContainer data-test-selector="savedOrderDetails_information" {...styles.orderInformationGridContainer}>
            <GridItem {...styles.mainInformationGridItem}>
                <Typography {...styles.orderDateTitle} as="h3">
                    {translate("Order Date")}
                </Typography>
                <Typography {...styles.orderDateText} data-test-selector="savedOrderDetails_orderDate">
                    <LocalizedDateTime dateTime={cart.orderDate} />
                </Typography>
            </GridItem>
            <GridItem {...styles.shippingInformationGridItem}>
                <Typography {...styles.shippingAddressTitle} as="h3">
                    {translate("Shipping Address")}
                </Typography>
                <AddressInfoDisplay
                    companyName={cart.shipTo.companyName}
                    address1={cart.shipTo.address1}
                    address2={cart.shipTo.address2}
                    address3={cart.shipTo.address3}
                    address4={cart.shipTo.address4}
                    city={cart.shipTo.city}
                    postalCode={cart.shipTo.postalCode}
                    state={cart.shipTo.state ? cart.shipTo.state.abbreviation : undefined}
                    extendedStyles={styles.shippingAddress}
                />
            </GridItem>
            <GridItem {...styles.billingInformationGridItem}>
                <Typography {...styles.billingAddressTitle} as="h3">
                    {translate("Billing Address")}
                </Typography>
                <AddressInfoDisplay
                    companyName={cart.billTo.companyName}
                    address1={cart.billTo.address1}
                    address2={cart.billTo.address2}
                    address3={cart.billTo.address3}
                    address4={cart.billTo.address4}
                    city={cart.billTo.city}
                    postalCode={cart.billTo.postalCode}
                    state={cart.billTo.state ? cart.billTo.state.abbreviation : undefined}
                    extendedStyles={styles.billingAddress}
                />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: withCart(SavedOrderDetailsOrderInformation),
    definition: {
        displayName: "Saved Order Information",
        allowedContexts: [SavedOrderDetailsPageContext],
        group: "Saved Order Details",
    },
};

export default widgetModule;
