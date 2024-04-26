import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { UploadError } from "@insite/client-framework/Store/Components/OrderUpload/Handlers/BatchLoadProducts";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import addToWishList, {
    AddToWishListParameter,
} from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import loadWishListIfNeeded from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListIfNeeded";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import setAllWishListLinesIsSelected from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetAllWishListLinesIsSelected";
import setEditingSortOrder from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetEditingSortOrder";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import translate from "@insite/client-framework/Translate";
import { ProductDto, WishListModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import OrderUpload, { OrderUploadStyles } from "@insite/content-library/Components/OrderUpload";
import OrderUploadErrorsModal, {
    OrderUploadErrorsModalStyles,
} from "@insite/content-library/Components/OrderUploadErrorsModal";
import ProductSelector, { ProductSelectorStyles } from "@insite/content-library/Components/ProductSelector";
import ProductSelectorVariantModal from "@insite/content-library/Components/ProductSelectorVariantModal";
import { MyListsDetailsPageContext } from "@insite/content-library/Pages/MyListsDetailsPage";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import ChevronsUpDown from "@insite/mobius/Icons/ChevronsUpDown";
import PlusCircle from "@insite/mobius/Icons/PlusCircle";
import Search from "@insite/mobius/Icons/Search";
import X from "@insite/mobius/Icons/X";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import debounce from "lodash/debounce";
import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    wishListSettings: getSettingsCollection(state).wishListSettings,
    wishListDataView: getWishListState(state, state.pages.myListDetails.wishListId),
    wishListLinesDataView: getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter),
    loadWishListLinesParameter: state.pages.myListDetails.loadWishListLinesParameter,
    selectedWishListLineIds: state.pages.myListDetails.selectedWishListLineIds,
    editingSortOrder: state.pages.myListDetails.editingSortOrder,
});

