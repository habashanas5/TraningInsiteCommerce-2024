/*
 * This illustrates how to use custom validation.
 */

import { WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import * as React from "react";

// this is used to help ensure that the names match between props.fields and definition.fieldDefinitions[].name
const enum fields {
    checkboxFieldValue = "checkboxFieldValue",
    textFieldValue = "textFieldValue",
}

interface Props extends WidgetProps {
    fields: {
        [fields.checkboxFieldValue]: boolean;
        [fields.textFieldValue]: string;
    };
}

const ValidationExampleWidget: React.FC<Props> = props => {
    return (
        <div>
            <div>
                TextField has limit to 10 symbols and it is required. Try to make it invalid (add one symbol and remove
                it) and then uncheck Checkbox, you will see that validation was triggered for dependent fields.
            </div>
            <div>Checkbox value: {props.fields.checkboxFieldValue.toString()}</div>
            <div>Text value: {props.fields.textFieldValue}</div>
        </div>
    );
};

const definition: WidgetDefinition = {
    group: "Testing",
    fieldDefinitions: [
        {
            name: fields.checkboxFieldValue,
            displayName: "Checkbox",
            editorTemplate: "CheckboxField",
            defaultValue: true,
            fieldType: "General",
            dependentFields: [fields.textFieldValue],
        },
        {
            name: fields.textFieldValue,
            displayName: "Text",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
            isRequired: true,
            isVisible: item => item.fields.checkboxFieldValue,
            maxLength: 10,
        },
    ],
};

const widgetModule: WidgetModule = {
    component: ValidationExampleWidget,
    definition,
};

export default widgetModule;
