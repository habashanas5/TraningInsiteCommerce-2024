import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React, { FC } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    view: state.pages.productList.view,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface ProductListColumnsStyles {
    container?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    leftColumnTableViewGridItem?: GridItemProps;
    rightColumnGridItem?: GridItemProps;
    rightColumnTableViewGridItem?: GridItemProps;
}

export const columnsStyles: ProductListColumnsStyles = {
    container: {
        gap: 20,
    },
    leftColumnGridItem: {
        width: [12, 12, 3, 3, 3],
    },
    leftColumnTableViewGridItem: {
        width: [12, 12, 0, 0, 0],
    },
    rightColumnGridItem: {
        width: [12, 12, 9, 9, 9],
    },
    rightColumnTableViewGridItem: {
        width: 12,
    },
};

const styles = columnsStyles;

const ProductListColumns: FC<Props> = ({ id, view }) => {
    const leftColumnGridItemStyle = view === "Table" ? styles.leftColumnTableViewGridItem : styles.leftColumnGridItem;
    const rightColumnGridItemStyle =
        view === "Table" ? styles.rightColumnTableViewGridItem : styles.rightColumnGridItem;
    return (
        <GridContainer {...styles.container}>
            <GridItem {...leftColumnGridItemStyle}>
                <Zone contentId={id} zoneName="Content00" />
            </GridItem>
            <GridItem {...rightColumnGridItemStyle}>
                <Zone contentId={id} zoneName="Content01" />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(ProductListColumns),
    definition: {
        group: "Product List",
        displayName: "Columns",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
