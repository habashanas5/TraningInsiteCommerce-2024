import { ColumnAlignment, ColumnAlignmentDefinition } from "@insite/client-framework/Types/FieldDefinition";
import Select from "@insite/mobius/Select";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import * as React from "react";
import styled from "styled-components";

type Props = EditorTemplateProps<ColumnAlignment[], ColumnAlignmentDefinition>;

export default class ColumnAlignmentField extends React.Component<Props> {
    updateColumn = (index: number, value: ColumnAlignment) => {
        const {
            fieldValue,
            updateField,
            fieldDefinition: { name },
        } = this.props;

        const newFieldValue = { ...fieldValue };
        newFieldValue[index] = value;

        updateField(name, newFieldValue);
    };

    render() {
        const { item, fieldDefinition, fieldValue } = this.props;

        const columns = item.fields["columns"];
        if (!columns || !Array.isArray(columns)) {
            return null;
        }

        if (!fieldValue) {
            this.props.updateField(fieldDefinition.name, []);
            return null;
        }

        return (
            <StandardControl fieldDefinition={fieldDefinition}>
                {columns.map((column, index) => (
                    <ColumnAlignmentSelector
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        index={index}
                        updateColumn={this.updateColumn}
                        value={fieldValue[index] || "top"}
                    />
                ))}
            </StandardControl>
        );
    }
}

interface SelectorProps {
    value: ColumnAlignment;
    index: number;
    updateColumn: (index: number, value: ColumnAlignment) => void;
}

class ColumnAlignmentSelector extends React.Component<SelectorProps> {
    onChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.updateColumn(this.props.index, event.currentTarget.value as ColumnAlignment);
    };

    render() {
        const { index, value } = this.props;

        return (
            <Wrapper>
                <span>{index + 1}</span>
                <Select onChange={this.onChange} value={value}>
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                </Select>
            </Wrapper>
        );
    }
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    > span {
        margin: 10px 5px 0 0;
    }
`;
