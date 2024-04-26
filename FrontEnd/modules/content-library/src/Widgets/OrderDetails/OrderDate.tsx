import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useContext } from "react";
import { css } from "styled-components";

export interface OrderDateStyles {
    wrapper?: InjectableCss;
    titleText?: TypographyProps;
    orderDate?: TypographyProps;
}

export const orderDateStyles: OrderDateStyles = {
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

const styles = orderDateStyles;

const OrderDate: FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order || !order.orderDate) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText} id="orderDate">
                {translate("Order Date")}
            </Typography>
            <Typography {...styles.orderDate} aria-labelledby="orderDate">
                <LocalizedDateTime
                    dateTime={order.orderDate}
                    options={{ year: "numeric", month: "numeric", day: "numeric" }}
                />
            </Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDate,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
