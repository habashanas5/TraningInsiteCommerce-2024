import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useContext } from "react";
import { css } from "styled-components";

export interface OrderPoStyles {
    wrapper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    orderPo?: TypographyPresentationProps;
}

export const orderPoStyles: OrderPoStyles = {
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

const styles = orderPoStyles;

const OrderPo = () => {
    const { value: order } = useContext(OrderStateContext);

    if (!order || !order.customerPO) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography as="h2" {...styles.titleText} id="orderPo">
                {translate("PO Number")}
            </Typography>
            <Typography {...styles.orderPo} aria-labelledby="orderPo">
                {order.customerPO}
            </Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderPo,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
