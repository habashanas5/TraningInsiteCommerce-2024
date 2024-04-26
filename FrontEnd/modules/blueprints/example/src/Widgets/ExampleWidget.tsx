/*
 * This illustrates how to create a widget that makes use of a number of different field definition types.
 */

import { WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import * as React from "react";

// this is used to help ensure that the names match between props.fields and definition.fieldDefinitions[].name
const enum fields {
    checkboxFieldValue = "checkboxFieldValue",
    textFieldValue = "textFieldValue",
    integerFieldValue = "integerFieldValue",
    multilineTextFieldValue = "multilineTextFieldValue",
    radioButtonsFieldValue = "radioButtonsFieldValue",
    dropDownFieldValue = "dropDownFieldValue",
}

interface Props extends WidgetProps {
    fields: {
        [fields.checkboxFieldValue]: boolean;
        [fields.textFieldValue]: string;
        [fields.integerFieldValue]: number;
        [fields.multilineTextFieldValue]: string;
        [fields.radioButtonsFieldValue]: string;
        [fields.dropDownFieldValue]: string;
    };
}

const ExampleWidget: React.FC<Props> = props => {
    return (
        <div>
            <div>
                Checkbox value:
                {props.fields.checkboxFieldValue.toString()}
                {props.fields.checkboxFieldValue && <span>Is True</span>}
                {!props.fields.checkboxFieldValue && <span>Is False</span>}
            </div>
            <div>Text value: {props.fields.textFieldValue}</div>
            <div>Integer value: {props.fields.integerFieldValue}</div>
            <div style={{ whiteSpace: "pre" }}>MultilineText value: {props.fields.multilineTextFieldValue}</div>
            <div>RadioButtons value: {props.fields.radioButtonsFieldValue}</div>
            <div>DropDown value: {props.fields.dropDownFieldValue}</div>
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
            defaultValue: false,
            fieldType: "General",
            tooltip: "checkbox tip",
        },
        {
            name: fields.textFieldValue,
            displayName: "Text",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
            tooltip: "text tip",
            placeholder: "text placeholder",
            isRequired: true,
        },
        {
            name: fields.integerFieldValue,
            displayName: "Integer",
            editorTemplate: "IntegerField",
            defaultValue: 0,
            fieldType: "General",
            tooltip: "integer tip",
            placeholder: "integer placeholder",
            isRequired: true,
            sortOrder: 0,
        },
        {
            name: fields.multilineTextFieldValue,
            displayName: "MultilineText",
            editorTemplate: "MultilineTextField",
            defaultValue: "",
            fieldType: "General",
            tooltip: "multi line tip",
            placeholder: "multi line placeholder",
            isRequired: true,
        },
        {
            name: fields.radioButtonsFieldValue,
            displayName: "RadioButtons",
            editorTemplate: "RadioButtonsField",
            options: [
                {
                    displayName: "Yes",
                    value: "yes",
                    tooltip: "this means yes",
                },
                {
                    displayName: "No",
                    value: "no",
                    tooltip: "this means no",
                },
            ],
            tooltip: "radio buttons tip",
            isRequired: true,
            defaultValue: "",
            fieldType: "General",
        },
        {
            name: fields.dropDownFieldValue,
            displayName: "DropDown",
            editorTemplate: "DropDownField",
            options: [
                {
                    displayName: "Option1",
                    value: "option1",
                },
                {
                    displayName: "Option2",
                    value: "option2",
                },
            ],
            tooltip: "drop down tip",
            isRequired: true,
            defaultValue: "",
            fieldType: "General",
        },
    ],
};

const widgetModule: WidgetModule = {
    component: ExampleWidget,
    definition,
};

export default widgetModule;
