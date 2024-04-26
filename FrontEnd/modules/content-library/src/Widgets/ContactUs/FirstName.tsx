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
    firstName: state.components.contactUsForm.fieldValues["firstName"],
});

const mapDispatchToProps = {
    setFieldValue,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface FirstNameStyles {
    firstNameTextField?: TextFieldPresentationProps;
}

export const firstNameStyles: FirstNameStyles = {};

const styles = firstNameStyles;

const FirstName: React.FC<Props> = ({ fields, firstName, setFieldValue }) => {
    const { label, hintText, isRequired } = fields;
    const contactFormContext = React.useContext(ContactFormContext);
    const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState("");

    React.useEffect(() => {
        contactFormContext.validators.firstName = validateFirstName;
        if (typeof firstName !== "undefined") {
            validateFirstName();
        }
    }, [firstName]);

    React.useEffect(() => {
        contactFormContext.validators.firstName = validateFirstName;
    }, [isRequired]);

    const validateFirstName = () => {
        const errorMessage = isRequired && !firstName ? (siteMessage("Field_Required", label) as string) : "";
        setFirstNameErrorMessage(errorMessage);
        return !errorMessage;
    };

    const firstNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue({ key: "firstName", value: event.target.value });
    };

    return (
        <TextField
            {...styles.firstNameTextField}
            label={label}
            required={isRequired}
            placeholder={hintText}
            value={firstName || ""}
            error={firstNameErrorMessage}
            onChange={firstNameChangeHandler}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(FirstName),
    definition: {
        group: "Contact Us",
        icon: "FormField",
        fieldDefinitions: [
            {
                name: fields.label,
                displayName: "Label",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "First Name",
                isRequired: true,
            },
            {
                name: fields.hintText,
                displayName: "Hint Text",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Enter First Name",
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
