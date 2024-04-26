import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { css } from "styled-components";

export interface OrderDetailsShippingMethodStyles {
    titleText?: TypographyProps;
    description?: TypographyProps;
    wrapper?: InjectableCss;
}

export const shippingMethodStyles: OrderDetailsShippingMethodStyles = {
    titleText: {
        variant: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
            font-size: 16px;
            padding-top: 10px;
        `,
    },
};

const styles = shippingMethodStyles;

const OrderDetailsShippingMethod: React.FunctionComponent = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    const hasShippingMethod =
        (order.fulfillmentMethod === FulfillmentMethod.Ship || !order.fulfillmentMethod) && order.shipCode;

    if (!hasShippingMethod) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>{translate("Shipping Method")}</Typography>
            <Typography {...styles.description}>{order.shipViaDescription || order.shipCode}</Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsShippingMethod,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
