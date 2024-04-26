import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setFieldValue from "@insite/client-framework/Store/Components/ContactUsForm/Handlers/SetFieldValue";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ContactFormContext } from "@insite/content-library/Widgets/ContactUs/ContactForm";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
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
    emailAddress: state.components.contactUsForm.fieldValues["emailAddress"],
});

const mapDispatchToProps = {
    setFieldValue,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface EmailAddressStyles {
    emailAddressTextField?: TextFieldPresentationProps;
}

export const emailAddressStyles: EmailAddressStyles = {};

const styles = emailAddressStyles;
const emailRegexp = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");

const EmailAddress: React.FC<Props> = ({ fields, emailAddress, setFieldValue }) => {
    const { label, hintText, isRequired } = fields;
    const contactFormContext = React.useContext(ContactFormContext);
    const [emailAddressErrorMessage, setEmailAddressErrorMessage] = React.useState("");

    React.useEffect(() => {
        contactFormContext.validators.emailAddress = validateEmailAddress;
    }, [emailAddress]);

    React.useEffect(() => {
        contactFormContext.validators.emailAddress = validateEmailAddress;
    }, [isRequired]);

    const validateEmailAddress = () => {
        const errorMessage =
            !emailAddress && isRequired
                ? siteMessage("ContactUsForm_EmailIsRequiredErrorMessage")
                : !emailAddress || emailRegexp.test(emailAddress)
                ? ""
                : siteMessage("ContactUsForm_EmailIsInvalidErrorMessage");
        setEmailAddressErrorMessage(errorMessage as string);
        return !errorMessage;
    };

    const emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue({ key: "emailAddress", value: event.target.value });
    };

    const emailBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        validateEmailAddress();
    };

    return (
        <TextField
            {...styles.emailAddressTextField}
            label={label}
            required={isRequired}
            placeholder={hintText}
            value={emailAddress || ""}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            error={emailAddressErrorMessage}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(EmailAddress),
    definition: {
        group: "Contact Us",
        icon: "FormField",
        fieldDefinitions: [
            {
                name: fields.label,
                displayName: "Label",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Email Address",
                isRequired: true,
            },
            {
                name: fields.hintText,
                displayName: "Hint Text",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Enter your email address",
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
