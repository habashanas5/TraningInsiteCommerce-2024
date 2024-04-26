import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useContext } from "react";
import { css } from "styled-components";

export interface OrderDetailsStatusStyles {
    wrapper?: InjectableCss;
    titleText?: TypographyProps;
    status?: TypographyProps;
}

export const statusStyles: OrderDetailsStatusStyles = {
    wrapper: {
        css: css`
            padding-bottom: 10px;
        `,
    },
    titleText: {
        variant: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
            font-size: 16px;
        `,
    },
};

const styles = statusStyles;

const OrderDetailsStatus = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order || !order.statusDisplay) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText} id="orderDetailsStatus">
                {translate("Status")}
            </Typography>
            <Typography {...styles.status} aria-labelledby="orderDetailsStatus">
                {order.statusDisplay}
            </Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsStatus,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
