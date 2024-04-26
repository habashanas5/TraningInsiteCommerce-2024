/* eslint-disable spire/export-styles */
import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem from "@insite/mobius/GridItem";
import * as React from "react";

interface Props extends WidgetProps {
    fields: {
        rowCount: number;
        gap: number;
    };
}

// A widget that makes a comfigurable number of row zones within its container.
const Rows: React.FunctionComponent<Props> = ({ fields: { rowCount, gap }, id }: Props) => {
    const rows: JSX.Element[] = [];
    for (let row = 0; row < rowCount; row = row + 1) {
        rows.push(
            <GridItem key={`GridItem-${id}-${row}`} width={[12, 12, 12, 12, 12]}>
                <Zone contentId={id} zoneName={`Content${row}`} />
            </GridItem>,
        );
    }

    return <GridContainer gap={gap}>{rows}</GridContainer>;
};

const widgetModule: WidgetModule = {
    component: Rows,
    definition: {
        group: "Basic",
        icon: "Row",
        fieldDefinitions: [
            {
                name: "rowCount",
                displayName: "Row Count",
                editorTemplate: "IntegerField",
                defaultValue: 4,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: "gap",
                displayName: "Gap Between Items",
                editorTemplate: "IntegerField",
                defaultValue: 0,
                fieldType: "General",
                sortOrder: 6,
            },
        ],
    },
};

export default widgetModule;
