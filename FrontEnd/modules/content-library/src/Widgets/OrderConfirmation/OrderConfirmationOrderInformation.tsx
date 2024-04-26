import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import { OrderConfirmationPageContext } from "@insite/content-library/Pages/OrderConfirmationPage";
import OrderConfirmationBillingInformation, {
    OrderConfirmationBillingInformationStyles,
} from "@insite/content-library/Widgets/OrderConfirmation/OrderConfirmationBillingInformation";
import OrderConfirmationShippingInformation, {
    OrderConfirmationShippingInformationStyles,
} from "@insite/content-library/Widgets/OrderConfirmation/OrderConfirmationShippingInformation";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const cart = getCartState(state, state.pages.orderConfirmation.cartId).value;
    return {
        cart,
        billTo: getBillToState(state, cart?.billToId).value,
        shipTo: getShipToState(state, cart?.shipToId).value,
        pickUpWarehouse: state.context.session.pickUpWarehouse,
        enableVat: getSettingsCollection(state).productSettings.enableVat,
        language: state.context.session.language,
    };
};

const mapDispatchToProps = {
    loadBillTo,
    loadShipTo,
};

export interface OrderConfirmationOrderInformationStyles {
    OrderInformationGridContainer?: GridContainerProps;
    orderNumberGridItem?: GridItemProps;
    orderNumberHeading?: TypographyProps;
    orderNumberText?: TypographyPresentationProps;
    shippingInformationGridItem?: GridItemProps;
    vatNumberGridItem?: GridItemProps;
    vatNumberTitleText?: TypographyPresentationProps;
    vatNumberText?: TypographyPresentationProps;
    orderConfirmationShippingInformation?: OrderConfirmationShippingInformationStyles;
    billingInformationGridItem?: GridItemProps;
    orderConfirmationBillingInformation?: OrderConfirmationBillingInformationStyles;
    notesGridItem?: GridItemProps;
    notesTitle: TypographyProps;
    notesDescription?: TypographyPresentationProps;
    orderDetailsGridContainer?: GridContainerProps;
    orderInformationGridItems?: GridItemProps;
    informationGridContainer?: GridContainerProps;
    statusGridItem?: GridItemProps;
    orderDateGridItem?: GridItemProps;
    poNumberGridItem?: GridItemProps;
    salespersonGridItem?: GridItemProps;
    dueDateGridItem?: GridItemProps;
    billingAddressGridItem?: GridItemProps;
    shippingAddressGridItem?: GridItemProps;
    orderNotesGridItem?: GridItemProps;
    headingAndTextStyles?: SmallHeadingAndTextStyles;
}

