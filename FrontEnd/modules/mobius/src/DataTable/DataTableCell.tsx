import DataTableCellBase, { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableContext from "@insite/mobius/DataTable/DataTableContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import * as React from "react";
import { css } from "styled-components";

export interface DataTableCellProps extends DataTableCellBaseProps {
    /** Props to be passed to the cell's typography child. */
    typographyProps?: TypographyPresentationProps;
}

const DataTableCell: React.FC<DataTableCellProps> = ({
    css: cellCss = "",
    children,
    typographyProps,
    ...otherProps
}) => (
    <DataTableContext.Consumer>
        {({ _cssOverrides, cellTypographyProps }) => (
            <DataTableCellBase
                {...otherProps}
                css={css`
                    ${_cssOverrides.cell || ""}
                    ${cellCss}
                `}
            >
                {typeof children === "string" ? (
                    <Typography {...cellTypographyProps} {...typographyProps}>
                        {children}
                    </Typography>
                ) : (
                    children
                )}
            </DataTableCellBase>
        )}
    </DataTableContext.Consumer>
);

export default DataTableCell;
