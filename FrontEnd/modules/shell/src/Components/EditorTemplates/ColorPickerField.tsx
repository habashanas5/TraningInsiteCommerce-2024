import { ColorPickerFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import { colorResultToString } from "@insite/shell/Store/ShellSelectors";
import React from "react";
import { ColorResult } from "react-color";

export default class ColorPickerField extends React.Component<EditorTemplateProps<string, ColorPickerFieldDefinition>> {
    onChange = (color: ColorResult) => {
        const value = colorResultToString(color);
        this.props.updateField(this.props.fieldDefinition.name, value ?? "");
    };

    render() {
        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition} labelId="banner-color-label">
                <ColorPicker
                    id="banner-color"
                    color={this.props.fieldValue}
                    onChange={this.onChange}
                    popoverProps={{
                        positionFunction: (element: React.RefObject<HTMLUListElement>) => {
                            return {
                                left: "35px",
                                top: element.current?.getBoundingClientRect()!.top + 24,
                                position: "fixed",
                            };
                        },
                    }}
                />
            </StandardControl>
        );
    }
}
