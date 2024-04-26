import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { Dictionary } from "@insite/client-framework/Common/Types";
import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setShareListModalIsOpen from "@insite/client-framework/Store/Components/ShareListModal/Handlers/SetShareListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    canAddWishListLineToCart,
    getWishListLinesDataView,
} from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import addLinesToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddLinesToCart";
import addWishListToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddWishListToCart";
import deleteWishList from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/DeleteWishList";
import deleteWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/DeleteWishListLines";
import exportWishList from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/ExportWishList";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import loadWishLists from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishLists";
import setAllWishListLinesIsSelected from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetAllWishListLinesIsSelected";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import translate from "@insite/client-framework/Translate";
import { CartLineCollectionModel, CartLineModel, WishListLineModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import PrintAllPagesModal from "@insite/content-library/Components/PrintAllPagesModal";
import ScheduleReminderModal, {
    ScheduleReminderModalStyles,
} from "@insite/content-library/Components/ScheduleReminderModal";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { MyListsDetailsPageContext } from "@insite/content-library/Pages/MyListsDetailsPage";
import MyListsEditListForm from "@insite/content-library/Widgets/MyLists/MyListsEditListForm";
import MyListsDetailsCopyListForm from "@insite/content-library/Widgets/MyListsDetails/MyListsDetailsCopyListForm";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import { markForFocusLater } from "@insite/mobius/Overlay/helpers/focusManager";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface State {
    updateListModalIsOpen: boolean;
    deleteListModalIsOpen: boolean;
    deleteListItemsModalIsOpen: boolean;
    copyListModalIsOpen: boolean;
    printAllModalIsOpen: boolean;
    scheduleReminderModalIsOpen: boolean;
    closeCopyListModalOnEsc: boolean;
}

const mapStateToProps = (state: ApplicationState) => ({
    wishList: getWishListState(state, state.pages.myListDetails.wishListId).value,
    wishListLinesDataView: getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter),
    wishListSettings: getSettingsCollection(state).wishListSettings,
    selectedWishListLineIds: state.pages.myListDetails.selectedWishListLineIds,
    myListsPageLink: getPageLinkByPageType(state, "MyListsPage"),
    allowEditingOfWishLists: getSettingsCollection(state).wishListSettings.allowEditingOfWishLists,
    productInfosByWishListLineId: state.pages.myListDetails.productInfosByWishListLineId,
});

const mapDispatchToProps = {
    addWishListToCart,
    addLinesToCart,
    deleteWishList,
    deleteWishListLines,
    loadWishLists,
    loadWishListLines: makeHandlerChainAwaitable(loadWishListLines),
    updateLoadWishListLinesParameter,
    setShareListModalIsOpen,
    setAllWishListLinesIsSelected,
    exportWishList,
};

type Props = WidgetProps & HasHistory & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface MyListsDetailsActionStyles {
    wrapper?: InjectableCss;
    buttonWrapper?: InjectableCss;
    wideHidden?: HiddenProps;
    nameText?: TypographyProps;
    overflowMenu?: OverflowMenuPresentationProps;
    narrowHidden?: HiddenProps;
    printButton?: ButtonPresentationProps;
    scheduleButton?: ButtonPresentationProps;
    editButton?: ButtonPresentationProps;
    shareButton?: ButtonPresentationProps;
    addItemButton?: ButtonPresentationProps;
    removeSelectedButton?: ButtonPresentationProps;
    addListButton?: ButtonPresentationProps;
    editListModal?: ModalPresentationProps;
    deleteListModal?: TwoButtonModalStyles;
    deleteListItemsModal?: TwoButtonModalStyles;
    printListModal?: TwoButtonModalStyles;
    copyListModal?: ModalPresentationProps;
    scheduleReminderModal?: ScheduleReminderModalStyles;
}

