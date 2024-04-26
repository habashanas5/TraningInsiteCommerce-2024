import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { useContext } from "react";
import * as React from "react";
import { css } from "styled-components";

export interface OrderDetailsPaymentTermsStyles {
    titleText?: TypographyPresentationProps;
    termsText?: TypographyPresentationProps;
    wrapper?: InjectableCss;
}

export const paymentTermsStyles: OrderDetailsPaymentTermsStyles = {
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
const styles = paymentTermsStyles;

const OrderDetailsPaymentTerms = () => {
    const { value: order } = useContext(OrderStateContext);

    if (!order || !order.terms) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography as="h3" {...styles.titleText}>
                {translate("Terms")}
            </Typography>
            <Typography {...styles.termsText}>{order.terms}</Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsPaymentTerms,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
