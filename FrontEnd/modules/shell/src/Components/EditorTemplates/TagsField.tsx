import { TextFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import X from "@insite/shell/Components/Icons/X";
import shellTheme, { ShellThemeProps } from "@insite/shell/ShellTheme";
import * as React from "react";
import styled, { css } from "styled-components";

interface State {
    value: string;
    isFocused: boolean;
}

export default class TagsField extends React.Component<EditorTemplateProps<string[], TextFieldDefinition>, State> {
    constructor(props: EditorTemplateProps<string[], TextFieldDefinition>) {
        super(props);

        this.state = {
            value: "",
            isFocused: false,
        };
    }

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            value: event.currentTarget.value.replace(/[^a-zA-Z0-9\-\_]/g, ""),
        });
    };

    onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            let currentArray = this.props.fieldValue;
            if (!currentArray) {
                currentArray = [];
            }
            const nextValue = event.currentTarget.value.trim();
            if (currentArray.indexOf(nextValue) === -1) {
                currentArray = [...currentArray, event.currentTarget.value.trim()];

                this.props.updateField(this.props.fieldDefinition.name, currentArray);
            }

            this.setState({
                value: "",
            });
        }
    };

    removeTag = (tag: string) => {
        const currentArray = [...this.props.fieldValue];
        currentArray.splice(currentArray.indexOf(tag), 1);
        this.props.updateField(this.props.fieldDefinition.name, currentArray);
    };

    onFocus = () => {
        this.setState({ isFocused: true });
    };

    onBlur = () => {
        this.setState({ isFocused: false });
    };

    render() {
        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <FakeTextFieldStyle isFocused={this.state.isFocused}>
                    {this.props.fieldValue &&
                        this.props.fieldValue.map(tag => (
                            <span key={tag} onClick={() => this.removeTag(tag)}>
                                {tag}
                                <X color1={shellTheme.colors.text.main} size={10} />
                            </span>
                        ))}
                    <input
                        id={this.props.fieldDefinition.name}
                        type="text"
                        value={this.state.value}
                        placeholder={this.props.fieldDefinition.placeholder}
                        onChange={this.onChange}
                        onKeyPress={this.onKeyPress}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        pattern="[0-9a-zA-Z_\-]"
                        maxLength={20}
                    />
                </FakeTextFieldStyle>
            </StandardControl>
        );
    }
}

const FakeTextFieldStyle = styled.div<{ isFocused: boolean }>`
    ${({ theme }) => theme.formField?.defaultProps?.cssOverrides?.inputSelect}
    background: ${({ theme }) => resolveColor(theme.formField?.defaultProps?.backgroundColor, theme)};
    padding: 8px 8px 2px;
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    ${props =>
        props.isFocused
            ? css`
                  border-color: ${props => props.theme.focus.color};
                  border-style: ${props => props.theme.focus.style};
                  border-width: ${props => props.theme.focus.width};
                  padding: 7px 5px 1px 7px;
              `
            : ""}

    span {
        display: flex;
        background-color: #ddd;
        border-radius: 4px;
        white-space: nowrap;
        margin-right: 6px;
        margin-bottom: 6px;
        padding: 2px 6px;
        font-size: 15px;
        cursor: pointer;
        align-items: center;
        svg {
            margin-left: 6px;
        }
    }
    input {
        background: transparent;
        border: none;
        flex-grow: 1;
        font-family: inherit;
        font-size: inherit;
        margin-bottom: 9px;
    }
    input:focus {
        outline: none;
    }
`;
