import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import { OrderStatusPageContext } from "@insite/content-library/Pages/OrderStatusPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    order: state.pages.orderStatus.order,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface OrderStatusAddressDetailsStyles {
    wrapper?: InjectableCss;
    shippingAddressWrapper?: InjectableCss;
    billingAddressWrapper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    addressDisplay?: AddressInfoDisplayStyles;
}

export const orderStatusAddressDetailsStyles: OrderStatusAddressDetailsStyles = {
    wrapper: {
        css: css`
            display: flex;
        `,
    },
    shippingAddressWrapper: {
        css: css`
            margin-right: 40px;
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

const styles = orderStatusAddressDetailsStyles;

const OrderStatusAddressDetails: FC<Props> = ({ order }) => {
    if (!order) {
        return null;
    }

    const hasShippingAddress = order.fulfillmentMethod === FulfillmentMethod.Ship || !order.fulfillmentMethod;

    return (
        <StyledWrapper {...styles.wrapper}>
            <StyledWrapper {...styles.shippingAddressWrapper}>
                <Typography as="h2" {...styles.titleText}>
                    {translate(hasShippingAddress ? "Shipping Address" : "Pick Up Location")}
                </Typography>
                <AddressInfoDisplay
                    companyName={order.stCompanyName}
                    address1={order.stAddress1}
                    address2={order.stAddress2}
                    city={order.shipToCity}
                    state={order.shipToState}
                    postalCode={order.shipToPostalCode}
                    country={order.stCountry}
                    extendedStyles={styles.addressDisplay}
                />
            </StyledWrapper>
            <StyledWrapper {...styles.billingAddressWrapper}>
                <Typography as="h2" {...styles.titleText}>
                    {translate("Billing Address")}
                </Typography>
                <AddressInfoDisplay
                    companyName={order.btCompanyName}
                    address1={order.btAddress1}
                    address2={order.btAddress2}
                    city={order.billToCity}
                    state={order.billToState}
                    postalCode={order.billToPostalCode}
                    country={order.btCountry}
                    extendedStyles={styles.addressDisplay}
                />
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderStatusAddressDetails),
    definition: {
        allowedContexts: [OrderStatusPageContext],
        displayName: "Address Details",
        group: "Order Status",
    },
};

export default widgetModule;
