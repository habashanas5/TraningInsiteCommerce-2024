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
    lastName: state.components.contactUsForm.fieldValues["lastName"],
});

const mapDispatchToProps = {
    setFieldValue,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface LastNameStyles {
    lastNameTextField?: TextFieldPresentationProps;
}

export const lastNameStyles: LastNameStyles = {};

const styles = lastNameStyles;

const LastName: React.FC<Props> = ({ fields, lastName, setFieldValue }) => {
    const { label, hintText, isRequired } = fields;
    const contactFormContext = React.useContext(ContactFormContext);
    const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState("");

    React.useEffect(() => {
        contactFormContext.validators.lastName = validateLastName;
        if (typeof lastName !== "undefined") {
            validateLastName();
        }
    }, [lastName]);

    React.useEffect(() => {
        contactFormContext.validators.lastName = validateLastName;
    }, [isRequired]);

    const validateLastName = () => {
        const errorMessage = isRequired && !lastName ? (siteMessage("Field_Required", label) as string) : "";
        setLastNameErrorMessage(errorMessage);
        return !errorMessage;
    };

    const lastNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue({ key: "lastName", value: event.target.value });
    };

    return (
        <TextField
            {...styles.lastNameTextField}
            label={label}
            required={isRequired}
            placeholder={hintText}
            value={lastName || ""}
            error={lastNameErrorMessage}
            onChange={lastNameChangeHandler}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(LastName),
    definition: {
        group: "Contact Us",
        icon: "FormField",
        fieldDefinitions: [
            {
                name: fields.label,
                displayName: "Label",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Last Name",
                isRequired: true,
            },
            {
                name: fields.hintText,
                displayName: "Hint Text",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Enter Last Name",
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
