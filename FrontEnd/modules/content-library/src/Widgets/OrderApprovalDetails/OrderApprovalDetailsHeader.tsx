import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderApprovalDetailsPageContext } from "@insite/content-library/Pages/OrderApprovalDetailsPage";
import OrderApprovalDetailsActionButtons, {
    OrderApprovalDetailsActionButtonsStyles,
} from "@insite/content-library/Widgets/OrderApprovalDetails/OrderApprovalDetailsActionButtons";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { FC } from "react";
import { css } from "styled-components";

export interface OrderApprovalDetailsHeaderStyles {
    headerGridContainer?: GridContainerProps;
    title?: TypographyProps;
    orderNumberText?: TypographyProps;
    titleGridItem?: GridItemProps;
    buttonGridItem?: GridItemProps;
    orderApprovalDetailsActionButtonsStyles?: OrderApprovalDetailsActionButtonsStyles;
}

export const headerStyles: OrderApprovalDetailsHeaderStyles = {
    buttonGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: [2, 2, 2, 6, 6],
    },
    titleGridItem: {
        width: [10, 10, 10, 6, 6],
    },
    title: {
        variant: "h2",
        as: "p",
        css: css`
            @media print {
                font-size: 11px;
            }
        `,
    },
};

const styles = headerStyles;

type Props = WidgetProps & HasCartContext;

const OrderApprovalDetailsHeader = ({ cart }: Props) => {
    if (!cart) {
        return null;
    }

    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.title}>
                    <span aria-hidden>{translate("Order #")}&nbsp;</span>
                    <VisuallyHidden>{translate("Order Number")}</VisuallyHidden>
                    <Typography {...styles.orderNumberText} data-test-selector="tst_orderApprovalDetails_orderNumber">
                        {cart.orderNumber}
                    </Typography>
                </Typography>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <OrderApprovalDetailsActionButtons
                    cart={cart}
                    extendedStyles={styles.orderApprovalDetailsActionButtonsStyles}
                />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: withCart(OrderApprovalDetailsHeader),
    definition: {
        displayName: "Page Header",
        allowedContexts: [OrderApprovalDetailsPageContext],
        group: "Order Approval Details",
    },
};

export default widgetModule;
