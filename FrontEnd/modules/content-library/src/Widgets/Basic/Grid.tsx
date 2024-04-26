/* eslint-disable spire/export-styles */
import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem, { GridWidths } from "@insite/mobius/GridItem";
import * as React from "react";

const enum fields {
    extraLargeColumnCount = "extraLargeColumnCount",
    extraLargeRowCount = "extraLargeRowCount",
    largeColumnCount = "largeColumnCount",
    mediumColumnCount = "mediumColumnCount",
    smallColumnCount = "smallColumnCount",
    extraSmallColumnCount = "extraSmallColumnCount",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.extraLargeColumnCount]: GridWidths;
        [fields.extraLargeRowCount]: GridWidths;
        [fields.largeColumnCount]: GridWidths;
        [fields.mediumColumnCount]: GridWidths;
        [fields.smallColumnCount]: GridWidths;
        [fields.extraSmallColumnCount]: GridWidths;
    };
}

const getColumnGridUnits = (numberOfColumns: number) => {
    return Math.floor(12 / Math.min(Math.max(numberOfColumns, 1), 12)) as GridWidths;
};

const Grid: React.FC<OwnProps> = ({ fields, id }) => {
    const extraLargeColumnWidth = getColumnGridUnits(fields.extraLargeColumnCount);
    const largeColumnWidth = getColumnGridUnits(fields.largeColumnCount);
    const mediumColumnWidth = getColumnGridUnits(fields.mediumColumnCount);
    const smallColumnWidth = getColumnGridUnits(fields.smallColumnCount);
    const extraSmallColumnWidth = getColumnGridUnits(fields.extraSmallColumnCount);

    const rows: JSX.Element[] = [];
    for (let row = 0; row < fields.extraLargeRowCount; row = row + 1) {
        const columns: JSX.Element[] = [];
        for (let column = 0; column < fields.extraLargeColumnCount; column = column + 1) {
            columns.push(
                <GridItem
                    key={`GridItem-${id}-${column}-${row}`}
                    width={[
                        extraSmallColumnWidth,
                        smallColumnWidth,
                        mediumColumnWidth,
                        largeColumnWidth,
                        extraLargeColumnWidth,
                    ]}
                >
                    <Zone contentId={id} zoneName={`Content${column}${row}`} />
                </GridItem>,
            );
        }

        rows.push(
            <GridContainer key={row} gap={0}>
                {columns}
            </GridContainer>,
        );
    }

    return <>{rows}</>;
};

const gridModule: WidgetModule = {
    component: Grid,
    definition: {
        group: "Basic",
        icon: "Grid",
        fieldDefinitions: [
            {
                name: fields.extraLargeColumnCount,
                displayName: "Extra Large Column Count",
                editorTemplate: "IntegerField",
                defaultValue: 4,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.extraLargeRowCount,
                displayName: "Extra Large Row Count",
                editorTemplate: "IntegerField",
                defaultValue: 4,
                fieldType: "General",
                sortOrder: 2,
            },
            {
                name: fields.largeColumnCount,
                displayName: "Large Width Column Count",
                editorTemplate: "IntegerField",
                defaultValue: 4,
                fieldType: "General",
                sortOrder: 3,
            },
            {
                name: fields.mediumColumnCount,
                displayName: "Medium Width Column Count",
                editorTemplate: "IntegerField",
                defaultValue: 1,
                fieldType: "General",
                sortOrder: 4,
            },
            {
                name: fields.smallColumnCount,
                displayName: "Small Width Column Count",
                editorTemplate: "IntegerField",
                defaultValue: 1,
                fieldType: "General",
                sortOrder: 5,
            },
            {
                name: fields.extraSmallColumnCount,
                displayName: "Extra Small Width Column Count",
                editorTemplate: "IntegerField",
                defaultValue: 1,
                fieldType: "General",
                sortOrder: 6,
            },
        ],
    },
};

export default gridModule;
