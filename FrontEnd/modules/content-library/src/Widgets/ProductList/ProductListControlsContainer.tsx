import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    view: state.pages.productList.view,
});

type Props = ReturnType<typeof mapStateToProps> & WidgetProps;

export interface ProductListControlsContainerStyles {
    container?: GridContainerProps;
    countGridItem?: GridItemProps;
    countTableViewGridItem?: GridItemProps;
    sortGridItem?: GridItemProps;
    sortTableViewGridItem?: GridItemProps;
    filterGridItem?: GridItemProps;
    filterTableViewGridItem?: GridItemProps;
    viewSelectGridItem?: GridItemProps;
    viewSelectTableViewGridItem?: GridItemProps;
}

export const controlsContainerStyles: ProductListControlsContainerStyles = {
    container: {
        gap: 0,
    },
    countGridItem: {
        width: [12, 12, 2, 5, 6],
    },
    countTableViewGridItem: {
        width: [12, 12, 1, 1, 1],
    },
    sortGridItem: {
        width: [12, 12, 5, 4, 4],
    },
    sortTableViewGridItem: {
        width: [12, 12, 5, 4, 3],
    },
    filterGridItem: {
        width: 0,
    },
    filterTableViewGridItem: {
        width: [0, 0, 2, 2, 2],
    },
    viewSelectGridItem: {
        width: [0, 0, 5, 3, 2],
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        display: none;
                    `,
                    css`
                        display: none;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
    viewSelectTableViewGridItem: {
        width: [0, 0, 4, 5, 6],
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        display: none;
                    `,
                    css`
                        display: none;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
};

const styles = controlsContainerStyles;

const ProductListControlsContainer: FC<Props> = ({ id, view }) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...(view === "Table" ? styles.countTableViewGridItem : styles.countGridItem)}>
                <Zone contentId={id} zoneName="Content00" />
            </GridItem>
            <GridItem {...(view === "Table" ? styles.sortTableViewGridItem : styles.sortGridItem)}>
                <Zone contentId={id} zoneName="Content01" />
            </GridItem>
            <GridItem {...(view === "Table" ? styles.filterTableViewGridItem : styles.filterGridItem)}>
                <Zone contentId={id} zoneName="Content02" />
            </GridItem>
            <GridItem {...(view === "Table" ? styles.viewSelectTableViewGridItem : styles.viewSelectGridItem)}>
                <Zone contentId={id} zoneName="Content03" />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(ProductListControlsContainer),
    definition: {
        group: "Product List",
        displayName: "List Controls Container",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