export const orderInformationStyles: OrderConfirmationOrderInformationStyles = {
    OrderInformationGridContainer: {
        gap: 10,
    },
    orderNumberGridItem: {
        width: 12,
    },
    orderNumberHeading: {
        variant: "h2",
        as: "h1",
        css: css`
            margin-bottom: 5px;
        `,
    },
    shippingInformationGridItem: {
        width: 12,
    },
    vatNumberGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    vatNumberTitleText: {
        variant: "h6",
        css: css`
            margin-bottom: 5px;
        `,
    },
    billingInformationGridItem: {
        width: 12,
    },
    notesGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    notesTitle: {
        variant: "h6",
        as: "h2",
        css: css`
            margin-bottom: 5px;
        `,
    },
    headingAndTextStyles: {
        heading: {
            variant: "h6",
            as: "h2",
            css: css`
                @media print {
                    font-size: 12px;
                }
                margin-bottom: 5px;
            `,
        },
    },
    orderInformationGridItems: {
        css: css`
            @media print {
                padding: 5px !important;
            }
        `,
    },
    statusGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    orderDateGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    poNumberGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    salespersonGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    dueDateGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    billingAddressGridItem: {
        width: 6,
    },
    shippingAddressGridItem: {
        width: 6,
    },
    orderNotesGridItem: {
        width: 12,
    },
    orderDetailsGridContainer: {
        css: css`
            padding-left: 5px;
            padding-bottom: 15px;
        `,
    },
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const styles = orderInformationStyles;

const OrderConfirmationOrderInformation: FC<Props> = props => {
    const language = props.language;
    if (!props.cart) {
        return null;
    }

    if (!props.billTo && props.cart.billToId) {
        props.loadBillTo({ billToId: props.cart.billToId });
    }

    if (!props.shipTo && props.cart.billToId && props.cart.shipToId) {
        props.loadShipTo({ billToId: props.cart.billToId, shipToId: props.cart.shipToId });
    }

    if (!props.billTo || !props.shipTo) {
        return null;
    }

    return (
        <GridContainer {...styles.OrderInformationGridContainer}>
            <GridItem {...styles.orderNumberGridItem}>
                <Typography {...styles.orderNumberHeading}>
                    {`${translate("Order")} #`}
                    <Typography {...styles.orderNumberText} data-test-selector="orderConfirmation_orderNumber">
                        {props.cart.erpOrderNumber || props.cart.orderNumber}
                    </Typography>
                </Typography>
            </GridItem>
            <GridContainer {...styles.orderDetailsGridContainer}>
                <GridItem {...mergeToNew(styles.orderInformationGridItems, styles.orderDateGridItem)}>
                    <SmallHeadingAndText
                        extendedStyles={styles.headingAndTextStyles}
                        heading={translate("Order Date")}
                        text={getLocalizedDateTime({
                            dateTime: new Date(props.cart.orderDate as Date),
                            language,
                        })}
                    />
                </GridItem>
                <GridItem {...mergeToNew(styles.orderInformationGridItems, styles.poNumberGridItem)}>
                    <SmallHeadingAndText
                        extendedStyles={styles.headingAndTextStyles}
                        heading={translate("PO Number")}
                        text={props.cart.poNumber}
                    />
                </GridItem>
                <GridItem {...mergeToNew(styles.orderInformationGridItems, styles.statusGridItem)}>
                    <SmallHeadingAndText
                        extendedStyles={styles.headingAndTextStyles}
                        heading={translate("Status")}
                        text={props.cart.status}
                    />
                </GridItem>
                {props.cart?.salespersonName && (
                    <GridItem {...mergeToNew(styles.orderInformationGridItems, styles.salespersonGridItem)}>
                        <SmallHeadingAndText
                            extendedStyles={styles.headingAndTextStyles}
                            heading={translate("Salesperson")}
                            text={props.cart.salespersonName}
                        />
                    </GridItem>
                )}
            </GridContainer>
            <GridItem {...styles.shippingInformationGridItem}>
                <OrderConfirmationShippingInformation
                    cart={props.cart}
                    shipTo={props.shipTo}
                    pickUpWarehouse={props.pickUpWarehouse}
                    extendedStyles={styles.orderConfirmationShippingInformation}
                />
            </GridItem>
            {props.enableVat && props.cart.customerVatNumber && (
                <GridItem {...styles.vatNumberGridItem}>
                    <Typography {...styles.vatNumberTitleText} as="h3">
                        {translate("VAT Number")}
                    </Typography>
                    <Typography {...styles.vatNumberText}>{props.cart.customerVatNumber}</Typography>
                </GridItem>
            )}
            <GridItem {...styles.billingInformationGridItem}>
                <OrderConfirmationBillingInformation
                    cart={props.cart}
                    billTo={props.billTo}
                    extendedStyles={styles.orderConfirmationBillingInformation}
                />
            </GridItem>
            {props.cart.notes && (
                <GridItem {...styles.notesGridItem}>
                    <Typography {...styles.notesTitle}>{translate("Notes")}</Typography>
                    <Typography {...styles.notesDescription}>{props.cart.notes}</Typography>
                </GridItem>
            )}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderConfirmationOrderInformation),
    definition: {
        displayName: "Order Information",
        allowedContexts: [OrderConfirmationPageContext],
        group: "Order Confirmation",
    },
};

export default widgetModule;
