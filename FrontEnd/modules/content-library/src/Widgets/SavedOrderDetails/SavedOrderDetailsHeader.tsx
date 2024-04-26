import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { SavedOrderDetailsPageContext } from "@insite/content-library/Pages/SavedOrderDetailsPage";
import SavedOrderDetailsActionButtons, {
    SavedOrderDetailsActionButtonsStyles,
} from "@insite/content-library/Widgets/SavedOrderDetails/SavedOrderDetailsActionButtons";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { css } from "styled-components";

export interface SavedOrderDetailsHeaderStyles {
    headerGridContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    buttonGridItem?: GridItemProps;
    actionButtons?: SavedOrderDetailsActionButtonsStyles;
}

export const savedOrderDetailsHeaderStyles: SavedOrderDetailsHeaderStyles = {
    buttonGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: [2, 2, 5, 8, 8],
    },
    titleGridItem: {
        width: [10, 10, 7, 4, 4],
    },
};

const styles = savedOrderDetailsHeaderStyles;

type Props = WidgetProps & HasCartContext;

const SavedOrderDetailsHeader = ({ cart, id }: Props) => {
    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Zone contentId={id} zoneName="Content00" />
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <SavedOrderDetailsActionButtons cart={cart} extendedStyles={styles.actionButtons} />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: withCart(SavedOrderDetailsHeader),
    definition: {
        displayName: "Page Header",
        allowedContexts: [SavedOrderDetailsPageContext],
        group: "Saved Order Details",
    },
};

export default widgetModule;
