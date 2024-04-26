import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setFieldValue from "@insite/client-framework/Store/Components/ContactUsForm/Handlers/SetFieldValue";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ContactFormContext } from "@insite/content-library/Widgets/ContactUs/ContactForm";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const enum fields {
    label = "label",
    hintText = "hintText",
    topics = "topics",
    isRequired = "isRequired",
}

interface TopicModel {
    fields: {
        topic: string;
    };
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.label]: string;
        [fields.hintText]: string;
        [fields.topics]: TopicModel[];
        [fields.isRequired]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    topic: state.components.contactUsForm.fieldValues["topic"],
});

const mapDispatchToProps = {
    setFieldValue,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AvailableTopicsStyles {
    topicsSelect?: SelectPresentationProps;
}

export const availableTopicsStyles: AvailableTopicsStyles = {};

export const styles = availableTopicsStyles;

const AvailableTopics: React.FC<Props> = ({ fields, topic, setFieldValue }) => {
    const { label, hintText, topics, isRequired } = fields;
    const contactFormContext = React.useContext(ContactFormContext);
    const [topicErrorMessage, setTopicErrorMessage] = React.useState("");

    React.useEffect(() => {
        contactFormContext.validators.topic = validateTopic;
        if (typeof topic !== "undefined") {
            validateTopic();
        }
    }, [topic]);

    React.useEffect(() => {
        contactFormContext.validators.topic = validateTopic;
    }, [isRequired]);

    const validateTopic = () => {
        const errorMessage = isRequired && !topic ? (siteMessage("Field_Required", label) as string) : "";
        setTopicErrorMessage(errorMessage);
        return !errorMessage;
    };

    const topicChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFieldValue({ key: "topic", value: event.target.value });
    };

    return (
        <Select
            {...styles.topicsSelect}
            label={label}
            required={isRequired}
            value={topic || ""}
            error={topicErrorMessage}
            onChange={topicChangeHandler}
        >
            <option value="">{hintText}</option>
            {topics.map(topic => (
                <option key={topic.fields.topic} value={topic.fields.topic}>
                    {topic.fields.topic}
                </option>
            ))}
        </Select>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AvailableTopics),
    definition: {
        group: "Contact Us",
        icon: "FormField",
        fieldDefinitions: [
            {
                name: fields.label,
                displayName: "Label",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Topics",
                isRequired: true,
            },
            {
                name: fields.hintText,
                displayName: "Hint Text",
                editorTemplate: "TextField",
                fieldType: "Translatable",
                defaultValue: "Select Topic",
                isRequired: true,
            },
            {
                name: fields.topics,
                displayName: "Topics",
                editorTemplate: "ListField",
                defaultValue: [],
                getDisplay: (item: HasFields) => {
                    return item.fields.topic;
                },
                fieldType: "Translatable",
                fieldDefinitions: [
                    {
                        name: "topic",
                        editorTemplate: "TextField",
                        defaultValue: "",
                    },
                ],
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
