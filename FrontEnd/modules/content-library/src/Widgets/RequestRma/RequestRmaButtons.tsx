import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import sendRmaRequest from "@insite/client-framework/Store/Pages/RequestRma/Handlers/SendRmaRequest";
import setReturnNotes from "@insite/client-framework/Store/Pages/RequestRma/Handlers/SetReturnNotes";
import translate from "@insite/client-framework/Translate";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC, useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: RequestRmaButtonsStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    orderDetailsLink: getPageLinkByPageType(state, "OrderDetailsPage"),
    resultMessage: state.pages.requestRma.resultMessage,
    canSendReturnRequest: state.pages.requestRma.canSendReturnRequest,
});

const mapDispatchToProps = {
    sendRmaRequest,
    setReturnNotes,
};

export interface RequestRmaButtonsStyles {
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuProps;
    sendButton?: ButtonPresentationProps;
    cancelButton?: ButtonPresentationProps;
    sendClickable?: ClickableProps;
    cancelClickable?: ClickableProps;
    sendReturnRequestModal?: TwoButtonModalStyles;
}

export const requestRmaButtonsStyles: RequestRmaButtonsStyles = {
    sendButton: {
        variant: "primary",
        css: css`
            margin-left: 10px;
        `,
    },
    cancelButton: {
        buttonType: "outline",
        variant: "secondary",
    },
    buttonsHiddenContainer: {
        below: "lg",
    },
    menuHiddenContainer: {
        above: "md",
    },
};

const styles = requestRmaButtonsStyles;

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasHistory &
    HasToasterContext;

const RequestRmaButtons: FC<Props> = ({
    orderDetailsLink,
    resultMessage,
    canSendReturnRequest,
    history,
    toaster,
    sendRmaRequest,
    setReturnNotes,
}) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    const cancelClickHandlel = () => {
        if (!orderDetailsLink) {
            return;
        }

        setReturnNotes({ returnNotes: "" });
        history.push(`${orderDetailsLink.url}?orderNumber=${order.webOrderNumber}`);
    };

    const modalOpenHandler = () => {
        setModalIsOpen(true);
    };

    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };

    const sendReturnRequestHandler = () => {
        sendRmaRequest({
            orderNumber: order.webOrderNumber || order.erpOrderNumber,
            onSuccess: () => {
                setModalIsOpen(false);
                toaster.addToast({
                    body: siteMessage(resultMessage || translate("Request submitted.")),
                    messageType: "success",
                });
            },
            onError: (errorMessage: string) => {
                toaster.addToast({ body: errorMessage, messageType: "danger" });
            },
            onComplete(resultProps) {
                if (resultProps.apiResult?.successful) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(resultProps.apiResult.result);
                } else if (resultProps.apiResult?.errorMessage) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onError?.(resultProps.apiResult.errorMessage);
                }
            },
        });
    };

    return (
        <>
            <Hidden {...styles.menuHiddenContainer}>
                <OverflowMenu {...styles.narrowOverflowMenu}>
                    <Clickable {...styles.cancelClickable} onClick={cancelClickHandlel}>
                        {translate("Cancel")}
                    </Clickable>
                    <Clickable {...styles.sendClickable} onClick={modalOpenHandler} disabled={!canSendReturnRequest}>
                        {translate("Send Return Request")}
                    </Clickable>
                </OverflowMenu>
            </Hidden>
            <Hidden {...styles.buttonsHiddenContainer}>
                <Button
                    {...styles.cancelButton}
                    onClick={cancelClickHandlel}
                    data-test-selector="requestRmaHeader_cancel"
                >
                    {translate("Cancel")}
                </Button>
                <Button
                    {...styles.sendButton}
                    onClick={modalOpenHandler}
                    disabled={!canSendReturnRequest}
                    data-test-selector="requestRmaHeader_send"
                >
                    {translate("Send Return Request")}
                </Button>
            </Hidden>
            <TwoButtonModal
                {...styles.sendReturnRequestModal}
                modalIsOpen={modalIsOpen}
                dataTestSelector="sendReturnRequestModal"
                headlineText={translate("Send Return Request")}
                messageText={siteMessage("Rma_Terms_Of_Service")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Agree")}
                submitTestSelector="agreeSendReturnRequestButton"
                onCancel={modalCloseHandler}
                onSubmit={sendReturnRequestHandler}
            />
        </>
    );
};

export default withHistory(connect(mapStateToProps, mapDispatchToProps)(withToaster(RequestRmaButtons)));
