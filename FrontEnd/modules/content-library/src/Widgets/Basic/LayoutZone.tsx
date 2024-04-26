/* eslint-disable spire/export-styles */
import { HasShellContext, ShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem from "@insite/mobius/GridItem";
import * as React from "react";

export type Props = WidgetProps & HasShellContext;

const LayoutZone: React.FunctionComponent<Props> = ({ id, shellContext }: Props) => {
    const row = 0;
    return (
        <GridContainer>
            <GridItem key={`GridItem-${id}-${row}`} width={[12, 12, 12, 12, 12]}>
                <ShellContext.Provider value={{ ...shellContext, layoutEditableZone: true }}>
                    <Zone contentId={id} zoneName={`Content${row}`} />
                </ShellContext.Provider>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: withIsInShell(LayoutZone),
    definition: {
        group: "Basic",
        icon: "Banner",
        allowedContexts: ["Layout"],
        fieldDefinitions: [],
    },
};

export default widgetModule;
