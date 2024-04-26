import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RequestRmaPageContext } from "@insite/content-library/Pages/RequestRmaPage";
import RequestRmaButtons, {
    RequestRmaButtonsStyles,
} from "@insite/content-library/Widgets/RequestRma/RequestRmaButtons";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    pageTitle: getCurrentPage(state).fields.title,
});

export interface RequestRmaHeaderStyles {
    headerGridContainer?: GridContainerProps;
    title: TypographyProps;
    titleGridItem: GridItemProps;
    buttonsGridItem?: GridItemProps;
    requestRmaButtons?: RequestRmaButtonsStyles;
}

export const headerStyles: RequestRmaHeaderStyles = {
    buttonsGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: [1, 1, 1, 6, 6],
    },
    titleGridItem: {
        width: [11, 11, 11, 6, 6],
    },
    title: {
        variant: "h2",
        as: "h1",
    },
};

const styles = headerStyles;

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

const RequestRmaHeader: FC<Props> = ({ pageTitle }) => {
    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.title}>{pageTitle}</Typography>
            </GridItem>
            <GridItem {...styles.buttonsGridItem}>
                <RequestRmaButtons extendedStyles={styles.requestRmaButtons} />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, null)(RequestRmaHeader),
    definition: {
        displayName: "Page Header",
        allowedContexts: [RequestRmaPageContext],
        fieldDefinitions: [],
        group: "Return Request (RMA)",
    },
};

export default widgetModule;
