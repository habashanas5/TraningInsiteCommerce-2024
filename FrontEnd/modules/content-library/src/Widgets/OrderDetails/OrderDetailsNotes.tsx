import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { css } from "styled-components";

export interface OrderDetailsNotesStyles {
    titleText?: TypographyProps;
    notesText?: TypographyProps;
    wrapper?: InjectableCss;
}

export const notesStyles: OrderDetailsNotesStyles = {
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

const styles = notesStyles;

const OrderDetailsNotes: React.FunctionComponent = () => {
    const { value: order } = useContext(OrderStateContext);

    if (!order || !order.notes) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>{translate("Order Notes")}</Typography>
            <Typography {...styles.notesText}>{order.notes}</Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsNotes,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
