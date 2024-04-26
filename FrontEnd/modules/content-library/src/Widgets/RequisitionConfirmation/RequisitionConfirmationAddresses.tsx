import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import { RequisitionConfirmationPageContext } from "@insite/content-library/Pages/RequisitionConfirmationPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const cart = getCartState(state, state.pages.requisitionConfirmation.cartId).value;

    return {
        shipTo: getShipToState(state, cart?.shipToId).value,
        billTo: getBillToState(state, cart?.billToId).value,
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RequisitionConfirmationAddressesStyles {
    container?: GridContainerProps;
    shippingInformationGridItem?: GridItemProps;
    shippingAddressTitle?: TypographyPresentationProps;
    shippingAddress?: AddressInfoDisplayStyles;
    billingInformationGridItem?: GridItemProps;
    billingAddressTitle?: TypographyPresentationProps;
    billingAddress?: AddressInfoDisplayStyles;
}

export const requisitionConfirmationAddressesStyles: RequisitionConfirmationAddressesStyles = {
    container: {
        gap: 15,
    },
    shippingInformationGridItem: {
        width: [12, 6, 6, 6, 6],
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
        width: [12, 6, 6, 6, 6],
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

const styles = requisitionConfirmationAddressesStyles;

const RequisitionConfirmationAddresses = ({ shipTo, billTo }: Props) => {
    if (!shipTo || !billTo) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.shippingInformationGridItem}>
                <Typography {...styles.shippingAddressTitle} as="h2">
                    {translate("Shipping Address")}
                </Typography>
                <AddressInfoDisplay
                    companyName={shipTo.companyName}
                    address1={shipTo.address1}
                    address2={shipTo.address2}
                    address3={shipTo.address3}
                    address4={shipTo.address4}
                    city={shipTo.city}
                    postalCode={shipTo.postalCode}
                    state={shipTo.state ? shipTo.state.abbreviation : undefined}
                    extendedStyles={styles.shippingAddress}
                />
            </GridItem>
            <GridItem {...styles.billingInformationGridItem}>
                <Typography {...styles.billingAddressTitle} as="h2">
                    {translate("Billing Address")}
                </Typography>
                <AddressInfoDisplay
                    companyName={billTo.companyName}
                    address1={billTo.address1}
                    address2={billTo.address2}
                    address3={billTo.address3}
                    address4={billTo.address4}
                    city={billTo.city}
                    postalCode={billTo.postalCode}
                    state={billTo.state ? billTo.state.abbreviation : undefined}
                    extendedStyles={styles.billingAddress}
                />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RequisitionConfirmationAddresses),
    definition: {
        displayName: "Addresses",
        allowedContexts: [RequisitionConfirmationPageContext],
        group: "Requisition Confirmation",
    },
};

export default widgetModule;
