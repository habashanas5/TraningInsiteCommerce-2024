import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { OrderStatusPageContext } from "@insite/content-library/Pages/OrderStatusPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    order: state.pages.orderStatus.order,
    showPoNumber: getSettingsCollection(state).orderSettings.showPoNumber,
    enableVat: getSettingsCollection(state).productSettings.enableVat,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface OrderStatusInformationStyles {
    informationWrapper?: InjectableCss;
    wrapper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    orderNumberText?: TypographyPresentationProps;
    statusText?: TypographyPresentationProps;
    orderDateText?: TypographyPresentationProps;
    termsText?: TypographyPresentationProps;
    poNumberText?: TypographyPresentationProps;
    shippingMethodText?: TypographyPresentationProps;
    vatNumberWrapper?: InjectableCss;
    vatNumberText?: TypographyPresentationProps;
}

export const orderStatusInformationStyles: OrderStatusInformationStyles = {
    informationWrapper: {
        css: css`
            display: flex;
            flex-direction: row;
        `,
    },
    wrapper: {
        css: css`
            margin-right: 25px;
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
    vatNumberWrapper: {
        css: css`
            margin-top: 10px;
        `,
    },
};

const styles = orderStatusInformationStyles;

const OrderStatusInformation = ({ order, showPoNumber, enableVat }: Props) => {
    if (!order) {
        return null;
    }

    return (
        <>
            <StyledWrapper {...styles.informationWrapper} data-test-selector="orderStatusInformation">
                <StyledWrapper {...styles.wrapper}>
                    <Typography as="h2" {...styles.titleText} id="orderStatusOrderNumber">
                        {translate("Order Number")}
                    </Typography>
                    <Typography {...styles.orderNumberText} aria-labelledby="orderStatusOrderNumber">
                        {order.webOrderNumber || order.erpOrderNumber}
                    </Typography>
                </StyledWrapper>
                <StyledWrapper {...styles.wrapper}>
                    <Typography as="h2" {...styles.titleText} id="orderStatusStatus">
                        {translate("Status")}
                    </Typography>
                    <Typography {...styles.statusText} aria-labelledby="orderStatusStatus">
                        {order.status}
                    </Typography>
                </StyledWrapper>
                <StyledWrapper {...styles.wrapper}>
                    <Typography as="h2" {...styles.titleText} id="orderStatusOrderDate">
                        {translate("Order Date")}
                    </Typography>
                    <Typography {...styles.orderDateText} aria-labelledby="orderStatusOrderDate">
                        <LocalizedDateTime
                            dateTime={order.orderDate}
                            options={{ year: "numeric", month: "numeric", day: "numeric" }}
                        />
                    </Typography>
                </StyledWrapper>
                <StyledWrapper {...styles.wrapper}>
                    <Typography as="h2" {...styles.titleText} id="orderStatusTerms">
                        {translate("Terms")}
                    </Typography>
                    <Typography {...styles.termsText} aria-labelledby="orderStatusTerms">
                        {order.terms}
                    </Typography>
                </StyledWrapper>
                {showPoNumber && (
                    <StyledWrapper {...styles.wrapper}>
                        <Typography as="h2" {...styles.titleText} id="orderStatusPO">
                            {translate("PO")}
                        </Typography>
                        <Typography {...styles.poNumberText} aria-labelledby="orderStatusPO">
                            {order.customerPO}
                        </Typography>
                    </StyledWrapper>
                )}
                <StyledWrapper {...styles.wrapper}>
                    <Typography as="h2" {...styles.titleText} id="orderStatusShippingMethod">
                        {translate("Shipping Method")}
                    </Typography>
                    <Typography {...styles.shippingMethodText} aria-labelledby="orderStatusShippingMethod">
                        {order.shipViaDescription || order.shipCode}
                    </Typography>
                </StyledWrapper>
            </StyledWrapper>
            {enableVat && order.customerVatNumber && (
                <StyledWrapper {...styles.vatNumberWrapper}>
                    <Typography as="h2" {...styles.titleText} id="orderStatusVatNumber">
                        {translate("VAT Number")}
                    </Typography>
                    <Typography {...styles.vatNumberText} aria-labelledby="orderStatusVatNumber">
                        {order.customerVatNumber}
                    </Typography>
                </StyledWrapper>
            )}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderStatusInformation),
    definition: {
        group: "Order Status",
        displayName: "Information",
        allowedContexts: [OrderStatusPageContext],
    },
};

export default widgetModule;
