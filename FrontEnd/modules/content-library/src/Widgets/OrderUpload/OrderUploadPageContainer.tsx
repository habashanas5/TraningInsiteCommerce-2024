import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderUploadPageContext } from "@insite/content-library/Pages/OrderUploadPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React, { FC } from "react";

export interface OrderUploadPageContainerStyles {
    container?: GridContainerProps;
    fileUploadGridItem?: GridItemProps;
    instructionsGridItem?: GridItemProps;
}

export const orderUploadPageContainerStyles: OrderUploadPageContainerStyles = {
    fileUploadGridItem: { width: [12, 12, 6, 6, 6] },
    instructionsGridItem: { width: [12, 12, 6, 6, 6] },
};

const styles = orderUploadPageContainerStyles;

const OrderUploadPageContainer: FC<WidgetProps> = props => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.fileUploadGridItem}>
                <Zone zoneName="Content00" contentId={props.id} />
            </GridItem>
            <GridItem {...styles.instructionsGridItem}>
                <Zone zoneName="Content01" contentId={props.id} />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: OrderUploadPageContainer,
    definition: {
        group: "Order Upload",
        allowedContexts: [OrderUploadPageContext],
        displayName: "Page Container",
    },
};

export default widgetModule;