const mapDispatchToProps = {
    updateLoadWishListLinesParameter,
    loadWishListIfNeeded,
    loadWishListLines,
    setAllWishListLinesIsSelected,
    addToWishList: makeHandlerChainAwaitable<AddToWishListParameter, WishListModel>(addToWishList),
    setEditingSortOrder,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsDetailsOptionsStyles {
    wrapper?: InjectableCss;
    leftColumnWrapper?: InjectableCss;
    rightColumnWrapper?: InjectableCss;
    container?: GridContainerProps;
    selectAllGridItem?: GridItemProps;
    selectAll?: CheckboxProps;
    editSortOrder?: CheckboxProps;
    searchGridItem?: GridItemProps;
    addItemsGridItem?: GridItemProps;
    addItemsLink?: LinkPresentationProps;
    addItemsGridContainer?: GridContainerProps;
    productSelectorGridItem?: GridItemProps;
    productSelectorStyles?: ProductSelectorStyles;
    uploadItemsGridItem?: GridItemProps;
    uploadItemsLink?: LinkPresentationProps;
    uploadItemsModal?: ModalPresentationProps;
    orderUploadStyles?: OrderUploadStyles;
    orderUploadErrorsModalStyles?: OrderUploadErrorsModalStyles;
    search?: TextFieldProps;
    sortByGridItem?: GridItemProps;
    sortByOverflowMenu?: OverflowMenuProps;
    sortByClickable?: ClickablePresentationProps;
    selectedSortByClickable?: ClickablePresentationProps;
    closeAddItemsToList?: IconProps;
}

export const myListsDetailsOptionsStyles: MyListsDetailsOptionsStyles = {
    wrapper: {
        css: css`
            @media print {
                display: none;
            }
            display: flex;
            margin: 20px 0;
        `,
    },
    leftColumnWrapper: {
        css: css`
            display: flex;
            width: calc(100% - 40px);
        `,
    },
    rightColumnWrapper: {
        css: css`
            display: flex;
            width: 40px;
            justify-content: center;
            margin-top: 30px;
        `,
    },
    container: {
        gap: 10,
        css: css`
            margin-top: 32px;
        `,
    },
    selectAllGridItem: {
        width: [12, 12, 6, 4, 3],
        css: css`
            align-items: center;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        justify-content: space-between;
                    `,
                    css`
                        justify-content: space-between;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
    selectAll: {
        css: css`
            cursor: pointer;
        `,
    },
    editSortOrder: {
        css: css`
            cursor: pointer;
            margin-left: 30px;
        `,
    },
    searchGridItem: { width: [12, 12, 6, 4, 4] },
    addItemsGridItem: {
        width: [12, 12, 6, 4, 5],
        css: css`
            align-items: center;
        `,
    },
    addItemsLink: {
        icon: {
            iconProps: { src: PlusCircle },
        },
        typographyProps: {
            css: css`
                padding-left: 5px;
            `,
        },
    },
    addItemsGridContainer: { gap: 10 },
    productSelectorGridItem: {
        width: [12, 12, 12, 10, 10],
    },
    uploadItemsGridItem: {
        width: [12, 12, 12, 2, 2],
        css: css`
            align-items: flex-start;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    null,
                    null,
                    null,
                    css`
                        padding-top: 30px;
                    `,
                    css`
                        padding-top: 30px;
                    `,
                ])}
        `,
    },
    uploadItemsLink: {
        css: css`
            margin: 15px 0 0;
        `,
    },
    uploadItemsModal: {
        sizeVariant: "large",
        cssOverrides: {
            modalTitle: css`
                padding: 10px 30px;
            `,
            modalContent: css`
                padding: 20px 30px;
            `,
        },
    },
    search: {
        iconProps: { src: Search },
    },
    sortByOverflowMenu: {
        iconProps: { src: ChevronsUpDown },
    },
    selectedSortByClickable: {
        css: css`
            color: ${getColor("primary")};
        `,
    },
    closeAddItemsToList: {
        src: X,
        css: css`
            margin: 8px;
            cursor: pointer;
            align-items: flex-start;
        `,
    },
};

const styles = myListsDetailsOptionsStyles;

const MyListsDetailsOptions = ({
    id,
    wishListSettings,
    wishListDataView,
    wishListLinesDataView,
    loadWishListLinesParameter,
    selectedWishListLineIds,
    editingSortOrder,
    updateLoadWishListLinesParameter,
    loadWishListIfNeeded,
    loadWishListLines,
    setAllWishListLinesIsSelected,
    addToWishList,
    setEditingSortOrder,
}: Props) => {
    const toasterContext = useContext(ToasterContext);
    const [query, setQuery] = useState(loadWishListLinesParameter.query);
    const [addItemsToListIsOpen, setAddItemsToListIsOpen] = useState(false);
    const [uploadItemsModalIsOpen, setUploadItemsModalIsOpen] = useState(false);

    useEffect(() => {
        setQuery("");
    }, []);

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            if (!wishListDataView.value) {
                return;
            }

            updateLoadWishListLinesParameter({ query });
            loadWishListLines();
        }, 200),
        [wishListDataView],
    );

    if (!wishListDataView.value || !wishListSettings) {
        return null;
    }

    const wishList = wishListDataView.value;

    const searchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value || "";
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    const sortByChangeHandler = (sortBy: string) => {
        setEditingSortOrder({ editingSortOrder: false });
        updateLoadWishListLinesParameter({ sort: sortBy });
        loadWishListLines();
    };

    const isAllSelected =
        wishListLinesDataView.value &&
        wishListLinesDataView.value.length > 0 &&
        wishListLinesDataView.value.every(o => selectedWishListLineIds.indexOf(o.id) >= 0);

    const selectAllChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        const allWishListLineIds = value ? wishListLinesDataView?.value?.map(o => o.id) : undefined;
        setAllWishListLinesIsSelected({ isSelected: value, wishListLineIds: allWishListLineIds });
    };

    const editingSortOrderChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setEditingSortOrder({ editingSortOrder: value });
    };

    const addItemsToListClickHandler = () => {
        setAddItemsToListIsOpen(true);
    };

    const selectProductHandler = async (productInfo: ProductInfo) => {
        await addToWishList({ productInfos: [productInfo], selectedWishList: wishList });
        toasterContext.addToast({ body: translate("Item Added"), messageType: "success" });
    };

    const uploadItemsClickHandler = () => {
        setUploadItemsModalIsOpen(true);
    };

    const uploadItemsModalCloseHandler = () => {
        setUploadItemsModalIsOpen(false);
    };

    const uploadProductsHandler = async (products: ProductDto[]) => {
        const productInfos = products.map(o => ({
            productId: o.id,
            qtyOrdered: o.qtyOrdered,
            unitOfMeasure: o.selectedUnitOfMeasure ?? "",
        }));
        await addToWishList({ productInfos, selectedWishList: wishList });
        setUploadItemsModalIsOpen(false);
        loadWishListIfNeeded({ wishListId: wishList.id });
    };

    const canEditWishList = wishList.allowEdit || !wishList.isSharedList;

    return (
        <StyledWrapper {...styles.wrapper}>
            <StyledWrapper {...styles.leftColumnWrapper}>
                {!addItemsToListIsOpen && (
                    <GridContainer {...styles.container}>
                        <GridItem {...styles.searchGridItem}>
                            <TextField
                                {...styles.search}
                                placeholder={translate("Search products in list")}
                                value={query}
                                onChange={searchChangeHandler}
                                data-test-selector="wishListSearch"
                            />
                        </GridItem>
                        <GridItem {...styles.selectAllGridItem}>
                            <Checkbox
                                {...styles.selectAll}
                                checked={isAllSelected}
                                onChange={selectAllChangeHandler}
                                data-test-selector="selectAllItems"
                            >
                                {translate("Select All")}
                            </Checkbox>
                            {loadWishListLinesParameter.sort === "SortOrder" && !query && canEditWishList && (
                                <Checkbox
                                    {...styles.editSortOrder}
                                    checked={editingSortOrder}
                                    onChange={editingSortOrderChangeHandler}
                                >
                                    {translate("Edit Sort Order")}
                                </Checkbox>
                            )}
                        </GridItem>
                        <GridItem {...styles.addItemsGridItem}>
                            {canEditWishList && (
                                <Link
                                    {...styles.addItemsLink}
                                    onClick={addItemsToListClickHandler}
                                    data-test-selector="tst_ListDetailPage_addItems"
                                >
                                    {translate("Add Items To List")}
                                </Link>
                            )}
                        </GridItem>
                    </GridContainer>
                )}
                {addItemsToListIsOpen && (
                    <GridContainer {...styles.addItemsGridContainer}>
                        <GridItem {...styles.productSelectorGridItem}>
                            <ProductSelector
                                selectButtonTitle={translate("Add to List")}
                                skipInventoryValidation={true}
                                denyFixedConfiguration={true}
                                onSelectProduct={selectProductHandler}
                                productIsConfigurableMessage={siteMessage("ListUpload_CannotOrderConfigurable")}
                                productIsUnavailableMessage={siteMessage("Product_NotFound")}
                                extendedStyles={styles.productSelectorStyles}
                            />
                            <ProductSelectorVariantModal skipInventoryValidation={true} />
                        </GridItem>
                        <GridItem {...styles.uploadItemsGridItem}>
                            <Link {...styles.uploadItemsLink} onClick={uploadItemsClickHandler}>
                                {translate("Upload Items")}
                            </Link>
                            <Modal
                                {...styles.uploadItemsModal}
                                headline={translate("Upload Items To List")}
                                isOpen={uploadItemsModalIsOpen}
                                handleClose={uploadItemsModalCloseHandler}
                            >
                                <GridContainer>
                                    <GridItem width={[12, 12, 6, 6, 6]}>
                                        <OrderUpload
                                            descriptionText={siteMessage("Lists_UploadLinkTooltip")}
                                            checkInventory={false}
                                            templateUrl="/Excel/ListUploadTemplate.xlsx"
                                            onUploadProducts={uploadProductsHandler}
                                            extendedStyles={styles.orderUploadStyles}
                                        />
                                        <OrderUploadErrorsModal
                                            descriptionText={siteMessage("ListUpload_UploadError")}
                                            uploadErrorText={siteMessage("ListUpload_UploadError")}
                                            rowsLimitExceededText={siteMessage("ListUpload_RowsLimitExceeded")}
                                            errorReasons={{
                                                [UploadError.ConfigurableProduct]: siteMessage(
                                                    "ListUpload_CannotOrderConfigurable",
                                                ),
                                                [UploadError.StyledProduct]:
                                                    siteMessage("ListUpload_CannotOrderStyled"),
                                                [UploadError.InvalidUnit]: translate("Invalid U/M"),
                                                [UploadError.NotFound]: siteMessage("Product_NotFound"),
                                            }}
                                            extendedStyles={styles.orderUploadErrorsModalStyles}
                                        />
                                    </GridItem>
                                    <GridItem width={[12, 12, 6, 6, 6]}>
                                        <Zone zoneName="UploadInstructions" contentId={id} />
                                    </GridItem>
                                </GridContainer>
                            </Modal>
                        </GridItem>
                    </GridContainer>
                )}
            </StyledWrapper>
            <StyledWrapper {...styles.rightColumnWrapper}>
                {!addItemsToListIsOpen && (
                    <OverflowMenu position="end" {...styles.sortByOverflowMenu}>
                        {wishListLinesDataView.value &&
                            wishListLinesDataView.pagination?.sortOptions?.map(sortOption => (
                                <Clickable
                                    {...(sortOption.sortType === loadWishListLinesParameter.sort
                                        ? styles.selectedSortByClickable
                                        : styles.sortByClickable)}
                                    key={sortOption.sortType}
                                    onClick={() => sortByChangeHandler(sortOption.sortType)}
                                >
                                    {sortOption.displayName}
                                </Clickable>
                            ))}
                    </OverflowMenu>
                )}
                {addItemsToListIsOpen && (
                    <Icon
                        {...styles.closeAddItemsToList}
                        onClick={() => {
                            setAddItemsToListIsOpen(false);
                        }}
                    />
                )}
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsDetailsOptions),
    definition: {
        group: "My Lists Details",
        displayName: "Options",
        allowedContexts: [MyListsDetailsPageContext],
    },
};

export default widgetModule;
