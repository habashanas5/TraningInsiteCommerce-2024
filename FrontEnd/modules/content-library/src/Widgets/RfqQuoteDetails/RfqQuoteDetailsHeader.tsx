import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import acceptJobQuote from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/AcceptJobQuote";
import declineQuote from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/DeclineQuote";
import deleteQuote from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/DeleteQuote";
import submitQuote from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/SubmitQuote";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { RfqQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqQuoteDetailsPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC, useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
    rfqMyQuotesPageUrl: getPageLinkByPageType(state, "RfqMyQuotesPage")?.url,
    checkoutShippingPageUrl: getPageLinkByPageType(state, "CheckoutShippingPage")?.url,
    rfqJobQuotesPageUrl: getPageLinkByPageType(state, "RfqJobQuotesPage")?.url,
    cartState: getCurrentCartState(state),
});

const mapDispatchToProps = {
    deleteQuote,
    submitQuote,
    declineQuote,
    acceptJobQuote,
};

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqQuoteDetailsHeaderStyles {
    headerGridContainer?: GridContainerProps;
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuProps;
    title: TypographyProps;
    titleGridItem: GridItemProps;
    deleteQuoteButton?: ButtonPresentationProps;
    submitQuoteButton?: ButtonPresentationProps;
    declineQuoteButton?: ButtonPresentationProps;
    acceptQuoteButton?: ButtonPresentationProps;
    printButton?: ButtonPresentationProps;
    buttonGridItem?: GridItemProps;
    printClickable?: ClickableProps;
    deleteQuoteClickable?: ClickableProps;
    submitQuoteClickable?: ClickableProps;
    declineQuoteClickable?: ClickableProps;
    acceptQuoteClickable?: ClickableProps;
    deleteQuoteModal?: TwoButtonModalStyles;
    cartNotificationModal?: TwoButtonModalStyles;
}

