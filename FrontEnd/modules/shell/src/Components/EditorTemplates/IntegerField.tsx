import { IntegerFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import TextField from "@insite/mobius/TextField";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import * as React from "react";

const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ".") {
        event.preventDefault();
    }
};

const onInput = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]*/g, "");
};

export default class IntegerField extends React.Component<EditorTemplateProps<number | null, IntegerFieldDefinition>> {
    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        let value: number | null = !event.currentTarget.value ? null : Number(event.currentTarget.value);

        if (value !== null) {
            if (this.props.fieldDefinition.max !== undefined && value > this.props.fieldDefinition.max) {
                value = this.props.fieldDefinition.max;
            }

            if (this.props.fieldDefinition.min !== undefined && value < this.props.fieldDefinition.min) {
                value = this.props.fieldDefinition.min;
            }
        }

        this.props.updateField(this.props.fieldDefinition.name, value);
    };

    render() {
        const value =
            this.props.fieldValue !== undefined && this.props.fieldValue !== null ? this.props.fieldValue : undefined;

        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <TextField
                    id={this.props.fieldDefinition.name}
                    className="input"
                    type="number"
                    onKeyDown={onKeyDown}
                    onInput={onInput}
                    min={this.props.fieldDefinition.min !== undefined ? this.props.fieldDefinition.min : undefined}
                    max={this.props.fieldDefinition.max !== undefined ? this.props.fieldDefinition.max : undefined}
                    step="1"
                    value={value}
                    placeholder={this.props.fieldDefinition.placeholder}
                    disabled={
                        this.props.fieldDefinition.isEnabled && !this.props.fieldDefinition.isEnabled(this.props.item)
                    }
                    onChange={this.onChange}
                />
            </StandardControl>
        );
    }
}
