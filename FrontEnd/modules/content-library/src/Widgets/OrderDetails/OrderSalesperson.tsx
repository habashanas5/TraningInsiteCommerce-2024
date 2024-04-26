import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useContext } from "react";
import { css } from "styled-components";

export interface OrderSalespersonStyles {
    wrapper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    orderSalesperson?: TypographyPresentationProps;
}

export const orderSalespersonStyles: OrderSalespersonStyles = {
    wrapper: {
        css: css`
            padding-bottom: 10px;
        `,
    },
    titleText: {
        variant: "h6",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
};

const styles = orderSalespersonStyles;

const OrderSalesperson = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order || !order.salesperson) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography as="h2" {...styles.titleText} id="orderSalesperson">
                {translate("Salesperson")}
            </Typography>
            <Typography {...styles.orderSalesperson} aria-labelledby="orderSalesperson">
                {order.salesperson}
            </Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderSalesperson,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
