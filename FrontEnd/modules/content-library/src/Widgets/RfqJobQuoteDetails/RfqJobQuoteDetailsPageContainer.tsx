import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getJobQuoteState } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqJobQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqJobQuoteDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    jobQuoteState: getJobQuoteState(state, state.pages.rfqJobQuoteDetails?.jobQuoteId),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RfqJobQuoteDetailsPageContainerStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    mainContainer?: GridContainerProps;
    topGridItem?: GridItemProps;
    middleGridItem?: GridItemProps;
    bottomGridItem?: GridItemProps;
}

export const rfqJobQuoteDetailsPageContainerStyles: RfqJobQuoteDetailsPageContainerStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
    topGridItem: { width: 12 },
    middleGridItem: { width: 12 },
    bottomGridItem: { width: 12 },
};

const styles = rfqJobQuoteDetailsPageContainerStyles;

const RfqJobQuoteDetailsPageContainer = ({ id, jobQuoteState }: Props) => {
    if (!jobQuoteState.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        );
    }

    return (
        <GridContainer {...styles.mainContainer}>
            <GridItem {...styles.topGridItem}>
                <Zone zoneName="Info" contentId={id} />
            </GridItem>
            <GridItem {...styles.middleGridItem}>
                <Zone zoneName="Table" contentId={id} />
            </GridItem>
            <GridItem {...styles.bottomGridItem}>
                <Zone zoneName="Footer" contentId={id} />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqJobQuoteDetailsPageContainer),
    definition: {
        group: "RFQ Job Quote Details",
        displayName: "Page Container",
        allowedContexts: [RfqJobQuoteDetailsPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
