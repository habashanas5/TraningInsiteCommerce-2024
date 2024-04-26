import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CartReminderUnsubscribePageContext } from "@insite/content-library/Pages/CartReminderUnsubscribePage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const enum fields {
    unsubscribeMessage = "unsubscribeMessage",
    unsubscribeDescription = "unsubscribeDescription",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.unsubscribeMessage]: string;
        [fields.unsubscribeDescription]: string;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    websiteName: state.context.website.name,
    userEmail: state.pages.cartReminderUnsubscribe.userEmail,
    unsubscribeError: state.pages.cartReminderUnsubscribe.unsubscribeError,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface CartReminderUnsubscribeMessageStyles {
    wrapper?: InjectableCss;
    errorText?: TypographyPresentationProps;
    unsubscribeMessageText?: TypographyPresentationProps;
    unsubscribeDescriptionText?: TypographyPresentationProps;
}

export const cartReminderUnsubscribeMessageStyles: CartReminderUnsubscribeMessageStyles = {
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
        `,
    },
    unsubscribeMessageText: {
        css: css`
            margin-bottom: 15px;
        `,
    },
};

const styles = cartReminderUnsubscribeMessageStyles;

const CartReminderUnsubscribeMessage = ({ fields, websiteName, userEmail, unsubscribeError }: Props) => {
    return (
        <StyledWrapper {...styles.wrapper}>
            {unsubscribeError && <Typography {...styles.errorText}>{unsubscribeError}</Typography>}
            {!unsubscribeError && userEmail && (
                <>
                    <Typography {...styles.unsubscribeMessageText}>{fields.unsubscribeMessage}</Typography>
                    <Typography {...styles.unsubscribeDescriptionText}>
                        {fields.unsubscribeDescription.replace("{0}", websiteName).replace("{1}", userEmail)}
                    </Typography>
                </>
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(CartReminderUnsubscribeMessage),
    definition: {
        group: "Cart Reminder Unsubscribe",
        displayName: "Unsubscribe Message",
        allowedContexts: [CartReminderUnsubscribePageContext],
        fieldDefinitions: [
            {
                name: fields.unsubscribeMessage,
                editorTemplate: "TextField",
                defaultValue: "You have been unsubscribed.",
                fieldType: "Translatable",
            },
            {
                name: fields.unsubscribeDescription,
                editorTemplate: "TextField",
                defaultValue: "{0} cart reminder emails will no longer be sent to {1}.",
                fieldType: "Translatable",
            },
        ],
    },
};

export default widgetModule;