export const rfqQuoteDetailsHeaderStyles: RfqQuoteDetailsHeaderStyles = {
    headerGridContainer: {
        gap: 10,
    },
    deleteQuoteButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    submitQuoteButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    declineQuoteButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    acceptQuoteButton: {
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
        width: [2, 2, 2, 7, 6],
    },
    titleGridItem: {
        width: [10, 10, 10, 5, 6],
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

const styles = rfqQuoteDetailsHeaderStyles;

const RfqQuoteDetailsHeader: FC<Props> = ({
    quoteState,
    history,
    rfqMyQuotesPageUrl,
    checkoutShippingPageUrl,
    rfqJobQuotesPageUrl,
    cartState,
    deleteQuote,
    submitQuote,
    declineQuote,
    acceptJobQuote,
}) => {
    const toasterContext = useContext(ToasterContext);
    const [deleteQuoteModalIsOpen, setDeleteQuoteModalIsOpen] = useState(false);
    const [cartNotificationModalIsOpen, setCartNotificationModalIsOpen] = useState(false);

    if (!quoteState.value) {
        return null;
    }

    const quote = quoteState.value;

    const deleteQuoteClickHandler = () => {
        setDeleteQuoteModalIsOpen(true);
    };

    const submitDeleteQuoteHandler = () => {
        deleteQuote({
            quoteId: quote.id,
            onSuccess: () => {
                toasterContext.addToast({ body: "Quote deleted", messageType: "success" });
                redirectToMyQuotes();
            },
            onComplete() {
                // "this" is targeting the object being created, not the parent SFC
                // eslint-disable-next-line react/no-this-in-sfc
                this.onSuccess?.();
            },
        });
    };

    const cancelDeleteQuoteHandler = () => {
        setDeleteQuoteModalIsOpen(false);
    };

    const submitCartNotificationHandler = () => {
        redirectToCheckout();
    };

    const cancelCartNotificationHandler = () => {
        setCartNotificationModalIsOpen(false);
    };

    const submitQuoteClickHandler = () => {
        submitQuote({
            quote,
            onSuccess: () => {
                toasterContext.addToast({ body: "Quote submitted", messageType: "success" });
                redirectToMyQuotes();
            },
            onComplete(resultProps) {
                if (resultProps.apiResult) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const declineQuoteClickHandler = () => {
        declineQuote({
            quote,
            onSuccess: () => {
                toasterContext.addToast({ body: "Quote declined", messageType: "success" });
                redirectToMyQuotes();
            },
            onComplete(resultProps) {
                if (resultProps.apiResult) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const acceptQuoteClickHandler = () => {
        if (quote.isJobQuote) {
            acceptJobQuote({
                quote,
                onSuccess: () => {
                    toasterContext.addToast({ body: "Quote accepted", messageType: "success" });
                    redirectToJobQuotes();
                },
                onComplete(resultProps) {
                    if (resultProps.apiResult) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.();
                    }
                },
            });
        } else if (cartState.value?.lineCount === 0) {
            redirectToCheckout();
        } else {
            setCartNotificationModalIsOpen(true);
        }
    };

    const redirectToMyQuotes = () => {
        if (rfqMyQuotesPageUrl) {
            history.push(rfqMyQuotesPageUrl);
        }
    };

    const redirectToCheckout = () => {
        if (checkoutShippingPageUrl) {
            history.push(`${checkoutShippingPageUrl}?cartId=${quote.id}`);
        }
    };

    const redirectToJobQuotes = () => {
        if (rfqJobQuotesPageUrl) {
            history.push(rfqJobQuotesPageUrl);
        }
    };

    const expirationDateIsGreaterThanCurrentDate = () => {
        if (!quote || !quote.expirationDate) {
            return true;
        }

        const expirationDate = new Date(quote.expirationDate.toString());
        const currentDate = new Date();

        expirationDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        return expirationDate >= currentDate;
    };

    const quoteType = quote.isJobQuote ? "Job Quote" : "Sales Quote";
    const printLabel = translate("Print");
    const deleteQuoteLabel = translate(`Delete ${quoteType}`);
    const submitQuoteLabel = translate(`Submit ${quoteType}`);
    const declineQuoteLabel = translate(`Decline ${quoteType}`);
    const acceptQuoteLabel = translate(`Accept ${quoteType}`);
    const canBeSubmittedOrDeleted = quote.isSalesperson && quote.isEditable;
    const expirationDateIsValid = expirationDateIsGreaterThanCurrentDate();
    const canBeDeclined = !quote.isSalesperson && quote.status === "QuoteProposed" && expirationDateIsValid;
    const canBeAccepted =
        !quote.failedToGetRealTimeInventory &&
        !quote.isSalesperson &&
        (quote.status === "QuoteProposed" || quote.status === "AwaitingApproval") &&
        expirationDateIsValid;

    return (
        <>
            <GridContainer {...styles.headerGridContainer}>
                <GridItem {...styles.titleGridItem}>
                    <Typography {...styles.title}>{`${translate(quoteType)} ${quote.quoteNumber}`}</Typography>
                </GridItem>
                <GridItem {...styles.buttonGridItem}>
                    <Hidden {...styles.menuHiddenContainer}>
                        <OverflowMenu {...styles.narrowOverflowMenu}>
                            <Clickable {...styles.printClickable} onClick={openPrintDialog}>
                                {printLabel}
                            </Clickable>
                            {canBeSubmittedOrDeleted && (
                                <>
                                    <Clickable {...styles.deleteQuoteClickable} onClick={deleteQuoteClickHandler}>
                                        {deleteQuoteLabel}
                                    </Clickable>
                                    <Clickable {...styles.submitQuoteClickable} onClick={submitQuoteClickHandler}>
                                        {submitQuoteLabel}
                                    </Clickable>
                                </>
                            )}
                            {canBeDeclined && (
                                <Clickable {...styles.declineQuoteClickable} onClick={declineQuoteClickHandler}>
                                    {declineQuoteLabel}
                                </Clickable>
                            )}
                            {canBeAccepted && (
                                <Clickable {...styles.acceptQuoteClickable} onClick={acceptQuoteClickHandler}>
                                    {acceptQuoteLabel}
                                </Clickable>
                            )}
                        </OverflowMenu>
                    </Hidden>
                    <Hidden {...styles.buttonsHiddenContainer}>
                        <Button {...styles.printButton} onClick={openPrintDialog}>
                            {printLabel}
                        </Button>
                        {canBeSubmittedOrDeleted && (
                            <>
                                <Button {...styles.deleteQuoteButton} onClick={deleteQuoteClickHandler}>
                                    {deleteQuoteLabel}
                                </Button>
                                <Button
                                    {...styles.submitQuoteButton}
                                    onClick={submitQuoteClickHandler}
                                    data-test-selector="rfqQuoteDetails_submitQuote"
                                >
                                    {submitQuoteLabel}
                                </Button>
                            </>
                        )}
                        {canBeDeclined && (
                            <Button
                                {...styles.declineQuoteButton}
                                onClick={declineQuoteClickHandler}
                                data-test-selector="rfqQuoteDetails_declineQuote"
                            >
                                {declineQuoteLabel}
                            </Button>
                        )}
                        {canBeAccepted && (
                            <Button
                                {...styles.acceptQuoteButton}
                                onClick={acceptQuoteClickHandler}
                                data-test-selector="rfqQuoteDetails_acceptQuote"
                            >
                                {acceptQuoteLabel}
                            </Button>
                        )}
                    </Hidden>
                </GridItem>
            </GridContainer>
            <TwoButtonModal
                {...styles.deleteQuoteModal}
                modalIsOpen={deleteQuoteModalIsOpen}
                headlineText={translate("Delete Quote")}
                messageText={siteMessage("Rfq_DeleteQuoteConfirmation")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Delete")}
                onCancel={cancelDeleteQuoteHandler}
                onSubmit={submitDeleteQuoteHandler}
                submitTestSelector="submitDeleteQuote"
            />
            <TwoButtonModal
                {...styles.cartNotificationModal}
                modalIsOpen={cartNotificationModalIsOpen}
                headlineText={translate("Cart Notification")}
                messageText={siteMessage("Rfq_CartNotificationMessage")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Continue")}
                onCancel={cancelCartNotificationHandler}
                onSubmit={submitCartNotificationHandler}
                submitTestSelector="submitCartNotification"
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(RfqQuoteDetailsHeader)),
    definition: {
        displayName: "Page Header",
        allowedContexts: [RfqQuoteDetailsPageContext],
        fieldDefinitions: [],
        group: "RFQ Quote Details",
    },
};

export default widgetModule;
