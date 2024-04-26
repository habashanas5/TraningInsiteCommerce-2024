import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { css } from "styled-components";

export interface OrderDetailsBillingAddressStyles {
    titleText?: TypographyProps;
    addressDisplay?: AddressInfoDisplayStyles;
    wrapper?: InjectableCss;
}

export const billingAddressStyles: OrderDetailsBillingAddressStyles = {
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

const styles = billingAddressStyles;

const OrderDetailsBillingAddress: React.FunctionComponent = () => {
    const { value: order } = useContext(OrderStateContext);

    if (!order) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>{translate("Billing Address")}</Typography>
            <AddressInfoDisplay
                companyName={order.btCompanyName}
                address1={order.btAddress1}
                address2={order.btAddress2}
                address3={order.btAddress3}
                address4={order.btAddress4}
                city={order.billToCity}
                state={order.billToState}
                postalCode={order.billToPostalCode}
                country={order.btCountry}
                extendedStyles={styles.addressDisplay}
            />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsBillingAddress,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
