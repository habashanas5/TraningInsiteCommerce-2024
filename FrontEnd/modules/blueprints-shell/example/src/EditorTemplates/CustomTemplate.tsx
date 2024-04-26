import { CustomEditorTemplateProps, CustomTemplateDefinition } from "@example/CustomFieldDefinition";
import MobiusTextField from "@insite/mobius/TextField";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import * as React from "react";
import styled from "styled-components";

export default class TextField extends React.Component<CustomEditorTemplateProps<string, CustomTemplateDefinition>> {
    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.updateField(this.props.fieldDefinition.name, event.currentTarget.value);
    };

    render() {
        // There is no clean way to get typing to work properly for StandardControl, so just bypass it with as any
        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition as any}>
                <CustomStyle>
                    <MobiusTextField
                        id={this.props.fieldDefinition.name}
                        type="text"
                        value={this.props.fieldValue}
                        onChange={this.onChange}
                        disabled={
                            this.props.fieldDefinition.isEnabled &&
                            !this.props.fieldDefinition.isEnabled(this.props.item)
                        }
                    />
                </CustomStyle>
                {this.props.fieldDefinition.extraLabel}
            </StandardControl>
        );
    }
}

const CustomStyle = styled.div`
    background-color: black;
    padding: 0 8px 8px;
`;
