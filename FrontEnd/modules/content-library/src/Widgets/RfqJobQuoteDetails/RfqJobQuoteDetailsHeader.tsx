import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getCurrentPageJobQuoteState,
    getQtyOrderedByJobQuoteLineId,
} from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import generateOrder from "@insite/client-framework/Store/Pages/RfqJobQuoteDetails/Handlers/GenerateOrder";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqJobQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqJobQuoteDetailsPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    jobQuoteState: getCurrentPageJobQuoteState(state),
    checkoutShippingPageUrl: getPageLinkByPageType(state, "CheckoutShippingPage")?.url,
    qtyOrderedByJobQuoteLineId: getQtyOrderedByJobQuoteLineId(state),
});

const mapDispatchToProps = {
    generateOrder,
};

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqJobQuoteDetailsHeaderStyles {
    headerGridContainer?: GridContainerProps;
    title: TypographyPresentationProps;
    titleGridItem: GridItemProps;
    generateOrderButton?: ButtonPresentationProps;
    buttonGridItem?: GridItemProps;
}

export const rfqJobQuoteDetailsHeaderStyles: RfqJobQuoteDetailsHeaderStyles = {
    headerGridContainer: {
        gap: 10,
    },
    generateOrderButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    buttonGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: [6, 2, 2, 7, 6],
    },
    titleGridItem: {
        width: [6, 10, 10, 5, 6],
    },
    title: {
        variant: "h3",
    },
};

const styles = rfqJobQuoteDetailsHeaderStyles;

const RfqJobQuoteDetailsHeader: React.FC<Props> = ({
    jobQuoteState,
    history,
    checkoutShippingPageUrl,
    qtyOrderedByJobQuoteLineId,
    generateOrder,
}) => {
    const jobQuote = jobQuoteState.value;
    if (!jobQuote) {
        return null;
    }

    const generateOrderClickHandler = () => {
        generateOrder({
            jobQuote,
            onSuccess: result => {
                redirectToCheckout(result.id);
            },
            onComplete(resultProps) {
                if (resultProps.apiResult) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(resultProps.apiResult);
                }
            },
        });
    };

    const redirectToCheckout = (cartId: string) => {
        if (checkoutShippingPageUrl) {
            history.push(`${checkoutShippingPageUrl}?cartId=${cartId}`);
        }
    };

    const expirationDateIsGreaterThanCurrentDate = () => {
        if (!jobQuote || !jobQuote.expirationDate) {
            return true;
        }

        const expirationDate = jobQuote.expirationDate;
        const currentDate = new Date();

        expirationDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        return expirationDate >= currentDate;
    };

    const hasLineWithQuantity = () => {
        return Object.keys(qtyOrderedByJobQuoteLineId).some(key => {
            const qty = qtyOrderedByJobQuoteLineId[key];
            return qty !== undefined && qty > 0;
        });
    };

    const hasLineWithLimitExceeding = () => {
        return jobQuote.jobQuoteLineCollection?.some(jobQuoteLine => {
            const qty = qtyOrderedByJobQuoteLineId[jobQuoteLine.id];
            const qtyRemaining = jobQuoteLine.qtyOrdered! - (jobQuoteLine.qtySold || 0);
            return qty !== undefined && qty > 0 && qty > qtyRemaining;
        });
    };

    return (
        <>
            <GridContainer {...styles.headerGridContainer}>
                <GridItem {...styles.titleGridItem}>
                    <Typography {...styles.title} as="h1">
                        {translate(`Job # ${jobQuote.orderNumber}`)}
                    </Typography>
                </GridItem>
                <GridItem {...styles.buttonGridItem}>
                    {jobQuote.isEditable && !jobQuote.failedToGetRealTimeInventory && (
                        <Button
                            {...styles.generateOrderButton}
                            disabled={
                                !expirationDateIsGreaterThanCurrentDate() ||
                                !hasLineWithQuantity() ||
                                hasLineWithLimitExceeding()
                            }
                            onClick={generateOrderClickHandler}
                        >
                            {translate("Generate Order")}
                        </Button>
                    )}
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(RfqJobQuoteDetailsHeader)),
    definition: {
        displayName: "Page Header",
        allowedContexts: [RfqJobQuoteDetailsPageContext],
        fieldDefinitions: [],
        group: "RFQ Job Quote Details",
    },
};

export default widgetModule;
