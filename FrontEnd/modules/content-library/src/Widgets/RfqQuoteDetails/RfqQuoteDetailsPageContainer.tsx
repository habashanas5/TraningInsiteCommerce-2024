import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqQuoteDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RfqQuoteDetailsPageContainerStyles {
    spinnerWrapper?: InjectableCss;
    mainContainer?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    leftColumnInnerContainer?: GridContainerProps;
    leftColumnTopGridItem?: GridItemProps;
    leftColumnMiddleGridItem?: GridItemProps;
    leftColumnBottomGridItem?: GridItemProps;
    rigthColumnGridItem?: GridItemProps;
}

export const rfqQuoteDetailsPageContainerStyles: RfqQuoteDetailsPageContainerStyles = {
    spinnerWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
    mainContainer: { gap: 20 },
    leftColumnGridItem: { width: [12, 12, 12, 7, 8] },
    leftColumnInnerContainer: { gap: 20 },
    leftColumnTopGridItem: { width: 12 },
    leftColumnMiddleGridItem: { width: [12, 12, 12, 0, 0] },
    leftColumnBottomGridItem: { width: 12 },
    rigthColumnGridItem: { width: [0, 0, 0, 5, 4] },
};

const styles = rfqQuoteDetailsPageContainerStyles;

const RfqQuoteDetailsPageContainer = ({ id, quoteState }: Props) => {
    if (!quoteState.value) {
        return (
            <StyledWrapper {...styles.spinnerWrapper}>
                <LoadingSpinner />
            </StyledWrapper>
        );
    }

    return (
        <GridContainer {...styles.mainContainer}>
            <GridItem {...styles.leftColumnGridItem}>
                <GridContainer {...styles.leftColumnInnerContainer}>
                    <GridItem {...styles.leftColumnTopGridItem}>
                        <Zone zoneName="Content00" contentId={id} />
                    </GridItem>
                    <GridItem {...styles.leftColumnMiddleGridItem}>
                        <Zone zoneName="Content01" contentId={id} />
                    </GridItem>
                    <GridItem {...styles.leftColumnBottomGridItem}>
                        <Zone zoneName="Content02" contentId={id} />
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...styles.rigthColumnGridItem}>
                <Zone zoneName="Content1" contentId={id} />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqQuoteDetailsPageContainer),
    definition: {
        group: "RFQ Quote Details",
        displayName: "Page Container",
        allowedContexts: [RfqQuoteDetailsPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
