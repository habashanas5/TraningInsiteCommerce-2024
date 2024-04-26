import addPhoneLinkTargetAttr from "@insite/client-framework/Common/Utilities/addPhoneLinkTargetAttr";
import { extractStylesToArray, isSafe } from "@insite/client-framework/Common/Utilities/isSafeStyles";
import { RichTextFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import RichTextEditor from "@insite/shell/Components/Elements/RichTextEditor";
import * as React from "react";
import styled from "styled-components";

type Props = EditorTemplateProps<string, RichTextFieldDefinition>;

interface State {
    hasStyleError: boolean;
}

const ErrorMessage = styled.div`
    color: red;
`;

export default class RichTextField extends React.Component<Props, State> {
    state = {
        hasStyleError: false,
    };

    isSafeToSave = (html: string) => {
        const arrayOfStyles = extractStylesToArray(html);
        return arrayOfStyles?.every(style => isSafe(style));
    };

    onChange = (model: string) => {
        model = addPhoneLinkTargetAttr(model);
        let hasStyleError = false;
        if (this.isSafeToSave(model)) {
            this.props.updateField(this.props.fieldDefinition.name, model);
        } else {
            hasStyleError = true;
        }
        this.setState({
            hasStyleError,
        });
    };

    render() {
        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <RichTextEditor
                    value={this.props.fieldValue}
                    name={this.props.fieldDefinition.name}
                    placeholder={this.props.fieldDefinition.placeholder}
                    extendedConfig={this.props.fieldDefinition.extendedConfig}
                    expandedToolbarButtons={this.props.fieldDefinition.expandedToolbarButtons}
                    collapsedToolbarButtons={this.props.fieldDefinition.collapsedToolbarButtons}
                    onChange={this.onChange}
                />
                {this.state.hasStyleError && (
                    <ErrorMessage>The HTML contains invalid styles that prevent it from being saved</ErrorMessage>
                )}
            </StandardControl>
        );
    }
}
