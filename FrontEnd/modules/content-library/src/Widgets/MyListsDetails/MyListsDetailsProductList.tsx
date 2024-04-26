import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import deleteWishListLine from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/DeleteWishListLine";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import setQuantityAdjustmentModalIsOpen from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetQuantityAdjustmentModalIsOpen";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import updateWishListLine from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateWishListLine";
import translate from "@insite/client-framework/Translate";
import { WishListLineModel, WishListModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal from "@insite/content-library/Components/TwoButtonModal";
import { MyListsDetailsPageContext } from "@insite/content-library/Pages/MyListsDetailsPage";
import MyListsDetailsProductListLine from "@insite/content-library/Widgets/MyListsDetails/MyListsDetailsProductListLine";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Move from "@insite/mobius/Icons/Move";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import { PaginationPresentationProps } from "@insite/mobius/Pagination";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { SortableContainer, SortableElement, SortableHandle, SortEvent } from "react-sortable-hoc";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    wishListDataView: getWishListState(state, state.pages.myListDetails.wishListId),
    wishListLinesDataView: getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter),
    productInfosByWishListLineId: state.pages.myListDetails.productInfosByWishListLineId,
    loadWishListLinesParameter: state.pages.myListDetails.loadWishListLinesParameter,
    editingSortOrder: state.pages.myListDetails.editingSortOrder,
    quantityAdjustmentModalIsOpen: state.pages.myListDetails.quantityAdjustmentModalIsOpen,
});

const mapDispatchToProps = {
    updateLoadWishListLinesParameter,
    loadWishListLines,
    updateWishListLine,
    deleteWishListLine,
    setQuantityAdjustmentModalIsOpen,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsDetailsProductListStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    messageText?: TypographyPresentationProps;
    container?: GridContainerProps;
    lineGridItem?: GridItemProps;
    sortOrderWrapper?: InjectableCss;
    dragHandleIcon?: IconPresentationProps;
    sortOrderTextField?: TextFieldProps;
    editNotesModal?: ModalPresentationProps;
    paginationContainer?: GridContainerProps;
    paginationGridItem?: GridItemProps;
    pagination?: PaginationPresentationProps;
    notesTextArea?: TextAreaProps;
    editNotesModalButtonsWrapper?: InjectableCss;
    editNotesModalDeleteButton?: ButtonPresentationProps;
    editNotesModalCancelButton?: ButtonPresentationProps;
    editNotesModalSubmitButton?: ButtonPresentationProps;
    quantityAdjustmentModal?: ModalPresentationProps;
    quantityAdjustedText?: TypographyPresentationProps;
}

