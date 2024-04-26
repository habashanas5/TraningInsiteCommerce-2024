import Zone from "@insite/client-framework/Components/Zone";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import clearForm from "@insite/client-framework/Store/Components/ContactUsForm/Handlers/ClearForm";
import submitContactForm from "@insite/client-framework/Store/Components/ContactUsForm/Handlers/SubmitContactForm";
import validateReCaptcha from "@insite/client-framework/Store/Components/ReCaptcha/Handlers/ValidateReCaptcha";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ReCaptcha from "@insite/content-library/Components/ReCaptcha";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    emailRecipients = "emailRecipients",
    submitButtonText = "submitButtonText",
    successMessage = "successMessage",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.emailRecipients]: string;
        [fields.submitButtonText]: string;
        [fields.successMessage]: string;
    };
}

const mapDispatchToProps = {
    submitContactForm,
    clearForm,
    validateReCaptcha: makeHandlerChainAwaitable<{}, boolean>(validateReCaptcha),
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface ContactFormStyles {
    container?: GridContainerProps;
    formGridItem?: GridItemProps;
    submitButton?: ButtonPresentationProps;
    successModal?: ModalPresentationProps;
    modalContainer?: GridContainerProps;
    messageTextGridItem?: GridItemProps;
    messageText?: TypographyPresentationProps;
    buttonGridItem?: GridItemProps;
    continueButton?: ButtonPresentationProps;
}

export const contactFormStyles: ContactFormStyles = {
    formGridItem: { width: 12 },
    submitButton: {
        css: css`
            float: right;
            margin-top: 20px;
        `,
    },
    successModal: { sizeVariant: "small" },
    messageTextGridItem: { width: 12 },
    buttonGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
};

const styles = contactFormStyles;
const emailsRegexp = new RegExp(
    "^[\\W]*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4}[\\W]*,{1}[\\W]*)*([\\w+\\-.%]+@[\\w\\-.]+\\.[A-Za-z]{2,4})[\\W]*$",
);

type Validator = () => boolean;
type ContextType = {
    validators: {
        [key: string]: Validator | undefined;
    };
};

export const ContactFormContext = React.createContext<ContextType>({
    validators: {},
});

const ContactForm = ({ id, fields, submitContactForm, clearForm, validateReCaptcha }: Props) => {
    const { emailRecipients, submitButtonText, successMessage } = fields;
    const [validators] = useState<{ [key: string]: Validator | undefined }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const widgetValidators: Validator[] = [];
        Object.keys(validators).forEach(key => {
            const validator = validators[key];
            if (validator) {
                widgetValidators.push(validator);
            }
        });
        const results = widgetValidators.map(v => v());
        if (!results.every(o => o)) {
            return;
        }

        const isReCaptchaValid = await validateReCaptcha({});
        if (!isReCaptchaValid) {
            return;
        }

        setIsSubmitting(true);
        submitContactForm({
            emailRecipients,
            onSuccess: () => {
                setIsModalOpen(true);
                setIsSubmitting(false);
            },
            onComplete() {
                // "this" is targeting the object being created, not the parent SFC
                // eslint-disable-next-line react/no-this-in-sfc
                this.onSuccess?.();
            },
        });
    };

    const modalCloseHandler = () => setIsModalOpen(false);

    const continueButtonClickHandler = () => {
        setIsModalOpen(false);
        clearForm();
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.formGridItem}>
                <ContactFormContext.Provider value={{ validators }}>
                    <form id="contactForm" onSubmit={handleFormSubmit} noValidate>
                        <Zone contentId={id} zoneName="Content" />
                        <ReCaptcha location="ContactUs" />
                        <Button {...styles.submitButton} type="submit" disabled={isSubmitting}>
                            {submitButtonText}
                        </Button>
                        <Modal
                            headline={translate("Message Sent")}
                            contentLabel={successMessage}
                            {...styles.successModal}
                            isOpen={isModalOpen}
                            handleClose={modalCloseHandler}
                        >
                            <GridContainer {...styles.modalContainer}>
                                <GridItem {...styles.messageTextGridItem}>
                                    <Typography {...styles.messageText}>{successMessage}</Typography>
                                </GridItem>
                                <GridItem {...styles.buttonGridItem}>
                                    <Button {...styles.continueButton} onClick={continueButtonClickHandler}>
                                        {translate("Continue")}
                                    </Button>
                                </GridItem>
                            </GridContainer>
                        </Modal>
                    </form>
                </ContactFormContext.Provider>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(ContactForm),
    definition: {
        group: "Contact Us",
        icon: "FormField",
        fieldDefinitions: [
            {
                name: fields.emailRecipients,
                displayName: "Email recipients",
                editorTemplate: "MultilineTextField",
                fieldType: "General",
                defaultValue: "testaccount@insitesoft.com",
                isRequired: true,
                regularExpression: emailsRegexp,
            },
            {
                name: fields.submitButtonText,
                displayName: "Submit Button Text",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Send",
            },
            {
                name: fields.successMessage,
                displayName: "Submit Success Message",
                editorTemplate: "RichTextField",
                fieldType: "Translatable",
                defaultValue: "Thank you for your inquiry. A customer service representative will contact you shortly.",
            },
        ],
    },
};

export default widgetModule;
