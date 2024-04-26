import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setFieldValue from "@insite/client-framework/Store/Components/ContactUsForm/Handlers/SetFieldValue";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ContactFormContext } from "@insite/content-library/Widgets/ContactUs/ContactForm";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const enum fields {
    label = "label",
    hintText = "hintText",
    isRequired = "isRequired",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.label]: string;
        [fields.hintText]: string;
        [fields.isRequired]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    message: state.components.contactUsForm.fieldValues["message"],
});

const mapDispatchToProps = {
    setFieldValue,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MessageStyles {
    messageTextArea?: TextAreaProps;
}

export const messageStyles: MessageStyles = {};

const styles = messageStyles;

const Message: React.FC<Props> = ({ fields, message, setFieldValue }) => {
    const { label, hintText, isRequired } = fields;
    const contactFormContext = React.useContext(ContactFormContext);
    const [messageErrorMessage, setMessageErrorMessage] = React.useState("");

    React.useEffect(() => {
        contactFormContext.validators.message = validateMessage;
        if (typeof message !== "undefined") {
            validateMessage();
        }
    }, [message]);

    React.useEffect(() => {
        contactFormContext.validators.message = validateMessage;
    }, [isRequired]);

    const validateMessage = () => {
        const errorMessage = isRequired && !message ? (siteMessage("Field_Required", label) as string) : "";
        setMessageErrorMessage(errorMessage);
        return !errorMessage;
    };

    const messageChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFieldValue({ key: "message", value: event.target.value });
    };

    return (
        <TextArea
            {...styles.messageTextArea}
            label={label}
            required={isRequired}
            placeholder={hintText}
            value={message || ""}
            error={messageErrorMessage}
            onChange={messageChangeHandler}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(Message),
    definition: {
        group: "Contact Us",
        icon: "FormField",
        fieldDefinitions: [
            {
                name: fields.label,
                displayName: "Label",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Message",
                isRequired: true,
            },
            {
                name: fields.hintText,
                displayName: "Hint Text",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "How can I help you?",
                isRequired: true,
            },
            {
                name: fields.isRequired,
                displayName: "Required Field",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
