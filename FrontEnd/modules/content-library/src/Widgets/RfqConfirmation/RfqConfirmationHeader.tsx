import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import { getHomePageUrl, getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqConfirmationPageContext } from "@insite/content-library/Pages/RfqConfirmationPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqConfirmation.quoteId),
    rfqMyQuotesPageUrl: getPageLinkByPageType(state, "RfqMyQuotesPage")?.url,
    homePageUrl: getHomePageUrl(state),
});

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps>;

export interface RfqConfirmationHeaderStyles {
    headerGridContainer?: GridContainerProps;
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuProps;
    title: TypographyProps;
    titleGridItem: GridItemProps;
    viewQuotesButton?: ButtonPresentationProps;
    continueButton?: ButtonPresentationProps;
    printButton?: ButtonPresentationProps;
    buttonGridItem?: GridItemProps;
    printClickable?: ClickableProps;
    viewQuotesClickable?: ClickableProps;
    continueClickable?: ClickableProps;
}

export const rfqConfirmationHeaderStyles: RfqConfirmationHeaderStyles = {
    headerGridContainer: {
        gap: 10,
    },
    viewQuotesButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    continueButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    printButton: {
        buttonType: "outline",
        variant: "secondary",
    },
    buttonGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: [2, 2, 2, 6, 6],
    },
    titleGridItem: {
        width: [10, 10, 10, 6, 6],
    },
    title: {
        variant: "h3",
        as: "h1",
        css: css`
            @media print {
                font-size: 11px;
            }
        `,
    },
    buttonsHiddenContainer: {
        below: "lg",
    },
    menuHiddenContainer: {
        above: "md",
    },
};

const styles = rfqConfirmationHeaderStyles;

const RfqConfirmationHeader: FC<Props> = ({ quoteState, history, rfqMyQuotesPageUrl, homePageUrl }) => {
    if (!quoteState.value) {
        return null;
    }

    const quote = quoteState.value;

    const viewQuotesClickHandler = () => {
        if (rfqMyQuotesPageUrl) {
            history.push(rfqMyQuotesPageUrl);
        }
    };

    const continueClickHandler = () => {
        history.push(homePageUrl);
    };

    const printLabel = translate("Print");
    const viewQuotesLabel = translate("View My Quotes");
    const continueLabel = translate("Continue Shopping");

    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.title}>
                    {`${translate(quote.isJobQuote ? "Job Quote" : "Sales Quote")} `}
                    <span data-test-selector="quoteNumber">{quote.quoteNumber}</span>
                    {` ${translate("Requested")}`}
                </Typography>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Hidden {...styles.menuHiddenContainer}>
                    <OverflowMenu {...styles.narrowOverflowMenu}>
                        <Clickable {...styles.printClickable} onClick={openPrintDialog}>
                            {printLabel}
                        </Clickable>
                        <Clickable {...styles.viewQuotesClickable} onClick={viewQuotesClickHandler}>
                            {viewQuotesLabel}
                        </Clickable>
                        <Clickable {...styles.continueClickable} onClick={continueClickHandler}>
                            {continueLabel}
                        </Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.buttonsHiddenContainer}>
                    <Button {...styles.printButton} onClick={openPrintDialog}>
                        {printLabel}
                    </Button>
                    <Button {...styles.viewQuotesButton} onClick={viewQuotesClickHandler}>
                        {viewQuotesLabel}
                    </Button>
                    <Button {...styles.continueButton} onClick={continueClickHandler}>
                        {continueLabel}
                    </Button>
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withHistory(RfqConfirmationHeader)),
    definition: {
        displayName: "Page Header",
        allowedContexts: [RfqConfirmationPageContext],
        fieldDefinitions: [],
        group: "RFQ Quote Confirmation",
    },
};

export default widgetModule;
