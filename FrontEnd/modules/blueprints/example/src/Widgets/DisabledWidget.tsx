import { WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import * as React from "react";

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

const DisabledWidget: React.FC<Props> = ({
    fields: {
        checkboxFieldValue,
        textFieldValue,
        integerFieldValue,
        multilineTextFieldValue,
        radioButtonsFieldValue,
        dropDownFieldValue,
    },
}) => (
    <>
        <div>
            Checkbox value:
            {checkboxFieldValue.toString()}
            {checkboxFieldValue && <span>Is True</span>}
            {!checkboxFieldValue && <span>Is False</span>}
        </div>
        <div>Text value: {textFieldValue}</div>
        <div>Integer value: {integerFieldValue}</div>
        <div style={{ whiteSpace: "pre" }}>MultilineText value: {multilineTextFieldValue}</div>
        <div>RadioButtons value: {radioButtonsFieldValue}</div>
        <div>DropDown value: {dropDownFieldValue}</div>
    </>
);

const definition: WidgetDefinition = {
    group: "Testing",
    fieldDefinitions: [
        {
            name: fields.checkboxFieldValue,
            displayName: "Checkbox",
            editorTemplate: "CheckboxField",
            defaultValue: false,
            fieldType: "General",
            isEnabled: item => false,
        },
        {
            name: fields.textFieldValue,
            displayName: "Text",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
            isEnabled: item => false,
        },
        {
            name: fields.integerFieldValue,
            displayName: "Integer",
            editorTemplate: "IntegerField",
            defaultValue: null,
            fieldType: "General",
            sortOrder: 0,
            isEnabled: item => false,
        },
        {
            name: fields.multilineTextFieldValue,
            displayName: "MultilineText",
            editorTemplate: "MultilineTextField",
            defaultValue: "",
            fieldType: "General",
            isEnabled: item => false,
        },
        {
            name: fields.radioButtonsFieldValue,
            displayName: "RadioButtons",
            editorTemplate: "RadioButtonsField",
            isEnabled: item => false,
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
            defaultValue: "",
            fieldType: "General",
            isEnabled: item => false,
        },
    ],
};

const widgetModule: WidgetModule = {
    component: DisabledWidget,
    definition,
};

export default widgetModule;
