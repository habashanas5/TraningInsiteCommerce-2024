import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import deleteOrder from "@insite/client-framework/Store/Pages/SavedOrderDetails/Handlers/DeleteOrder";
import placeOrder from "@insite/client-framework/Store/Pages/SavedOrderDetails/Handlers/PlaceOrder";
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

import siteMessage from "@insite/client-framework/SiteMessage";
import {
    canAddToListSavedOrder,
    canPlaceSavedOrder,
} from "@insite/client-framework/Store/Pages/SavedOrderDetails/SavedOrderDetailsSelectors";
import SavedOrderDetailsAddressModal from "@insite/content-library/Widgets/SavedOrderDetails/SavedOrderDetailsAddressModal";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    cart: CartModel;
    extendedStyles?: SavedOrderDetailsActionButtonsStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    settingsCollection: getSettingsCollection(state),
    cartPageLink: getPageLinkByPageType(state, "CartPage"),
    savedOrderListPageLink: getPageLinkByPageType(state, "SavedOrderListPage"),
    allowMultipleWishLists: getSettingsCollection(state).wishListSettings.allowMultipleWishLists,
    shipToId: state.context.session.shipToId,
});

const mapDispatchToProps = {
    placeOrder,
    deleteOrder,
    setAddToListModalIsOpen,
    addToWishList,
};

export interface SavedOrderDetailsActionButtonsStyles {
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuProps;
    middleOverflowMenu?: OverflowMenuProps;
    middleHiddenContainer?: HiddenProps;
    printButton?: ButtonPresentationProps;
    continueShoppingButton?: ButtonPresentationProps;
    deleteButton?: ButtonPresentationProps;
    addToListButton?: ButtonPresentationProps;
    placeOrderButton?: ButtonPresentationProps;
    printClickable?: ClickableProps;
    continueShoppingClickable?: ClickableProps;
    deleteClickable?: ClickableProps;
    addToListClickable?: ClickableProps;
    placeOrderClickable?: ClickableProps;
    twoButtonModalStyles?: TwoButtonModalStyles;
}

