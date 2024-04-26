import * as React from "react";

export interface LayoutTableContextData {
    /** Indicates the direction in which cells flow in each LayoutGroup. */
    cellFlow?: "column" | "row";
    /** Spacing between cells and groups. Similar to the `border-spacing` and `grid-gap` properties in CSS. */
    gap?: number;
    /** Number of cells contained in each LayoutGroup. */
    cellsPerGroup?: number;
    /** Number of groups contained in the LayoutTable. */
    numberOfGroups?: number;
}

const LayoutTableContext = React.createContext<LayoutTableContextData>({});

export default LayoutTableContext;