export const productListStyles: MyListsDetailsProductListStyles = {
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    messageText: {
        variant: "h4",
        css: css`
            display: block;
            margin: auto;
        `,
    },
    container: {
        gap: 0,
        css: css`
            /* Note: below line is to prevent a weird behavior where chrome wants to print anything that will fit
            * comprehensively on a single page on that page, which means the product list appears on page 2
            when rendering a common 8-item list with no notes. That's not ideal, so we're arbitrarily making
            the component large enough that it won't fit on a single page. */
            @media print {
                padding-bottom: 120px;
            }
            border-top: 1px lightgray solid;
        `,
    },
    lineGridItem: {
        width: 12,
        css: css`
            border-bottom: 1px lightgray solid;
            padding: 20px 0;
        `,
    },
    sortOrderWrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 60px;
            margin-right: 12px;
        `,
    },
    dragHandleIcon: {
        src: Move,
        size: 22,
        css: css`
            cursor: move;
        `,
    },
    sortOrderTextField: {
        labelPosition: "top",
        labelProps: {
            size: 9,
            transform: "uppercase",
            css: css`
                min-height: auto;
                text-align: center;
            `,
        },
        cssOverrides: {
            formInputWrapper: css`
                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                    /* ISC-11023 deal with this. */
                    /* stylelint-disable-next-line */
                    -webkit-appearance: none;
                    margin: 0;
                }
            `,
            formField: css`
                margin-top: 10px;
            `,
            inputSelect: css`
                text-align: center;

                /* ISC-11023 deal with this. */
                /* stylelint-disable-next-line */
                -moz-appearance: textfield;
            `,
        },
    },
    editNotesModal: { sizeVariant: "small" },
    editNotesModalButtonsWrapper: {
        css: css`
            @media print {
                display: none;
            }
            margin-top: 30px;
            text-align: right;
        `,
    },
    editNotesModalDeleteButton: { variant: "secondary" },
    editNotesModalCancelButton: {
        variant: "secondary",
        css: css`
            margin-left: 10px;
        `,
    },
    editNotesModalSubmitButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    quantityAdjustmentModal: { sizeVariant: "medium" },
};

const styles = productListStyles;

const MyListsDetailsProductList: React.FC<Props> = ({
    wishListDataView,
    wishListLinesDataView,
    productInfosByWishListLineId,
    loadWishListLinesParameter,
    editingSortOrder,
    quantityAdjustmentModalIsOpen,
    updateWishListLine,
    deleteWishListLine,
    setQuantityAdjustmentModalIsOpen,
}) => {
    if (
        !wishListDataView.value ||
        !wishListLinesDataView.value ||
        wishListLinesDataView.isLoading ||
        !wishListLinesDataView.pagination
    ) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        );
    }

    const wishList = wishListDataView.value;
    const wishListLines = wishListLinesDataView.value;

    const [wishListLineToAction, setWishListLineToAction] = React.useState<WishListLineModel | null>(null);
    const [deleteLineModalIsOpen, setDeleteLineModalIsOpen] = React.useState(false);
    const deleteCancelHandler = () => {
        setDeleteLineModalIsOpen(false);
    };

    const deleteSubmitHandler = () => {
        if (!wishListLineToAction) {
            return;
        }

        deleteWishListLine({
            wishListId: wishList.id,
            wishListLineId: wishListLineToAction.id,
            onSuccess: () => {
                setDeleteLineModalIsOpen(false);
            },
            onComplete() {
                // "this" is targeting the object being created, not the parent SFC
                // eslint-disable-next-line react/no-this-in-sfc
                this.onSuccess?.();
            },
        });
    };

    const deleteClickHandler = (wishListLine: WishListLineModel) => {
        setWishListLineToAction(wishListLine);
        setDeleteLineModalIsOpen(true);
    };

    const [editNotesModalIsOpen, setEditNotesModalIsOpen] = React.useState(false);
    const editNotesModalCancelHandler = () => {
        setEditNotesModalIsOpen(false);
    };

    const editNotesClickHandler = (wishListLine: WishListLineModel) => {
        setWishListLineToAction(wishListLine);
        setEditNotesModalIsOpen(true);
    };

    const editNotesModalSubmitHandler = (notes: string) => {
        const wishListLineToUpdate = { ...wishListLineToAction, notes } as WishListLineModel;
        updateWishListLine({
            wishListId: wishList.id,
            wishListLineId: wishListLineToUpdate.id,
            wishListLine: wishListLineToUpdate,
            skipResettingData: true,
            onSuccess: () => {
                setEditNotesModalIsOpen(false);
            },
            onComplete(resultProps) {
                if (resultProps.result?.wishListLine) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const updateSortOrder = (wishListLine: WishListLineModel, value: number | string) => {
        const sortOrder = parseInt(value.toString() || "1", 10);
        if (wishListLine.sortOrder === sortOrder) {
            return;
        }

        const wishListLineToUpdate = { ...wishListLine, sortOrder };
        updateWishListLine({
            wishListId: wishList.id,
            wishListLineId: wishListLineToUpdate.id,
            wishListLine: wishListLineToUpdate,
        });
    };

    const sortMove = (e: SortEvent) => {
        e.preventDefault();

        let clientY = 0;
        if ((e as any).clientY !== undefined) {
            clientY = (e as any).clientY;
        } else if ((e as any).targetTouches !== undefined) {
            clientY = (e as any).targetTouches[0].clientY;
        } else {
            return;
        }

        if (clientY < 50) {
            scroll(-20);
        } else if (clientY < 100) {
            scroll(-10);
        }

        const bottom = window.innerHeight - clientY;
        if (bottom < 50) {
            scroll(20);
        } else if (bottom < 100) {
            scroll(10);
        }
    };

    const scroll = (step: number) => {
        window.scrollBy(0, step);
    };

    const quantityAdjustmentModalCancelHandler = () => {
        setQuantityAdjustmentModalIsOpen({ modalIsOpen: false });
    };

    if (!wishListLines || wishListLines.length === 0 || Object.keys(productInfosByWishListLineId).length === 0) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <Typography {...styles.messageText} data-test-selector="tst_ListDetail_noItemsMessage">
                    {loadWishListLinesParameter.query
                        ? siteMessage("Lists_NoResultsMessage")
                        : siteMessage("Lists_NoItemsInList")}
                </Typography>
            </StyledWrapper>
        );
    }

    return (
        <>
            <LinesContainer
                wishList={wishList}
                wishListLines={wishListLines}
                productInfosByWishListLineId={productInfosByWishListLineId}
                editingSortOrder={editingSortOrder}
                updateSortOrder={updateSortOrder}
                onDeleteClick={deleteClickHandler}
                onEditNotesClick={editNotesClickHandler}
                useDragHandle={true}
                lockAxis="y"
                lockToContainerEdges={true}
                lockOffset="0%"
                onSortStart={(_, e) => e.preventDefault()}
                onSortMove={sortMove}
                onSortEnd={({ oldIndex, newIndex }) => updateSortOrder(wishListLines[oldIndex], newIndex + 1)}
            />
            <TwoButtonModal
                modalIsOpen={deleteLineModalIsOpen}
                headlineText={translate("Delete List Item")}
                messageText={`${translate("Are you sure you want to delete this item?")}`}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Delete")}
                onCancel={deleteCancelHandler}
                onSubmit={deleteSubmitHandler}
                submitTestSelector="submitDeleteListItem"
            />
            {wishListLineToAction && (
                <Modal
                    {...styles.editNotesModal}
                    headline={translate(`${wishListLineToAction.notes ? "Edit" : "Add"} Notes`)}
                    isOpen={editNotesModalIsOpen}
                    handleClose={editNotesModalCancelHandler}
                >
                    <EditNotesForm
                        wishListLine={wishListLineToAction}
                        onCancel={editNotesModalCancelHandler}
                        onSubmit={editNotesModalSubmitHandler}
                    />
                </Modal>
            )}
            <Modal
                {...styles.quantityAdjustmentModal}
                headline={translate("Quantity Adjustment Has Been Made")}
                isOpen={quantityAdjustmentModalIsOpen}
                handleClose={quantityAdjustmentModalCancelHandler}
            >
                <Typography {...styles.quantityAdjustedText}>{siteMessage("Lists_QuantitiesAdjusted")}</Typography>
            </Modal>
        </>
    );
};

const DragHandle = SortableHandle(() => <Icon {...styles.dragHandleIcon} />);

interface LineItemProps {
    wishList: WishListModel;
    wishListLine: WishListLineModel;
    productInfo?: ProductInfo;
    editingSortOrder: boolean;
    updateSortOrder: (wishListLine: WishListLineModel, value: number | string) => void;
    onDeleteClick: (wishListLine: WishListLineModel) => void;
    onEditNotesClick: (wishListLine: WishListLineModel) => void;
}

const LineItem = SortableElement(
    ({
        wishList,
        wishListLine,
        productInfo,
        editingSortOrder,
        updateSortOrder,
        onDeleteClick,
        onEditNotesClick,
    }: LineItemProps) => {
        const sortOrderBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
            updateSortOrder(wishListLine, event.target.value);
        };

        const sortOrderKeyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.which === 13) {
                (event.target as any).blur();
            }
        };

        if (!productInfo) {
            return null;
        }

        return (
            <GridItem {...styles.lineGridItem} data-test-selector="lineContainer">
                {editingSortOrder && (
                    <StyledWrapper {...styles.sortOrderWrapper}>
                        <DragHandle />
                        <TextField
                            {...styles.sortOrderTextField}
                            label={translate("Sort Order")}
                            type="number"
                            min={1}
                            defaultValue={wishListLine.sortOrder}
                            onBlur={sortOrderBlurHandler}
                            onKeyPress={sortOrderKeyPressHandler}
                        />
                    </StyledWrapper>
                )}
                <MyListsDetailsProductListLine
                    wishList={wishList}
                    wishListLine={wishListLine}
                    productInfo={productInfo}
                    onDeleteClick={onDeleteClick}
                    onEditNotesClick={onEditNotesClick}
                />
            </GridItem>
        );
    },
);

interface LinesContainerProps {
    wishList: WishListModel;
    wishListLines: WishListLineModel[];
    productInfosByWishListLineId: SafeDictionary<ProductInfo>;
    editingSortOrder: boolean;
    updateSortOrder: (wishListLine: WishListLineModel, value: number | string) => void;
    onDeleteClick: (wishListLine: WishListLineModel) => void;
    onEditNotesClick: (wishListLine: WishListLineModel) => void;
}

const LinesContainer = SortableContainer(
    ({
        wishList,
        wishListLines,
        productInfosByWishListLineId,
        editingSortOrder,
        updateSortOrder,
        onDeleteClick,
        onEditNotesClick,
    }: LinesContainerProps) => (
        <GridContainer {...styles.container} data-test-selector="linesContainer">
            {wishListLines.map((wishListLine, index) => (
                <LineItem
                    key={`${wishListLine.productId}_${wishListLine.selectedUnitOfMeasure}`}
                    index={index}
                    wishList={wishList}
                    wishListLine={wishListLine}
                    productInfo={productInfosByWishListLineId[wishListLine.id]}
                    editingSortOrder={editingSortOrder}
                    updateSortOrder={updateSortOrder}
                    onDeleteClick={onDeleteClick}
                    onEditNotesClick={onEditNotesClick}
                />
            ))}
        </GridContainer>
    ),
);

interface EditNotesFormProps {
    wishListLine: WishListLineModel;
    onCancel: () => void;
    onSubmit: (notes: string) => void;
}

const EditNotesForm: React.FC<EditNotesFormProps> = ({ wishListLine, onCancel, onSubmit }) => {
    const [notes, setNotes] = React.useState(wishListLine.notes);
    const notesChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.target.value.length > 300 ? event.target.value.slice(0, 300) : event.target.value);
    };

    const deleteHandler = () => {
        setNotes("");
        onSubmit("");
    };

    return (
        <>
            <TextArea
                {...styles.notesTextArea}
                value={notes}
                onChange={notesChangeHandler}
                hint={`${300 - notes.length} ${translate("characters left")}`}
            />
            <StyledWrapper {...styles.editNotesModalButtonsWrapper}>
                {wishListLine.notes && (
                    <Button {...styles.editNotesModalDeleteButton} onClick={deleteHandler}>
                        {translate("Delete Note")}
                    </Button>
                )}
                <Button {...styles.editNotesModalCancelButton} onClick={onCancel}>
                    {translate("Cancel")}
                </Button>
                <Button {...styles.editNotesModalSubmitButton} onClick={() => onSubmit(notes)}>
                    {translate(`${wishListLine.notes ? "Save" : "Add Notes"}`)}
                </Button>
            </StyledWrapper>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsDetailsProductList),
    definition: {
        group: "My Lists Details",
        displayName: "Product List",
        allowedContexts: [MyListsDetailsPageContext],
    },
};

export default widgetModule;
