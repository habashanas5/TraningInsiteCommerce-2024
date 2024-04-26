/* eslint-disable spire/export-styles */
import Zone from "@insite/client-framework/Components/Zone";
import { ColumnAlignment } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem, { GridWidths } from "@insite/mobius/GridItem";
import * as React from "react";

const enum fields {
    columns = "columns",
    gap = "gap",
    alignment = "alignment",
    reflow = "reflow",
}

interface Props extends WidgetProps {
    fields: {
        [fields.columns]: GridWidths[];
        [fields.gap]: number;
        [fields.alignment]: ColumnAlignment[];
        [fields.reflow]: boolean;
    };
}

const mobileColumnsRef: { [key: number]: GridWidths | GridWidths[] } = {
    1: [3, 3, 1, 1, 1],
    2: [4, 4, 2, 2, 2],
    3: [6, 6, 3, 3, 3],
    4: [6, 6, 4, 4, 4],
    5: [12, 12, 5, 5, 5],
    6: [12, 12, 6, 6, 6],
    7: [12, 12, 7, 7, 7],
    8: [12, 12, 8, 8, 8],
    9: [12, 12, 9, 9, 9],
    10: [12, 12, 10, 10, 10],
    11: [12, 12, 11, 11, 11],
    12: 12,
};

const convertToResponsive = (column: GridWidths): GridWidths | GridWidths[] => {
    return mobileColumnsRef[column] || column;
};

const Row: React.FunctionComponent<Props> = (props: Props) => {
    const {
        fields: { columns, gap, alignment, reflow },
        id,
    } = props;

    const columnElements: JSX.Element[] = [];

    for (let x = 0; x < columns.length; x += 1) {
        const align = alignment[x] ? alignment[x] : "top";
        columnElements.push(
            <GridItem key={x} width={reflow ? convertToResponsive(columns[x]) : columns[x]} align={align}>
                <Zone contentId={id} zoneName={`Content${x}`} />
            </GridItem>,
        );
    }

    return <GridContainer gap={gap || 0}>{columnElements}</GridContainer>;
};

const advancedTab = {
    displayName: "Advanced",
    sortOrder: 1,
};

const widgetModule: WidgetModule = {
    component: Row,
    definition: {
        group: "Basic",
        icon: "Row",
        fieldDefinitions: [
            {
                name: fields.columns,
                displayName: "Layout",
                editorTemplate: "ColumnsField",
                defaultValue: [4, 4, 4],
                fieldType: "General",
                sortOrder: 1,
                validate: value => (value.length > 0 ? null : "Please enter a valid layout."),
            },
            {
                name: fields.reflow,
                displayName: "Use default reflow for responsive screens sizes",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
            },
            {
                name: fields.gap,
                displayName: "Gap Between Items",
                editorTemplate: "IntegerField",
                defaultValue: 0,
                fieldType: "General",
                max: 1000,
                min: 0,
                sortOrder: 10,
            },
            {
                name: fields.alignment,
                displayName: "Column Alignment",
                editorTemplate: "ColumnAlignmentField",
                defaultValue: [],
                fieldType: "General",
                sortOrder: 1,
                tab: advancedTab,
            },
        ],
    },
};

export default widgetModule;
