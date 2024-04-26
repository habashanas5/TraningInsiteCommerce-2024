import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useContext } from "react";
import { css } from "styled-components";

export interface OrderDetailsShippingAddressStyles {
    titleText?: TypographyProps;
    addressDisplay?: AddressInfoDisplayStyles;
    wrapper?: InjectableCss;
}

export const shippingAddressStyles: OrderDetailsShippingAddressStyles = {
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
            padding-top: 10px;
        `,
    },
};

const styles = shippingAddressStyles;

const OrderDetailsShippingAddress: React.FunctionComponent = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    const hasShippingAddress = order.fulfillmentMethod === FulfillmentMethod.Ship || !order.fulfillmentMethod;

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>
                {translate(hasShippingAddress ? "Shipping Address" : "Pick Up Location")}
            </Typography>
            <AddressInfoDisplay
                companyName={order.stCompanyName}
                address1={order.stAddress1}
                address2={order.stAddress2}
                address3={order.stAddress3}
                address4={order.stAddress4}
                city={order.shipToCity}
                state={order.shipToState}
                postalCode={order.shipToPostalCode}
                country={order.stCountry}
                extendedStyles={styles.addressDisplay}
            />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsShippingAddress,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