export const savedOrderDetailsActionButtonsStyles: SavedOrderDetailsActionButtonsStyles = {
    deleteButton: {
        css: css`
            margin-left: 10px;
        `,
        buttonType: "outline",
        variant: "secondary",
    },
    addToListButton: {
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
    placeOrderButton: {
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
        above: "sm",
    },
    middleHiddenContainer: {
        above: "md",
        below: "md",
    },
    middleOverflowMenu: {
        cssOverrides: {
            wrapper: css`
                display: inline;
                margin-left: 20px;
            `,
        },
    },
};

type Props = OwnProps &
    HasHistory &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

const SavedOrderDetailsActionButtons = ({
    cart,
    history,
    cartPageLink,
    savedOrderListPageLink,
    placeOrder,
    deleteOrder,
    extendedStyles,
    toaster,
    allowMultipleWishLists,
    setAddToListModalIsOpen,
    addToWishList,
    shipToId,
}: Props) => {
    const [styles] = useState(() => mergeToNew(savedOrderDetailsActionButtonsStyles, extendedStyles));
    const [confirmationModalIsOpen, setConfirmationModalIsOpen] = React.useState(false);
    const [selectAddressModalIsOpen, setSelectAddressModalIsOpen] = React.useState(false);

    if (!cart || !savedOrderListPageLink || !cartPageLink) {
        return null;
    }

    const printOrOpenPrintAllModal = () => {
        openPrintDialog();
    };

    const addAllToListClickHandler = () => {
        const productInfos = cart
            .cartLines!.filter(cartLine => cartLine.canAddToWishlist)
            .map(cartLine => {
                return {
                    productId: cartLine.productId!,
                    qtyOrdered: cartLine.qtyOrdered!,
                    unitOfMeasure: cartLine.unitOfMeasure ?? "",
                };
            });

        if (!allowMultipleWishLists) {
            addToWishList({
                productInfos,
                onSuccess: () => {
                    toaster.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
                onComplete(resultProps) {
                    if (resultProps.result?.wishList) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.(resultProps.result.wishList);
                    } else if (resultProps.result?.errorMessage) {
                        toaster.addToast({ body: resultProps.result.errorMessage, messageType: "danger" });
                    }
                },
            });
            return;
        }

        setAddToListModalIsOpen({ modalIsOpen: true, productInfos });
    };

    const deleteClickHandler = () => {
        deleteOrder({
            onSuccess: () => {
                toaster.addToast({ body: translate("Order Deleted"), messageType: "success" });
                history.push(savedOrderListPageLink.url);
            },
        });
    };

    const placeOrderClickHandler = () => {
        if (shipToId !== cart.shipTo?.id) {
            setSelectAddressModalIsOpen(true);
            return;
        }

        placeOrder({
            onSuccess: () => {
                history.push(cartPageLink.url);
            },
        });
    };

    const showDeleteModal = () => {
        setConfirmationModalIsOpen(true);
    };

    const printLabel = translate("Print");
    const deleteLabel = translate("Delete Order");
    const placeLabel = translate("Place Order");
    const addToListLabel = translate("Add All to List");

    return (
        <>
            <Hidden {...styles.menuHiddenContainer}>
                <OverflowMenu position="end" {...styles.narrowOverflowMenu}>
                    <Clickable {...styles.printClickable} onClick={printOrOpenPrintAllModal}>
                        {printLabel}
                    </Clickable>
                    <Clickable {...styles.deleteClickable} onClick={showDeleteModal}>
                        {deleteLabel}
                    </Clickable>
                    <Clickable
                        {...styles.addToListClickable}
                        disabled={!canAddToListSavedOrder(cart)}
                        onClick={() => addAllToListClickHandler()}
                    >
                        {addToListLabel}
                    </Clickable>
                    <Clickable
                        {...styles.placeOrderClickable}
                        onClick={placeOrderClickHandler}
                        disabled={!canPlaceSavedOrder(cart)}
                    >
                        {placeLabel}
                    </Clickable>
                </OverflowMenu>
            </Hidden>
            <Hidden {...styles.middleHiddenContainer}>
                <Button
                    {...styles.placeOrderButton}
                    onClick={placeOrderClickHandler}
                    disabled={!canPlaceSavedOrder(cart)}
                >
                    {placeLabel}
                </Button>
                <OverflowMenu position="end" {...styles.middleOverflowMenu}>
                    <Clickable {...styles.printClickable} onClick={printOrOpenPrintAllModal}>
                        {printLabel}
                    </Clickable>
                    <Clickable {...styles.deleteClickable} onClick={showDeleteModal}>
                        {deleteLabel}
                    </Clickable>
                    <Clickable
                        {...styles.addToListClickable}
                        disabled={!canAddToListSavedOrder(cart)}
                        onClick={() => addAllToListClickHandler()}
                    >
                        {addToListLabel}
                    </Clickable>
                </OverflowMenu>
            </Hidden>
            <Hidden {...styles.buttonsHiddenContainer}>
                <Button
                    data-test-selector="savedOrderDetails_print"
                    {...styles.printButton}
                    onClick={printOrOpenPrintAllModal}
                >
                    {printLabel}
                </Button>
                <Button
                    data-test-selector="savedOrderDetails_deleteOrder"
                    {...styles.deleteButton}
                    onClick={showDeleteModal}
                >
                    {deleteLabel}
                </Button>
                <Button
                    data-test-selector="savedOrderDetails_addOrderToList"
                    {...styles.addToListButton}
                    disabled={!canAddToListSavedOrder(cart)}
                    onClick={() => addAllToListClickHandler()}
                >
                    {addToListLabel}
                </Button>
                <Button
                    data-test-selector="savedOrderDetails_placeOrder"
                    {...styles.placeOrderButton}
                    onClick={placeOrderClickHandler}
                    disabled={!canPlaceSavedOrder(cart)}
                >
                    {placeLabel}
                </Button>
            </Hidden>
            <TwoButtonModal
                modalIsOpen={confirmationModalIsOpen}
                headlineText={translate("Delete Order")}
                messageText={translate("Do you want to delete order?")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Delete")}
                submitTestSelector="confirmDeleteSavedOrderButton"
                extendedStyles={styles.twoButtonModalStyles}
                onCancel={() => setConfirmationModalIsOpen(false)}
                onSubmit={deleteClickHandler}
            ></TwoButtonModal>
            <SavedOrderDetailsAddressModal
                isOpen={selectAddressModalIsOpen}
                onClose={() => setSelectAddressModalIsOpen(false)}
            />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withHistory(withToaster(SavedOrderDetailsActionButtons)));
