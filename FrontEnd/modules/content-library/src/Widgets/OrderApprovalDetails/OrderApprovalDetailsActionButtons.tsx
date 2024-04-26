import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import approveOrder from "@insite/client-framework/Store/Pages/OrderApprovalDetails/Handlers/ApproveOrder";
import deleteOrder from "@insite/client-framework/Store/Pages/OrderApprovalDetails/Handlers/DeleteOrder";
import translate from "@insite/client-framework/Translate";
import { CartModel } from "@insite/client-framework/Types/ApiModels";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { useState } from "react";

import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    cart: CartModel;
    extendedStyles?: OrderApprovalDetailsActionButtonsStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    settingsCollection: getSettingsCollection(state),
    account: getCurrentAccountState(state)?.value,
    cartPageLink: getPageLinkByPageType(state, "CartPage"),
    orderApprovalListPageLink: getPageLinkByPageType(state, "OrderApprovalListPage"),
    homeLink: getPageLinkByPageType(state, "HomePage"),
});

const mapDispatchToProps = {
    approveOrder,
    deleteOrder,
};

export interface OrderApprovalDetailsActionButtonsStyles {
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuProps;
    printButton?: ButtonPresentationProps;
    continueShoppingButton?: ButtonPresentationProps;
    deleteButton?: ButtonPresentationProps;
    approveButton?: ButtonPresentationProps;
    printClickable?: ClickableProps;
    continueShoppingClickable?: ClickableProps;
    deleteClickable?: ClickableProps;
    approveClickable?: ClickableProps;
    twoButtonModalStyles?: TwoButtonModalStyles;
}

export const orderApprovalDetailsActionButtonsStyles: OrderApprovalDetailsActionButtonsStyles = {
    deleteButton: {
        css: css`
            margin-left: 10px;
        `,
        buttonType: "outline",
        variant: "secondary",
    },
    continueShoppingButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    approveButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    printButton: {
        variant: "secondary",
        buttonType: "solid",
    },
    buttonsHiddenContainer: {
        below: "lg",
    },
    menuHiddenContainer: {
        above: "md",
    },
};

type Props = OwnProps &
    HasHistory &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

const OrderApprovalDetailsActionButtons = ({
    cart,
    history,
    cartPageLink,
    orderApprovalListPageLink,
    homeLink,
    approveOrder,
    deleteOrder,
    extendedStyles,
    account,
    toaster,
}: Props) => {
    const [styles] = useState(() => mergeToNew(orderApprovalDetailsActionButtonsStyles, extendedStyles));
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = React.useState(false);

    if (!cart || !account || !orderApprovalListPageLink || !cartPageLink) {
        return null;
    }

    const printOrOpenPrintAllModal = () => {
        openPrintDialog();
    };

    const continueShoppingClickHandler = () => {
        if (homeLink) {
            history.push(homeLink.url);
        }
    };

    const deleteClickHandler = () => {
        deleteOrder({
            onSuccess: () => {
                toaster.addToast({ body: translate("Order #{0} Deleted", cart.orderNumber), messageType: "success" });
                history.push(orderApprovalListPageLink.url);
            },
        });
    };

    const approveClickHandler = () => {
        approveOrder({
            onSuccess: () => {
                history.push(cartPageLink.url);
            },
        });
    };

    const printLabel = translate("Print");
    const deleteLabel = translate("Delete Order");
    const approveLabel = translate("Approve Order");
    const continueShoppingLabel = translate("Continue Shopping");

    return (
        <>
            <Hidden {...styles.menuHiddenContainer}>
                <OverflowMenu position="end" {...styles.narrowOverflowMenu}>
                    <Clickable {...styles.printClickable} onClick={printOrOpenPrintAllModal}>
                        {printLabel}
                    </Clickable>
                    {account.canApproveOrders ? (
                        <>
                            <Clickable {...styles.deleteClickable} onClick={() => setConfirmationModalIsOpen(true)}>
                                {deleteLabel}
                            </Clickable>
                            <Clickable {...styles.approveClickable} onClick={approveClickHandler}>
                                {approveLabel}
                            </Clickable>
                        </>
                    ) : (
                        <Clickable {...styles.continueShoppingClickable} onClick={continueShoppingClickHandler}>
                            {continueShoppingLabel}
                        </Clickable>
                    )}
                </OverflowMenu>
            </Hidden>
            <Hidden {...styles.buttonsHiddenContainer}>
                <Button
                    data-test-selector="orderApprovalDetails_print"
                    {...styles.printButton}
                    onClick={printOrOpenPrintAllModal}
                >
                    {printLabel}
                </Button>
                {account.canApproveOrders ? (
                    <>
                        <Button
                            data-test-selector="orderApprovalDetails_deleteOrder"
                            {...styles.deleteButton}
                            onClick={() => setConfirmationModalIsOpen(true)}
                        >
                            {deleteLabel}
                        </Button>
                        <Button
                            data-test-selector="orderApprovalDetails_approveOrder"
                            {...styles.approveButton}
                            onClick={approveClickHandler}
                        >
                            {approveLabel}
                        </Button>
                    </>
                ) : (
                    <Button
                        data-test-selector="orderApprovalDetails_continueShopping"
                        {...styles.continueShoppingButton}
                        onClick={continueShoppingClickHandler}
                    >
                        {continueShoppingLabel}
                    </Button>
                )}
            </Hidden>
            <TwoButtonModal
                modalIsOpen={confirmationModalIsOpen}
                headlineText={translate("Delete Order")}
                messageText={translate("Do you want to delete order #{0}?", cart.orderNumber)}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Delete")}
                submitTestSelector="confirmDeleteOrderButton"
                extendedStyles={styles.twoButtonModalStyles}
                onCancel={() => setConfirmationModalIsOpen(false)}
                onSubmit={deleteClickHandler}
            ></TwoButtonModal>
        </>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withHistory(withToaster(OrderApprovalDetailsActionButtons)));
