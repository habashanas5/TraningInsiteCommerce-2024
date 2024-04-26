import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderStatusPageContext } from "@insite/content-library/Pages/OrderStatusPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ReactNode, useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    location: getLocation(state),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & HasHistory;

export interface OrderStatusFormStyles {
    form?: InjectableCss;
    orderNumberTextField?: TextFieldPresentationProps;
    emailOrPostalCodeTextField?: TextFieldPresentationProps;
    submitButton?: ButtonPresentationProps;
}

export const orderStatusFormStyles: OrderStatusFormStyles = {
    form: {
        css: css`
            display: flex;

            @media print {
                display: none;
            }
        `,
    },
    orderNumberTextField: {
        cssOverrides: {
            formField: css`
                width: auto;
                margin-right: 30px;
            `,
        },
    },
    emailOrPostalCodeTextField: {
        cssOverrides: {
            formField: css`
                width: auto;
                margin-right: 30px;
            `,
        },
    },
    submitButton: {
        css: css`
            margin-top: 32px;
        `,
    },
};

const styles = orderStatusFormStyles;
const StyledForm = getStyledWrapper("form");

const OrderStatusForm = ({ location, history }: Props) => {
    const [orderNumber, setOrderNumber] = useState("");
    const [orderNumberError, setOrderNumberError] = useState<ReactNode>("");
    const [emailOrPostalCode, setEmailOrPostalCode] = useState("");
    const [emailOrPostalCodeError, setEmailOrPostalCodeError] = useState<ReactNode>("");

    const orderNumberChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrderNumber(event.target.value);
        setOrderNumberError(!event.target.value.trim() ? siteMessage("OrderStatusLookup_OrderNumberRequired") : "");
    };

    const emailOrPostalCodeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailOrPostalCode(event.target.value);
        setEmailOrPostalCodeError(
            !event.target.value.trim() ? siteMessage("OrderStatusLookup_EmailOrPostalCodeRequired") : "",
        );
    };

    const handleSubmit = (event: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
        event.preventDefault();

        const paramName = emailOrPostalCode.indexOf("@") >= 0 ? "stEmail" : "stPostalCode";
        history.push(`${location.pathname}?orderNumber=${orderNumber}&${paramName}=${emailOrPostalCode}`);
    };

    return (
        <>
            <StyledForm {...styles.form} onSubmit={handleSubmit}>
                <TextField
                    label={translate("Order Number")}
                    onChange={orderNumberChangeHandler}
                    error={orderNumberError}
                    required
                    {...styles.orderNumberTextField}
                    data-test-selector="orderStatusForm_orderNumber"
                />
                <TextField
                    label={translate("Email Address or Postal Code")}
                    onChange={emailOrPostalCodeChangeHandler}
                    error={emailOrPostalCodeError}
                    required
                    {...styles.emailOrPostalCodeTextField}
                    data-test-selector="orderStatusForm_emailOrPostalCode"
                />
                <Button
                    {...styles.submitButton}
                    type="submit"
                    disabled={!orderNumber || !emailOrPostalCode}
                    data-test-selector="orderStatusForm_submit"
                >
                    {translate("Submit")}
                </Button>
            </StyledForm>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withHistory(OrderStatusForm)),
    definition: {
        group: "Order Status",
        displayName: "Form",
        allowedContexts: [OrderStatusPageContext],
    },
};

export default widgetModule;
