import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { css } from "styled-components";

export interface OrderDetailsRequestedDateStyles {
    titleText?: TypographyProps;
    description?: TypographyProps;
    wrapper?: InjectableCss;
}

export const requestedDateStyles: OrderDetailsRequestedDateStyles = {
    titleText: {
        variant: "h6",
        as: "h3",
        css: css`
            @media print {
                font-size: 12px;
            }
            margin-bottom: 5px;
        `,
    },
};

const styles = requestedDateStyles;

const OrderDetailsRequestedDate: React.FunctionComponent = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    if (!order.requestedDeliveryDateDisplay) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>{translate("Date Requested")}</Typography>
            <Typography {...styles.description} data-test-selector="orderDetails_requestedDeliveryDate">
                <LocalizedDateTime
                    dateTime={new Date(order.requestedDeliveryDateDisplay)}
                    options={{ year: "numeric", month: "numeric", day: "numeric" }}
                />
            </Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsRequestedDate,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