export const actionStyles: MyListsDetailsActionStyles = {
    wrapper: {
        css: css`
            display: flex;
            justify-content: space-between;
        `,
    },
    buttonWrapper: {
        css: css`
            display: flex;
            flex-wrap: nowrap;
            align-items: flex-start;
        `,
    },
    wideHidden: {
        below: "lg",
        css: css`
            display: flex;
            flex-wrap: nowrap;
        `,
    },
    nameText: {
        variant: "h3",
        as: "h1",
        ellipsis: true,
    },
    narrowHidden: {
        above: "md",
    },
    printButton: {
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    scheduleButton: {
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    editButton: {
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    shareButton: {
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    addItemButton: {
        typographyProps: {
            weight: "bold",
            css: css`
                white-space: nowrap;
            `,
        },
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    removeSelectedButton: {
        typographyProps: {
            weight: "bold",
            css: css`
                white-space: nowrap;
            `,
        },
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "tertiary",
    },
    addListButton: {
        typographyProps: {
            weight: "bold",
            css: css`
                white-space: nowrap;
            `,
        },
        css: css`
            padding: 0 15px;
        `,
    },
    editListModal: {
        sizeVariant: "small",
    },
    copyListModal: {
        sizeVariant: "small",
        cssOverrides: {
            modalBody: css`
                overflow: visible;
            `,
        },
    },
};

const styles = actionStyles;

class MyListsDetailsActions extends React.Component<Props, State> {
    static contextType = ToasterContext;
    context!: React.ContextType<typeof ToasterContext>;

    constructor(props: Props) {
        super(props);
        this.state = {
            updateListModalIsOpen: false,
            printAllModalIsOpen: false,
            deleteListModalIsOpen: false,
            deleteListItemsModalIsOpen: false,
            copyListModalIsOpen: false,
            scheduleReminderModalIsOpen: false,
            closeCopyListModalOnEsc: true,
        };
    }

    displayToast(message: React.ReactNode) {
        this.context.addToast({ body: message, messageType: "success" });
    }

    linesSelected() {
        return this.props.selectedWishListLineIds.length > 0;
    }

    enableAddToCart() {
        const lines = this.props.wishListLinesDataView.value;
        return (
            this.props.wishList?.canAddToCart &&
            lines?.some(o => canAddWishListLineToCart(o, this.props.productInfosByWishListLineId)) &&
            this.allQuantitiesAreValid(lines)
        );
    }

    allQuantitiesAreValid(wishListLines: WishListLineModel[]): boolean {
        return wishListLines
            .filter(
                o =>
                    this.props.selectedWishListLineIds.length === 0 ||
                    this.props.selectedWishListLineIds.indexOf(o.id) > -1,
            )
            .every(o => o.qtyOrdered && parseFloat(o.qtyOrdered.toString()) > 0);
    }

    editClickHandler = () => {
        this.setState({ updateListModalIsOpen: true });
    };

    shareClickHandler = () => {
        this.props.setShareListModalIsOpen({ modalIsOpen: true, wishListId: this.props.wishList?.id });
    };

    printOrOpenPrintAllModal = () => {
        const { wishListLinesDataView } = this.props;
        if (!wishListLinesDataView.value || !wishListLinesDataView.pagination) {
            return null;
        }

        const {
            pagination: { totalItemCount, pageSize },
        } = wishListLinesDataView;
        if (pageSize >= totalItemCount) {
            openPrintDialog();
        } else {
            this.setState({ printAllModalIsOpen: true });
        }
    };

    closePrintModal = () => {
        this.setState({ printAllModalIsOpen: false });
    };

    editCloseHandler = () => {
        this.setState({ updateListModalIsOpen: false });
    };

    addToCartClickHandler = (e: any) => {
        e.preventDefault();
        if (!this.props.wishList || !this.props.wishListLinesDataView.value) {
            return;
        }

        if (this.linesSelected()) {
            const selectedLines = this.props.wishListLinesDataView.value.filter(
                o => this.props.selectedWishListLineIds.indexOf(o.id) > -1,
            );
            const linesToAdd = selectedLines.filter(
                o =>
                    o.quoteRequired ||
                    o.allowZeroPricing ||
                    this.props.productInfosByWishListLineId[o.id]?.pricing?.unitNetPrice !== 0,
            );

            if (linesToAdd.length === 0) {
                this.context.addToast({ body: siteMessage("Cart_InvalidPrice"), messageType: "danger" });
                return;
            }

            this.props.addLinesToCart({
                apiParameter: {
                    cartId: API_URL_CURRENT_FRAGMENT,
                    cartLineCollection: {
                        cartLines: linesToAdd.map(o => o as any as CartLineModel),
                    } as CartLineCollectionModel,
                },
                onSuccess: () => {
                    this.onAddToCartSuccess({
                        notAllAddedToCart: linesToAdd.length !== selectedLines.length,
                    } as CartLineCollectionModel);
                },
                onComplete(resultProps) {
                    if (resultProps.apiResult) {
                        this.onSuccess?.();
                    }
                },
            });
        } else {
            const changedSharedListLinesQuantities: Dictionary<number> = {};
            for (const wishListLineId in this.props.productInfosByWishListLineId) {
                changedSharedListLinesQuantities[wishListLineId] =
                    this.props.productInfosByWishListLineId[wishListLineId]!.qtyOrdered;
            }

            this.props.addWishListToCart({
                apiParameter: {
                    wishListId: this.props.wishList.id,
                    changedSharedListLinesQuantities,
                },
                onSuccess: this.onAddToCartSuccess,
                onComplete(resultProps) {
                    if (resultProps.apiResult) {
                        this.onSuccess?.(resultProps.apiResult);
                    }
                },
            });
        }
    };

    onAddToCartSuccess = (apiResult?: CartLineCollectionModel) => {
        this.displayToast(
            apiResult?.notAllAddedToCart
                ? siteMessage("Lists_Items_Not_All_Added_To_Cart")
                : siteMessage("Cart_AllProductsAddedToCart"),
        );
    };

    removeSelectedClickHandler = () => {
        this.setState({ deleteListItemsModalIsOpen: true });
    };

    removeSelectedCancelHandler = () => {
        this.setState({ deleteListItemsModalIsOpen: false });
    };

    removeSelectedSubmitHandler = () => {
        if (!this.props.wishList || !this.props.wishListLinesDataView.value) {
            return;
        }

        this.setState({ deleteListItemsModalIsOpen: false });
        const wishListLineIds = this.props.wishListLinesDataView.value
            .filter(o => this.props.selectedWishListLineIds.indexOf(o.id) > -1)
            .map(o => o.id);
        this.props.deleteWishListLines({
            wishListId: this.props.wishList.id,
            wishListLineIds,
            onSuccess: this.onRemoveSelectedSuccess,
            onComplete() {
                this.onSuccess?.();
            },
        });
    };

    onRemoveSelectedSuccess = () => {
        this.displayToast(translate(`Item${this.props.selectedWishListLineIds.length > 1 ? "s" : ""} Deleted`));
        this.props.setAllWishListLinesIsSelected({ isSelected: false });
    };

    deleteClickHandler = () => {
        this.setState({ deleteListModalIsOpen: true });
    };

    deleteCancelHandler = () => {
        this.setState({ deleteListModalIsOpen: false });
    };

    deleteSubmitHandler = () => {
        if (!this.props.wishList) {
            return;
        }

        this.setState({ deleteListModalIsOpen: false });
        this.props.myListsPageLink && this.props.history.push(this.props.myListsPageLink.url);
        this.props.deleteWishList({
            wishListId: this.props.wishList.id,
            onSuccess: this.onDeleteSuccess,
            onComplete() {
                this.onSuccess?.();
            },
        });
    };

    onDeleteSuccess = () => {
        this.displayToast(translate("List Deleted"));
    };

    copyClickHandler = () => {
        this.props.loadWishLists();
        this.setState({ copyListModalIsOpen: true });
    };

    exportClickHandler = () => {
        if (!this.props.wishList) {
            return;
        }

        this.props.exportWishList({
            wishListId: this.props.wishList.id,
        });
    };

    copyCancelHandler = () => {
        this.setState({ copyListModalIsOpen: false });
    };

    copySubmitHandler = () => {
        this.setState({ copyListModalIsOpen: false });
    };

    disableCloseCopyListModalOnEsc = () => {
        this.setState({ closeCopyListModalOnEsc: false });
    };

    enableCloseCopyListModalOnEsc = () => {
        this.setState({ closeCopyListModalOnEsc: true });
    };

    scheduleReminderClickHandler = () => {
        this.setState({ scheduleReminderModalIsOpen: true });
    };

    closeScheduleReminderModalHandler = () => {
        this.setState({ scheduleReminderModalIsOpen: false });
    };

    render() {
        const { wishList, wishListSettings, wishListLinesDataView, allowEditingOfWishLists } = this.props;
        if (!wishList) {
            return null;
        }
        const showEdit = wishList.allowEdit || !wishList.isSharedList;
        const showShare =
            !wishList.isSharedList && wishListSettings.allowMultipleWishLists && wishListSettings.allowListSharing;
        const showRemoveSelected = (wishList.allowEdit || !wishList.isSharedList) && this.linesSelected();
        const showSchedule = wishListSettings.enableWishListReminders;
        const showAddToCart = (wishListLinesDataView.value?.length || 0) > 0;
        const showCopy = wishListSettings.allowMultipleWishLists && showAddToCart;
        const addListToCartButtonText = this.linesSelected()
            ? translate("Add Selected to Cart")
            : translate("Add List to Cart");
        const scheduleButtonText = wishList.schedule ? translate("Edit Reminder") : translate("Schedule Reminder");
        const showDelete = allowEditingOfWishLists && !wishList.isSharedList;

        return (
            <StyledWrapper {...styles.wrapper}>
                <Typography {...styles.nameText} data-test-selector="listName">
                    {wishList.name}
                </Typography>
                <StyledWrapper {...styles.buttonWrapper} data-test-selector="menuWrapper">
                    <Hidden {...styles.narrowHidden}>
                        <OverflowMenu position="end" onOpen={markForFocusLater} {...styles.overflowMenu}>
                            {showAddToCart ? (
                                <Clickable onClick={this.addToCartClickHandler}>{addListToCartButtonText}</Clickable>
                            ) : null}
                            {showRemoveSelected ? (
                                <Clickable onClick={this.removeSelectedClickHandler}>
                                    {translate("Remove Selected")}
                                </Clickable>
                            ) : null}
                            {showShare ? (
                                <Clickable onClick={this.shareClickHandler}>{translate("Share")}</Clickable>
                            ) : null}
                            <Clickable onClick={this.printOrOpenPrintAllModal}>{translate("Print")}</Clickable>
                            {showEdit ? (
                                <Clickable onClick={this.editClickHandler}>{translate("Edit")}</Clickable>
                            ) : null}
                            {showSchedule ? (
                                <Clickable onClick={this.scheduleReminderClickHandler}>{scheduleButtonText}</Clickable>
                            ) : null}
                            {showCopy ? (
                                <Clickable onClick={this.copyClickHandler}>{translate("Copy")}</Clickable>
                            ) : null}
                            <Clickable onClick={this.exportClickHandler}>{translate("Export")}</Clickable>
                            {showDelete ? (
                                <Clickable onClick={this.deleteClickHandler}>{translate("Delete")}</Clickable>
                            ) : null}
                        </OverflowMenu>
                    </Hidden>
                    <Hidden {...styles.wideHidden} data-test-selector="wideHidden">
                        <OverflowMenu onOpen={markForFocusLater} {...styles.overflowMenu}>
                            {showCopy ? (
                                <Clickable onClick={this.copyClickHandler} data-test-selector="copyList">
                                    {translate("Copy")}
                                </Clickable>
                            ) : null}
                            <Clickable onClick={this.exportClickHandler} data-test-selector="exportList">
                                {translate("Export")}
                            </Clickable>
                            {showDelete ? (
                                <Clickable onClick={this.deleteClickHandler} data-test-selector="deleteList">
                                    {translate("Delete")}
                                </Clickable>
                            ) : null}
                        </OverflowMenu>
                        <Button {...styles.printButton} onClick={this.printOrOpenPrintAllModal}>
                            {translate("Print")}
                        </Button>
                        {showSchedule ? (
                            <Button {...styles.scheduleButton} onClick={this.scheduleReminderClickHandler}>
                                {scheduleButtonText}
                            </Button>
                        ) : null}
                        {showEdit ? (
                            <Button
                                {...styles.editButton}
                                onClick={this.editClickHandler}
                                data-test-selector="editList"
                            >
                                {translate("Edit")}
                            </Button>
                        ) : null}
                        {showShare ? (
                            <Button
                                {...styles.shareButton}
                                onClick={this.shareClickHandler}
                                data-test-selector="shareList"
                            >
                                {translate("Share")}
                            </Button>
                        ) : null}
                        {showRemoveSelected ? (
                            <Button
                                {...styles.removeSelectedButton}
                                onClick={this.removeSelectedClickHandler}
                                data-test-selector="tst_ListDetail_removeSelected"
                            >
                                {translate("Remove Selected")}
                            </Button>
                        ) : null}
                        <Button
                            disabled={!this.enableAddToCart() || !showAddToCart}
                            {...styles.addListButton}
                            onClick={this.addToCartClickHandler}
                            data-test-selector="tst_ListDetail_addToCart"
                        >
                            {addListToCartButtonText}
                        </Button>
                    </Hidden>
                </StyledWrapper>
                <Modal
                    headline={translate("Edit List Detail")}
                    {...styles.editListModal}
                    isOpen={this.state.updateListModalIsOpen}
                    handleClose={this.editCloseHandler}
                >
                    <MyListsEditListForm
                        wishList={wishList}
                        onCancel={this.editCloseHandler}
                        onSubmit={this.editCloseHandler}
                    ></MyListsEditListForm>
                </Modal>
                <TwoButtonModal
                    headlineText={translate("Delete List")}
                    {...styles.deleteListModal}
                    modalIsOpen={this.state.deleteListModalIsOpen}
                    messageText={`${translate("Are you sure you want to delete")} ${wishList.name}?`}
                    cancelButtonText={translate("Cancel")}
                    submitButtonText={translate("Delete")}
                    onCancel={this.deleteCancelHandler}
                    onSubmit={this.deleteSubmitHandler}
                    submitTestSelector="submitDeleteList"
                ></TwoButtonModal>
                <TwoButtonModal
                    headlineText={translate(`Delete Item${this.props.selectedWishListLineIds.length > 1 ? "s" : ""}`)}
                    {...styles.deleteListItemsModal}
                    modalIsOpen={this.state.deleteListItemsModalIsOpen}
                    messageText={translate(
                        `Are you sure you want to delete ${
                            this.props.selectedWishListLineIds.length > 1 ? "these items" : "this item"
                        }?`,
                    )}
                    cancelButtonText={translate("Cancel")}
                    submitButtonText={translate("Delete")}
                    onCancel={this.removeSelectedCancelHandler}
                    onSubmit={this.removeSelectedSubmitHandler}
                    submitTestSelector="submitDeleteListItems"
                ></TwoButtonModal>
                {wishListLinesDataView.value && (
                    <PrintAllPagesModal
                        isOpen={this.state.printAllModalIsOpen}
                        handleClose={this.closePrintModal}
                        updateParameterFunction={pageSize =>
                            this.props.updateLoadWishListLinesParameter({ wishListId: wishList.id, pageSize })
                        }
                        awaitableLoader={this.props.loadWishListLines}
                        initialPageSize={
                            wishListLinesDataView.value ? wishListLinesDataView.pagination?.pageSize || 8 : 8
                        }
                        reloading={false}
                        lineCollection={{
                            pagination: wishListLinesDataView.value ? wishListLinesDataView?.pagination || null : null,
                        }}
                        styles={styles.printListModal}
                    />
                )}
                <Modal
                    headline={translate("Copy List")}
                    isOpen={this.state.copyListModalIsOpen}
                    handleClose={this.copyCancelHandler}
                    closeOnEsc={this.state.closeCopyListModalOnEsc}
                    {...styles.copyListModal}
                >
                    <MyListsDetailsCopyListForm
                        onCancel={this.copyCancelHandler}
                        onSubmit={this.copySubmitHandler}
                        enableCloseCopyListModalOnEsc={this.enableCloseCopyListModalOnEsc}
                        disableCloseCopyListModalOnEsc={this.disableCloseCopyListModalOnEsc}
                    ></MyListsDetailsCopyListForm>
                </Modal>
                <ScheduleReminderModal
                    wishList={wishList}
                    isOpen={this.state.scheduleReminderModalIsOpen}
                    handleClose={this.closeScheduleReminderModalHandler}
                    extendedStyles={styles.scheduleReminderModal}
                />
            </StyledWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(MyListsDetailsActions)),
    definition: {
        group: "My Lists Details",
        displayName: "Actions",
        allowedContexts: [MyListsDetailsPageContext],
    },
};

export default widgetModule;
