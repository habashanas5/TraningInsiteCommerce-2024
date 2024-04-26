import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

export interface ProductDetailsViewStyles {
    container?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    leftColumnInnerContainer?: GridContainerProps;
    topGridItem?: GridItemProps;
    middleGridItem?: GridItemProps;
    middleGridItemHidden?: HiddenProps;
    bottomGridItem?: GridItemProps;
    rightColumnGridItem?: GridItemProps;
    rightColumnGridItemHidden?: HiddenProps;
}

export const viewStyles: ProductDetailsViewStyles = {
    leftColumnGridItem: {
        width: [12, 12, 8, 8, 8],
        css: css`
            overflow: hidden;
            direction: ltr;
        `,
    },
    topGridItem: { width: 12 },
    middleGridItem: { width: [12, 12, 0, 0, 0] },
    middleGridItemHidden: {
        above: "sm",
        css: css`
            width: 100%;
            direction: ltr;
        `,
    },
    bottomGridItem: { width: 12 },
    rightColumnGridItem: { width: [0, 0, 4, 4, 4] },
    rightColumnGridItemHidden: {
        below: "md",
        css: css`
            width: 100%;
            direction: ltr;
        `,
    },
    container: {
        css: css`
            direction: rtl;
        `,
    },
};

const styles = viewStyles;

const ProductDetailsView: React.FC<WidgetProps> = props => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.rightColumnGridItem} data-test-selector="productDetails_rightColumn">
                <Hidden {...styles.rightColumnGridItemHidden}>
                    <Zone contentId={props.id} zoneName="Content3" />
                </Hidden>
            </GridItem>
            <GridItem {...styles.leftColumnGridItem} data-test-selector="productDetails_leftColumn">
                <GridContainer {...styles.leftColumnInnerContainer}>
                    <GridItem {...styles.topGridItem}>
                        <Zone contentId={props.id} zoneName="Content0" />
                    </GridItem>
                    <GridItem {...styles.middleGridItem}>
                        <Hidden {...styles.middleGridItemHidden}>
                            <Zone contentId={props.id} zoneName="Content1" />
                        </Hidden>
                    </GridItem>
                    <GridItem {...styles.bottomGridItem}>
                        <Zone contentId={props.id} zoneName="Content2" />
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect()(ProductDetailsView),
    definition: {
        displayName: "View",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
