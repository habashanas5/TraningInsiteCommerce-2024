import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { OrderApprovalDetailsPageContext } from "@insite/content-library/Pages/OrderApprovalDetailsPage";
import OrderApprovalDetailsBillingInformation, {
    OrderApprovalDetailsBillingInformationStyles,
} from "@insite/content-library/Widgets/OrderApprovalDetails/OrderApprovalDetailsBillingInformation";
import OrderApprovalDetailsShippingInformation, {
    OrderApprovalDetailsShippingInformationStyles,
} from "@insite/content-library/Widgets/OrderApprovalDetails/OrderApprovalDetailsShippingInformation";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { FC } from "react";
import { css } from "styled-components";

export interface OrderApprovalDetailsOrderInformationStyles {
    orderInformationGridContainer?: GridContainerProps;
    mainInformationGridContainer?: GridContainerProps;
    mainInformationGridItem?: GridItemProps;
    orderNumberGridItem?: GridItemProps;
    orderNumberTitle?: TypographyProps;
    orderNumberText?: TypographyPresentationProps;
    orderDateGridItem?: GridItemProps;
    orderDateTitle?: TypographyProps;
    orderDateText?: TypographyPresentationProps;
    poNumberGridItem?: GridItemProps;
    poNumberTitle?: TypographyProps;
    poNumberText?: TypographyPresentationProps;
    statusGridItem?: GridItemProps;
    statusTitle?: TypographyProps;
    statusText?: TypographyPresentationProps;
    shippingInformationGridItem?: GridItemProps;
    orderApprovalDetailsShippingInformation?: OrderApprovalDetailsShippingInformationStyles;
    billingInformationGridItem?: GridItemProps;
    orderApprovalDetailsBillingInformation?: OrderApprovalDetailsBillingInformationStyles;
    notesGridItem?: GridItemProps;
    notesTitle: TypographyProps;
    notesDescription?: TypographyPresentationProps;
}

export const orderInformationStyles: OrderApprovalDetailsOrderInformationStyles = {
    orderInformationGridContainer: {
        gap: 15,
    },
    mainInformationGridItem: {
        width: 10,
    },
    orderNumberGridItem: {
        width: 3,
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
    poNumberGridItem: {
        width: 3,
        css: css`
            flex-direction: column;
        `,
    },
    statusGridItem: {
        width: 3,
        css: css`
            flex-direction: column;
        `,
    },
    orderNumberTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    orderDateTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    poNumberTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    statusTitle: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
    shippingInformationGridItem: {
        width: 12,
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
        as: "h3",
        css: css`
            margin-bottom: 5px;
        `,
    },
};

const styles = orderInformationStyles;
type Props = WidgetProps & HasCartContext;

const OrderApprovalDetailsOrderInformation = ({ cart }: Props) => {
    if (!cart || !cart.shipTo || !cart.billTo) {
        return null;
    }

    return (
        <GridContainer data-test-selector="orderApprovalDetails_information" {...styles.orderInformationGridContainer}>
            <GridItem {...styles.mainInformationGridItem}>
                <GridContainer {...styles.mainInformationGridContainer}>
                    <GridItem {...styles.orderNumberGridItem}>
                        <Typography {...styles.orderNumberTitle}>
                            <span aria-hidden>{translate("Order #")}</span>
                            <VisuallyHidden>{translate("Order Number")}</VisuallyHidden>
                        </Typography>
                        <Typography {...styles.orderNumberText}>{cart.orderNumber}</Typography>
                    </GridItem>
                    <GridItem {...styles.orderDateGridItem}>
                        <Typography {...styles.orderDateTitle}>{translate("Order Date")}</Typography>
                        <Typography {...styles.orderDateText}>
                            <LocalizedDateTime dateTime={cart.orderDate} />
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.poNumberGridItem}>
                        <Typography {...styles.poNumberTitle}>
                            <span aria-hidden>{translate("PO #")}</span>
                            <VisuallyHidden>{translate("Purchase Order Number")}</VisuallyHidden>
                        </Typography>
                        <Typography {...styles.poNumberText}>{cart.poNumber}</Typography>
                    </GridItem>
                    <GridItem {...styles.statusGridItem}>
                        <Typography {...styles.statusTitle}>{translate("Status")}</Typography>
                        <Typography {...styles.statusText}>{cart.status}</Typography>
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...styles.shippingInformationGridItem}>
                <OrderApprovalDetailsShippingInformation
                    cart={cart}
                    shipTo={cart.shipTo}
                    extendedStyles={styles.orderApprovalDetailsShippingInformation}
                />
            </GridItem>
            <GridItem {...styles.billingInformationGridItem}>
                <OrderApprovalDetailsBillingInformation
                    cart={cart}
                    billTo={cart.billTo}
                    extendedStyles={styles.orderApprovalDetailsBillingInformation}
                />
            </GridItem>
            {cart.notes && (
                <GridItem {...styles.notesGridItem}>
                    <Typography {...styles.notesTitle}>{translate("Order Notes")}</Typography>
                    <Typography {...styles.notesDescription}>{cart.notes}</Typography>
                </GridItem>
            )}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: withCart(OrderApprovalDetailsOrderInformation),
    definition: {
        displayName: "Order Approval Information",
        allowedContexts: [OrderApprovalDetailsPageContext],
        group: "Order Approval Details",
    },
};

export default widgetModule;
