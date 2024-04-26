import { ColumnsDefinition } from "@insite/client-framework/Types/FieldDefinition";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem, { GridWidths } from "@insite/mobius/GridItem";
import MobiusTextField from "@insite/mobius/TextField";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import * as React from "react";
import styled, { css } from "styled-components";

interface State {
    fieldValue: string;
}

type Props = EditorTemplateProps<(GridWidths | GridWidths[])[], ColumnsDefinition>;

export default class ColumnsField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const fieldValue: (string | GridWidths)[] = [];
        for (const value of props.fieldValue) {
            if (Array.isArray(value)) {
                fieldValue.push(`[${value}]`);
            } else {
                fieldValue.push(value);
            }
        }

        this.state = {
            fieldValue: fieldValue.join("+"),
        };
    }

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        const numberOfBreakpoints = 5;
        const gridMaxWidth = 12;

        const value = event.currentTarget.value;
        this.setState({
            fieldValue: value,
        });
        const values = value.split("+");
        const columnValues: (GridWidths | GridWidths[])[] = [];
        let total = 0;
        let ignoreTotal = false;
        for (let x = 0; x < values.length; x++) {
            const value = values[x];
            if (value.startsWith("[")) {
                ignoreTotal = true;
                const columnValue: GridWidths[] = [];
                const breakpoints = value.replace("[", "").replace("]", "").split(",");
                if (breakpoints.length !== numberOfBreakpoints) {
                    this.props.updateField(this.props.fieldDefinition.name, []);
                    return;
                }
                for (const possibleWidth of breakpoints) {
                    const number = Number(possibleWidth) as GridWidths;
                    if (number >= 1 && number <= gridMaxWidth) {
                        columnValue.push(number);
                    } else {
                        this.props.updateField(this.props.fieldDefinition.name, []);
                        return;
                    }
                }

                columnValues.push(columnValue);
            } else {
                const width = Number(values[x]) as GridWidths;
                if (width >= 1 && width <= gridMaxWidth && width.toString().indexOf(".") < 0) {
                    columnValues.push(width);
                    total += width;
                } else {
                    this.props.updateField(this.props.fieldDefinition.name, []);
                    return;
                }
            }
        }
        if (!ignoreTotal && total !== gridMaxWidth) {
            this.props.updateField(this.props.fieldDefinition.name, []);
            return;
        }

        this.props.updateField(this.props.fieldDefinition.name, columnValues);
    };

    clickGridItem = (columns: GridWidths[]) => {
        this.setState({
            fieldValue: columns.join("+"),
        });

        this.props.updateField(this.props.fieldDefinition.name, columns);
    };

    gridItem(columns: GridWidths[], currentColumnsString: string) {
        return (
            <GridItem width={3}>
                <ColumnSelector
                    columns={columns}
                    selected={columns.join("") === currentColumnsString}
                    onClick={this.clickGridItem}
                />
            </GridItem>
        );
    }

    render() {
        const { fieldValue } = this.state;
        const currentColumnsString = fieldValue.replace(/\+/g, "");

        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <GridContainer
                    gap={16}
                    css={css`
                        margin-top: 4px;
                    `}
                >
                    {this.gridItem([12], currentColumnsString)}
                    {this.gridItem([6, 6], currentColumnsString)}
                    {this.gridItem([4, 4, 4], currentColumnsString)}
                    {this.gridItem([3, 3, 3, 3], currentColumnsString)}
                </GridContainer>
                <GridContainer gap={16}>
                    {this.gridItem([10, 2], currentColumnsString)}
                    {this.gridItem([3, 3, 6], currentColumnsString)}
                    {this.gridItem([3, 6, 3], currentColumnsString)}
                    {this.gridItem([2, 2, 2, 2, 2, 2], currentColumnsString)}
                </GridContainer>
                <MobiusTextField
                    id={this.props.fieldDefinition.name}
                    type="text"
                    value={this.state.fieldValue}
                    onChange={this.onChange}
                />
            </StandardControl>
        );
    }
}

type columnSelectorProps = { columns: GridWidths[]; selected?: boolean; onClick: (columns: GridWidths[]) => void };

class ColumnSelector extends React.Component<columnSelectorProps> {
    onClick = () => {
        const { columns, onClick } = this.props;
        onClick(columns);
    };

    render() {
        const { columns, selected } = this.props;

        const columnElements: JSX.Element[] = [];

        for (let x = 0; x < columns.length; x += 1) {
            columnElements.push(
                <GridItem key={x} width={columns[x]} onClick={this.onClick}>
                    <FillStyle selected={selected} />
                </GridItem>,
            );
        }

        return <GridContainerStyle gap={3}>{columnElements}</GridContainerStyle>;
    }
}

// TODO ISC-12170 remove the !important when the mobius bug is fixed
const GridContainerStyle = styled(GridContainer)`
    cursor: pointer;
    > div {
        width: 100% !important;
    }
`;

const FillStyle = styled.div<{ selected?: boolean }>`
    background-color: ${props => (props.selected ? props.theme.colors.custom.blueBase : props.theme.colors.text.main)};
    height: 32px;
    width: 100%;
`;
