import { DataTableCssOverrides, DataTablePresentationProps, DataTableProps } from "@insite/mobius/DataTable/DataTable";
import * as React from "react";

export interface DataTableContextData
    extends Omit<DataTablePresentationProps, "cssOverrides">,
        Pick<DataTableProps, "sortOrder"> {
    /** The level to set for all section titles, appropriate for the architecture of the page. */
    _cssOverrides: DataTableCssOverrides;
}

const DataTableContext = React.createContext<DataTableContextData>({
    _cssOverrides: {},
    cellTypographyProps: {},
    headerTypographyProps: {},
    sortClickableProps: {},
    sortIconProps: {},
    sortIconSources: {},
    sortOrder: [],
});

export default DataTableContext;
