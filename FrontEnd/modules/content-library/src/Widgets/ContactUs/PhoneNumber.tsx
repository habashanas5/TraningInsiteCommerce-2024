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
    phoneNumber: state.components.contactUsForm.fieldValues["phoneNumber"],
});

const mapDispatchToProps = {
    setFieldValue,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface PhoneNumberStyles {
    phoneNumberTextField?: TextFieldPresentationProps;
}

export const phoneNumberStyles: PhoneNumberStyles = {};

const styles = phoneNumberStyles;
const phoneRegex = /^([\(\)/\-\.\+\s]*\d\s?(ext)?[\(\)/\-\.\+\s]*){10,}$/;

const PhoneNumber: React.FC<Props> = ({ fields, phoneNumber, setFieldValue }) => {
    const { label, hintText, isRequired } = fields;
    const contactFormContext = React.useContext(ContactFormContext);
    const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = React.useState("");

    React.useEffect(() => {
        contactFormContext.validators.phoneNumber = validatePhoneNumber;
    }, [phoneNumber]);

    React.useEffect(() => {
        contactFormContext.validators.phoneNumber = validatePhoneNumber;
    }, [isRequired]);

    const validatePhoneNumber = () => {
        const errorMessage =
            !phoneNumber && isRequired
                ? siteMessage("ContactUsForm_PhoneNumberIsRequiredErrorMessage")
                : !phoneNumber || phoneRegex.test(phoneNumber)
                ? ""
                : siteMessage("ContactUsForm_PhoneNumberIsInvalidErrorMessage");
        setPhoneNumberErrorMessage(errorMessage as string);
        return !errorMessage;
    };

    const phoneNumberChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue({ key: "phoneNumber", value: event.target.value });
    };

    const phoneNumberBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        validatePhoneNumber();
    };

    return (
        <TextField
            {...styles.phoneNumberTextField}
            label={label}
            required={isRequired}
            placeholder={hintText}
            value={phoneNumber || ""}
            onChange={phoneNumberChangeHandler}
            onBlur={phoneNumberBlurHandler}
            error={phoneNumberErrorMessage}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(PhoneNumber),
    definition: {
        group: "Contact Us",
        icon: "FormField",
        fieldDefinitions: [
            {
                name: fields.label,
                displayName: "Label",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Phone Number",
                isRequired: true,
            },
            {
                name: fields.hintText,
                displayName: "Hint Text",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "(###) ###-####",
                isRequired: true,
            },
            {
                name: fields.isRequired,
                displayName: "Required Field",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
