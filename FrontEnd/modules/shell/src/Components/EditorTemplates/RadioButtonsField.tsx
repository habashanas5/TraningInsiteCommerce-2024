import logger from "@insite/client-framework/Logger";
import { RadioButtonOption, RadioButtonsDefinition } from "@insite/client-framework/Types/FieldDefinition";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import * as React from "react";

export default class RadioButtonsField extends React.Component<
    EditorTemplateProps<string | number, RadioButtonsDefinition<string> | RadioButtonsDefinition<number>>
> {
    constructor(
        props: EditorTemplateProps<string | number, RadioButtonsDefinition<string> | RadioButtonsDefinition<number>>,
    ) {
        super(props);

        if (this.getOptions().length === 0) {
            logger.error(
                `There were no options defined in the properties for the fieldDefinition ${props.fieldDefinition.name}`,
            );
        }
    }

    getOptions(): RadioButtonOption<string | number>[] {
        if (this.props.fieldDefinition && this.props.fieldDefinition.options) {
            return this.props.fieldDefinition.options;
        }

        return [];
    }

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.updateField(this.props.fieldDefinition.name, event.currentTarget.value);
    };

    render() {
        const options = this.getOptions();
        if (options.length === 0) {
            return null;
        }

        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                {options.map(option => (
                    <div key={option.value}>
                        <label className="radio">
                            <input
                                type="radio"
                                name={this.props.fieldDefinition.name}
                                value={option.value}
                                checked={this.props.fieldValue === option.value}
                                disabled={
                                    this.props.fieldDefinition.isEnabled &&
                                    !this.props.fieldDefinition.isEnabled(this.props.item)
                                }
                                onChange={this.onChange}
                            />
                            {option.displayName ?? option.value}
                        </label>
                        {option.tooltip && <div>{option.tooltip}</div>}
                    </div>
                ))}
            </StandardControl>
        );
    }
}
