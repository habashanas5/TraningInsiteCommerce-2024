import Clickable from "@insite/mobius/Clickable";
import { DataTablePresentationProps, SortOrderOptions } from "@insite/mobius/DataTable/DataTable";
import DataTableCellBase, { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableContext from "@insite/mobius/DataTable/DataTableContext";
import { IconMemo } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import styled, { css, withTheme } from "styled-components";

let sortOrderObject:
    | {}
    | {
          [SortOrderOptions.ascending]: string;
          [SortOrderOptions.descending]: string;
          [SortOrderOptions.none]: string;
          [SortOrderOptions.other]: string;
      } = {};

type IconsObject = {
    sortable?: React.ComponentType | string;
    [SortOrderOptions.ascending]?: React.ComponentType | string;
    [SortOrderOptions.descending]?: React.ComponentType | string;
    [SortOrderOptions.none]?: React.ComponentType | string;
    [SortOrderOptions.other]?: React.ComponentType | string;
};

const iconsObject: {
    sortable?: React.ReactElement;
    [SortOrderOptions.ascending]?: React.ReactElement;
    [SortOrderOptions.descending]?: React.ReactElement;
    [SortOrderOptions.none]?: React.ReactElement;
    [SortOrderOptions.other]?: React.ReactElement;
} = {};

const generateIconsObject = (
    sortOrder: SortOrderOptions[],
    globalIconSources?: IconsObject,
    instanceIconSources?: IconsObject,
) => {
    const combinedIconSources: IconsObject = { ...globalIconSources, ...instanceIconSources };
    iconsObject.sortable = <IconMemo src={combinedIconSources.sortable as React.ComponentType} key="sortable" />;
    sortOrder.forEach((iconKey: SortOrderOptions) => {
        iconsObject[iconKey] = <IconMemo src={combinedIconSources[iconKey] as React.ComponentType} key={iconKey} />;
    });
};

export type DataTableHeaderPresentationProps = Pick<
    DataTablePresentationProps,
    "sortClickableProps" | "sortIconProps" | "sortIconSources"
> & {
    /** CSS string or styled-components function to be injected into this component. */
    // should be StyledProp<DataTableHeaderProps> but typescript wasn't happy with that for unknown reasons
    css?: StyledProp;
    /** Props that will be passed to the typography title component if the Title is a string. */
    typographyProps?: TypographyPresentationProps;
};

export type DataTableHeaderProps = MobiusStyledComponentProps<
    "th",
    DataTableCellBaseProps & {
        /** Callback function to sort when header is clicked. Presence governs sortable UI and accessibility concerns thereof. */
        onSortClick?: () => void;
        /** The sort order currently being applied to the column. */
        sorted?: false | "ascending" | "descending" | "none" | "other";
        /** A list of sort options describing the order in which they will be applied by the parent component. */
        sortOrder?: SortOrderOptions[];
    } & DataTableHeaderPresentationProps
>;

export const DataTableHeaderStyle = styled(DataTableCellBase).attrs({
    as: "th",
    scope: "col",
})`
    background: ${getColor("common.accent")};
    border-bottom: 2px solid ${getColor("common.border")};
    ${injectCss}
`;

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
    children,
    css: headerCss = "",
    onSortClick,
    sorted,
    theme,
    title,
    typographyProps,
    ...otherProps
}) => (
    <DataTableContext.Consumer>
        {({ _cssOverrides, headerTypographyProps, sortClickableProps, sortIconProps, sortIconSources, sortOrder }) => {
            const sortable = typeof onSortClick === "function";
            let sortIconText;
            let sortIcon;
            if (sortable) {
                /** in order not to call translate four times on every render, the object is defined outside of the
                 * component scope and only created if empty. */
                if (Object.entries(sortOrderObject).length === 0) {
                    sortOrderObject = {
                        [SortOrderOptions.ascending]: theme!.translate("ascending"),
                        [SortOrderOptions.descending]: theme!.translate("descending"),
                        [SortOrderOptions.none]: theme!.translate("none"),
                        [SortOrderOptions.other]: theme!.translate("other"),
                    };
                }
                const thisSortOrder = otherProps.sortOrder || sortOrder;
                if (Object.entries(iconsObject).length === 0) {
                    generateIconsObject(thisSortOrder!, sortIconSources, otherProps.sortIconSources);
                }
                const currentIndexInSortOrder = thisSortOrder!.findIndex((item: SortOrderOptions) => item === sorted);
                const nextSortString = !sorted
                    ? thisSortOrder![0]
                    : thisSortOrder![
                          currentIndexInSortOrder === thisSortOrder!.length - 1 ? 0 : currentIndexInSortOrder + 1
                      ];
                const childrenIfString = typeof children === "string" ? children : "";
                sortIconText = theme!
                    .translate("sort by {0} in {1} order")
                    .replace("{0}", title || childrenIfString)
                    .replace("{1}", nextSortString);
                const theElement = sorted ? iconsObject[sorted] : iconsObject.sortable;
                sortIcon = (
                    <>
                        {theElement &&
                            React.cloneElement(theElement, { ...sortIconProps, ...otherProps.sortIconProps })}
                        <VisuallyHidden>{sortIconText}</VisuallyHidden>
                    </>
                );
            }
            const cellContents = (
                <>
                    {title ? <VisuallyHidden>{title}</VisuallyHidden> : null}
                    {typeof children === "string" ? (
                        <>
                            <Typography {...headerTypographyProps} {...typographyProps} aria-hidden={!!title}>
                                {children}
                            </Typography>
                            {sortable && sortIcon}
                        </>
                    ) : title ? (
                        <span aria-hidden>{children}</span>
                    ) : (
                        <>
                            {children}
                            {sortable && sortIcon}
                        </>
                    )}
                </>
            );
            return (
                <DataTableHeaderStyle
                    {...omitMultiple(otherProps, ["sortIconProps", "sortIconSources", "sortClickableProps"])}
                    aria-sort={sorted}
                    css={css`
                        ${_cssOverrides.header || ""}
                        ${headerCss}
                    `}
                    title={title}
                >
                    {sortable ? (
                        <Clickable
                            {...sortClickableProps}
                            {...otherProps.sortClickableProps}
                            onClick={onSortClick}
                            type="button"
                        >
                            {cellContents}
                        </Clickable>
                    ) : (
                        cellContents
                    )}
                </DataTableHeaderStyle>
            );
        }}
    </DataTableContext.Consumer>
);

DataTableHeader.defaultProps = {
    sortOrder: [SortOrderOptions.descending, SortOrderOptions.ascending],
};

export default withTheme(DataTableHeader);
