import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { css } from "styled-components";

export interface OrderDetailsVatNumberStyles {
    titleText?: TypographyPresentationProps;
    vatNumberText?: TypographyPresentationProps;
    wrapper?: InjectableCss;
}

export const vatNumberStyles: OrderDetailsVatNumberStyles = {
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

const styles = vatNumberStyles;

const OrderDetailsVatNumber = () => {
    const { value: order } = useContext(OrderStateContext);

    if (!order || !order.customerVatNumber) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText} as="h2">
                {translate("VAT Number")}
            </Typography>
            <Typography {...styles.vatNumberText}>{order.customerVatNumber}</Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsVatNumber,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
