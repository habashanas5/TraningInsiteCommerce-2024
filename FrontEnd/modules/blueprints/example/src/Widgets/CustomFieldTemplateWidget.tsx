/* This illustrates how to create a widget that will make use of custom editor templates.
 * editor templates allow you to control how a field will be edited in the shell.
 */

import { CustomFieldDefinition } from "@example/CustomFieldDefinition";
import translate from "@insite/client-framework/Translate";
import { WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography from "@insite/mobius/Typography";
import React from "react";

const enum fields {
    textField = "textField",
    customTemplateField = "customTemplateField",
}

interface Props extends WidgetProps {
    fields: {
        [fields.textField]: string;
        [fields.customTemplateField]: string;
    };
}

const CustomFieldTemplateWidget: React.FC<Props> = props => {
    return (
        <Typography variant="h4" as="p">
            <div>{props.fields.textField}</div>
            <div>{props.fields.customTemplateField}</div>
            <div>{translate("example foobar")}</div>
        </Typography>
    );
};

// we need to pass our CustomFieldDefinition so that we can use the CustomTemplate template below
export const definition: WidgetDefinition<CustomFieldDefinition> = {
    group: "Testing Extensions" as any, // Extend the standard groups with `as any`.
    fieldDefinitions: [
        {
            name: fields.textField,
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
        },
        {
            name: fields.customTemplateField,
            editorTemplate: "CustomTemplate",
            defaultValue: "",
            fieldType: "General",
            // this property is required because the template is CustomTemplate
            extraLabel: "Extra Label!",
            tooltip: "Example Tooltip",
        },
    ],
};

// because we have a CustomFieldDefinition, we need to include that type here
const widgetModule: WidgetModule<CustomFieldDefinition> = {
    component: CustomFieldTemplateWidget,
    definition,
};

export default widgetModule;
