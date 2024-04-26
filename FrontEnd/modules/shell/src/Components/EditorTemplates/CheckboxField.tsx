import { CheckboxFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import * as React from "react";
import { css } from "styled-components";

export default class CheckboxField extends React.Component<EditorTemplateProps<boolean, CheckboxFieldDefinition>> {
    onChange: CheckboxProps["onChange"] = (event, value) => {
        this.props.updateField(this.props.fieldDefinition.name, value);
    };

    render() {
        const value =
            this.props.fieldValue !== undefined && this.props.fieldValue !== null
                ? this.props.fieldValue
                : this.props.fieldDefinition.defaultValue !== undefined &&
                  this.props.fieldDefinition.defaultValue !== null
                ? this.props.fieldDefinition.defaultValue
                : false;

        return (
            <div className="checkbox">
                <Checkbox
                    css={css`
                        margin-top: 25px;
                        margin-left: 0;
                    `}
                    checked={value}
                    disabled={this.props.fieldDefinition.isEnabled && !this.props.fieldDefinition.isEnabled()}
                    onChange={this.onChange}
                    variant={this.props.fieldDefinition.variant || "default"}
                    data-test-selector={`controlFor_${this.props.fieldDefinition.name}`}
                >
                    {this.props.fieldDefinition.displayName}
                </Checkbox>
                {this.props.fieldDefinition.tooltip && <div>{this.props.fieldDefinition.tooltip}</div>}
            </div>
        );
    }
}
