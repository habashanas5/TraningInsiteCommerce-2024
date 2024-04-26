import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqRequestQuotePageContext } from "@insite/content-library/Pages/RfqRequestQuotePage";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    cartState: getCurrentCartState(state),
    accounts: state.pages.rfqRequestQuote.accounts,
});

type Props = ReturnType<typeof mapStateToProps> & WidgetProps;

export interface RfqRequestQuotePageContainerStyles {
    spinnerWrapper?: InjectableCss;
    container?: InjectableCss;
    cartLinesContainer?: InjectableCss;
    specificationsContainer?: InjectableCss;
    emptyQuoteWrapper?: InjectableCss;
    emptyQuoteText?: TypographyPresentationProps;
}

export const rfqRequestQuotePageContainerStyles: RfqRequestQuotePageContainerStyles = {
    spinnerWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
        `,
    },
    emptyQuoteText: {
        variant: "h5",
    },
    container: {
        css: css`
            /* stylelint-disable value-no-vendor-prefix */
            display: -ms-grid;
            display: grid;
            padding: 1.5rem 0 0 1.5rem;
            margin: -1.5rem;
            overflow: hidden;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            grid-template-columns: minmax(0, 1fr);
                            -ms-grid-columns: minmax(0, 1fr);
                        `,
                        null,
                        css`
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                            -ms-grid-columns: minmax(0, 1fr) minmax(0, 1fr);
                            grid-template-rows: repeat(5, auto);
                            -ms-grid-rows: auto auto auto auto auto;
                        `,
                        css`
                            grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
                            -ms-grid-columns: minmax(0, 2fr) minmax(0, 1fr);
                        `,
                    ],
                    "min",
                )}
        `,
    },
    cartLinesContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            border: 0 solid transparent;
                            border-width: 0 1.5rem 1.5rem 0;
                        `,
                        null,
                        css`
                            grid-column-start: 1;
                            -ms-grid-column: 1;
                            grid-row-start: 1;
                            -ms-grid-row: 1;
                            grid-row-end: 6;
                            -ms-grid-row-span: 6;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    specificationsContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            border: 0 solid transparent;
                            border-width: 0 1.5rem 1.5rem 0;
                        `,
                        null,
                        css`
                            grid-column-start: 2;
                            -ms-grid-column: 2;
                            grid-row-start: 1;
                            -ms-grid-row: 1;
                        `,
                    ],
                    "min",
                )}
        `,
    },
};

const styles = rfqRequestQuotePageContainerStyles;

const RfqRequestQuotePageContainer: FC<Props> = ({ cartState, accounts, id }) => {
    if (!cartState.value || !accounts) {
        return (
            <StyledWrapper {...styles.spinnerWrapper}>
                <LoadingSpinner />
            </StyledWrapper>
        );
    }

    if (!cartState.value.cartLines || cartState.value.cartLines.length === 0) {
        return (
            <StyledWrapper {...styles.emptyQuoteWrapper}>
                <Typography {...styles.emptyQuoteText} data-test-selector="requestQuoteCartIsEmpty">
                    {siteMessage("Rfq_EmptyQuoteMessage")}
                </Typography>
            </StyledWrapper>
        );
    }

    return (
        <StyledWrapper {...styles.container}>
            <StyledWrapper {...styles.specificationsContainer}>
                <Zone zoneName="Content1" contentId={id} />
            </StyledWrapper>
            <StyledWrapper {...styles.cartLinesContainer}>
                <Zone zoneName="Content0" contentId={id} />
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqRequestQuotePageContainer),
    definition: {
        group: "RFQ Request Quote",
        displayName: "Page Container",
        allowedContexts: [RfqRequestQuotePageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
