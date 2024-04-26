import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { ProductContext, ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    isWishListLineDiscontinued,
    isWishListLineRestricted,
} from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import setWishListLineIsSelected from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetWishListLineIsSelected";
import updateQuantity from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateQuantity";
import updateUnitOfMeasure from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateUnitOfMeasure";
import updateWishListLineQuantities from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateWishListLineQuantities";
import translate from "@insite/client-framework/Translate";
import {
    AvailabilityMessageType,
    ProductModel,
    WishListLineModel,
    WishListModel,
} from "@insite/client-framework/Types/ApiModels";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductContextAvailability from "@insite/content-library/Components/ProductContextAvailability";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductQuantityBreakPricing, {
    ProductQuantityBreakPricingStyles,
} from "@insite/content-library/Components/ProductQuantityBreakPricing";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Check from "@insite/mobius/Icons/Check";
import RefreshCw from "@insite/mobius/Icons/RefreshCw";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import OverflowMenu from "@insite/mobius/OverflowMenu";
import { SelectPresentationProps } from "@insite/mobius/Select";
import { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import cloneDeep from "lodash/cloneDeep";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    wishList: WishListModel;
    wishListLine: WishListLineModel;
    productInfo: ProductInfo;
    onDeleteClick: (wishListLine: WishListLineModel) => void;
    onEditNotesClick: (wishListLine: WishListLineModel) => void;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    isSelected: !!state.pages.myListDetails.selectedWishListLineIds.find(o => o === ownProps.wishListLine.id),
    settingsCollection: getSettingsCollection(state),
    isQuantityUpdated: state.pages.myListDetails.wishListLinesWithUpdatedQuantity[ownProps.wishListLine.id],
});

const mapDispatchToProps = {
    setWishListLineIsSelected,
    updateUnitOfMeasure,
    updateQuantity,
    updateWishListLineQuantities,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsDetailsProductListLineStyles {
    editNotesLink?: LinkPresentationProps;
    lineInnerContainer?: GridContainerProps;
    selectedCheckboxHidden?: HiddenProps;
    imageGridItem?: GridItemProps;
    selectedCheckbox?: CheckboxPresentationProps;
    imageWrapper?: InjectableCss;
    editNotesHidden?: HiddenProps;
    productImageStyles?: ProductImageStyles;
    descriptionGridItem?: GridItemProps;
    productBrandStyles?: ProductBrandStyles;
    productDescriptionStyles?: ProductDescriptionStyles;
    productPartNumbersStyles?: ProductPartNumbersStyles;
    notesStyles?: SmallHeadingAndTextStyles;
    overflowMenuGridItem?: GridItemProps;
    partNumbersHidden?: HiddenProps;
    partNumbersGridItem?: GridItemProps;
    priceAndAvailabilityGridItem?: GridItemProps;
    priceAndAvailabilityInnerContainer?: GridContainerProps;
    priceGridItem?: GridItemProps;
    productPriceStyles?: ProductPriceStyles;
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
    uomAndQuantityGridItem?: GridItemProps;
    uomAndQuantityInnerContainer?: GridContainerProps;
    uomGridItem?: GridItemProps;
    productUnitOfMeasureSelectStyles?: SelectPresentationProps;
    quantityGridItem?: GridItemProps;
    productQuantityOrderedStyles?: TextFieldProps;
    availabilityGridItem?: GridItemProps;
    productAvailabilityStyles?: ProductAvailabilityStyles;
    notesHidden?: HiddenProps;
    notesGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    addToCartButton?: ButtonPresentationProps;
    deleteLinkHidden?: HiddenProps;
    deleteLink?: LinkPresentationProps;
    updateQuantityWrapper?: InjectableCss;
    updateQuantityLink?: LinkPresentationProps;
    quantityUpdatedIcon?: IconPresentationProps;
    quantityUpdatedText?: TypographyPresentationProps;
    restrictedDescriptionGridItem?: GridItemProps;
    restrictedDescriptionText?: TypographyPresentationProps;
    restrictedMessageText?: TypographyPresentationProps;
    restrictedRemoveItemLink?: LinkPresentationProps;
}

export const productListLineStyles: MyListsDetailsProductListLineStyles = {
    editNotesLink: {
        typographyProps: { size: 12 },
        css: css`
            margin-top: 5px;
        `,
    },
    lineInnerContainer: {
        gap: 10,
    },
    selectedCheckboxHidden: { below: "md" },
    imageGridItem: {
        width: [3, 3, 2, 2, 1],
        printWidth: 1,
    },
    selectedCheckbox: {
        sizeVariant: "small",
        css: css`
            @media print {
                display: none;
            }
            margin-right: 10px;
        `,
    },
    imageWrapper: {
        css: css`
            @media print {
                max-height: 83px;
                max-width: 83px;
            }
            width: 100%;
            min-width: 0;
            flex-direction: column;
        `,
    },
    editNotesHidden: { below: "md" },
    descriptionGridItem: {
        width: [8, 8, 4, 4, 4],
        printWidth: 6,
        css: css`
            flex-direction: column;
        `,
    },
    productPartNumbersStyles: {
        erpNumberGridItem: {
            css: css`
                flex-direction: column;
            `,
        },
        erpNumberLabelText: { variant: "legend" },
        customerNameGridItem: {
            css: css`
                flex-direction: column;
            `,
        },
        customerNameLabelText: { variant: "legend" },
        manufacturerItemGridItem: {
            css: css`
                flex-direction: column;
            `,
        },
        manufacturerItemLabelText: { variant: "legend" },
    },
    overflowMenuGridItem: {
        width: [1, 1, 0, 0, 0],
        printWidth: 0,
    },
    partNumbersHidden: {
        below: "md",
        css: css`
            @media print {
                display: block;
            }
            width: 100%;
        `,
    },
    partNumbersGridItem: { width: 12 },
    priceAndAvailabilityGridItem: {
        width: [12, 12, 4, 4, 5],
        printWidth: 5,
    },
    priceAndAvailabilityInnerContainer: { gap: 10 },
    priceGridItem: {
        width: [12, 12, 12, 12, 5],
        printWidth: 5,
        css: css`
            flex-direction: column;
        `,
    },
    productPriceStyles: {
        priceLabelText: {
            variant: "p",
            transform: "uppercase",
            weight: 600,
            css: css`
                @media print {
                    font-size: 12px;
                }
            `,
        },
    },
    quantityBreakPricing: {
        viewLink: { typographyProps: { size: 12 } },
    },
    uomAndQuantityGridItem: {
        width: [12, 12, 12, 12, 7],
        printWidth: 7,
    },
    uomAndQuantityInnerContainer: {
        gap: 10,
        css: css`
            @media print {
                input,
                select {
                    height: 18px !important;
                    font-size: 11px !important;
                }
            }
        `,
    },
    uomGridItem: { width: 9, printWidth: 6 },
    quantityGridItem: { width: 3, printWidth: 6 },
    productQuantityOrderedStyles: {
        labelProps: {
            css: css`
                @media print {
                    font-size: 12px;
                }
            `,
        },
        cssOverrides: {
            inputSelect: css`
                @media print {
                    width: 100px;
                }
            `,
        },
    },
    productUnitOfMeasureSelectStyles: {
        labelProps: {
            css: css`
                @media print {
                    font-size: 12px;
                }
            `,
        },
        iconProps: {
            css: css`
                @media print {
                    display: none;
                }
            `,
        },
    },
    availabilityGridItem: { width: 12 },
    buttonsGridItem: {
        width: [12, 12, 2, 2, 2],
        printWidth: 0,
        css: css`
            flex-direction: column;
            align-items: center;
        `,
    },
    notesHidden: {
        above: "sm",
        css: css`
            @media print {
                display: none;
            }
            width: 100%;
        `,
    },
    notesGridItem: { width: 12 },
    addToCartButton: {
        css: css`
            width: 100%;
        `,
    },
    deleteLinkHidden: {
        below: "md",
        css: css`
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: center;
        `,
    },
    deleteLink: {
        typographyProps: { size: 12 },
        css: css`
            margin-top: 10px;
        `,
    },
    updateQuantityWrapper: {
        css: css`
            display: flex;
            margin-top: 10px;
        `,
    },
    updateQuantityLink: {
        typographyProps: { size: 12 },
        icon: {
            iconProps: {
                src: RefreshCw,
                size: 12,
            },
        },
    },
    quantityUpdatedIcon: {
        src: Check,
        size: 16,
        css: css`
            margin-right: 5px;
        `,
    },
    quantityUpdatedText: {
        size: 12,
    },
    restrictedDescriptionGridItem: {
        width: [12, 12, 6, 6, 5],
        printWidth: 5,
        css: css`
            flex-direction: column;
        `,
    },
    restrictedMessageText: { color: "warning" },
};

const styles = productListLineStyles;

const MyListsDetailsProductListLine: React.FC<Props> = ({
    wishList,
    wishListLine,
    productInfo,
    isSelected,
    settingsCollection,
    isQuantityUpdated,
    onDeleteClick,
    onEditNotesClick,
    updateWishListLineQuantities,
    setWishListLineIsSelected,
    updateUnitOfMeasure,
    updateQuantity,
}) => {
    const product = mapWishListLineToProduct(wishListLine);

    const selectChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setWishListLineIsSelected({ wishListLineId: wishListLine.id, isSelected: value });
    };

    const onUpdateQuantityClick = () => {
        updateWishListLineQuantities({ reloadWishListLines: true });
    };

    const canEditWishList = wishList.allowEdit || !wishList.isSharedList;

    if (isWishListLineRestricted(wishListLine, productInfo) || isWishListLineDiscontinued(wishListLine, productInfo)) {
        return (
            <GridContainer
                {...styles.lineInnerContainer}
                data-test-selector={`${wishListLine.productId}_${wishListLine.selectedUnitOfMeasure}`}
            >
                <GridItem {...styles.restrictedDescriptionGridItem}>
                    <Typography {...styles.restrictedDescriptionText}>{wishListLine.shortDescription}</Typography>
                    <Hidden {...styles.partNumbersHidden}>
                        <ProductPartNumbers
                            productNumber={product.productNumber}
                            customerProductNumber={product.customerProductNumber}
                            manufacturerItem={product.manufacturerItem}
                            extendedStyles={styles.productPartNumbersStyles}
                        />
                    </Hidden>
                </GridItem>
                <GridItem {...styles.partNumbersGridItem}>
                    <ProductPartNumbers
                        productNumber={product.productNumber}
                        customerProductNumber={product.customerProductNumber}
                        manufacturerItem={product.manufacturerItem}
                        extendedStyles={styles.productPartNumbersStyles}
                    />
                </GridItem>
                <GridItem {...styles.priceAndAvailabilityGridItem}>
                    <Typography {...styles.restrictedMessageText} data-test-selector="restrictedMessage">
                        {isWishListLineRestricted(wishListLine, productInfo) && (
                            <>{siteMessage("Lists_Item_Not_Displayed_Due_To_Restrictions")}</>
                        )}
                        {isWishListLineDiscontinued(wishListLine, productInfo) && (
                            <>{siteMessage("Lists_Item_Not_Displayed_Due_To_Discontinued")}</>
                        )}
                    </Typography>
                </GridItem>
                <GridItem {...styles.buttonsGridItem}>
                    {canEditWishList && (
                        <Link
                            {...styles.restrictedRemoveItemLink}
                            onClick={() => onDeleteClick(wishListLine)}
                            data-test-selector="removeRestricted"
                        >
                            {translate("Remove item")}
                        </Link>
                    )}
                </GridItem>
            </GridContainer>
        );
    }

    const { productSettings } = settingsCollection;
    const productContext: ProductContextModel = {
        product,
        productInfo,
        onQtyOrderedChanged: qtyOrdered => {
            updateQuantity({ wishListLineId: wishListLine.id, qtyOrdered });
        },
        onUnitOfMeasureChanged: unitOfMeasure => {
            updateUnitOfMeasure({ wishListLineId: wishListLine.id, unitOfMeasure });
        },
    };

    return (
        <ProductContext.Provider value={productContext}>
            <GridContainer
                {...styles.lineInnerContainer}
                data-test-selector={`${wishListLine.productId}_${wishListLine.selectedUnitOfMeasure}`}
            >
                <GridItem {...styles.imageGridItem}>
                    <Hidden {...styles.selectedCheckboxHidden}>
                        <Checkbox
                            {...styles.selectedCheckbox}
                            checked={isSelected}
                            onChange={selectChangeHandler}
                            data-test-selector="selectItem"
                        />
                    </Hidden>
                    <StyledWrapper {...styles.imageWrapper}>
                        <ProductImage product={productContext} extendedStyles={styles.productImageStyles} />
                        {canEditWishList && (
                            <Hidden {...styles.editNotesHidden}>
                                <Link {...styles.editNotesLink} onClick={() => onEditNotesClick(wishListLine)}>
                                    {translate(`${wishListLine.notes ? "Edit" : "Add"} Notes`)}
                                </Link>
                            </Hidden>
                        )}
                    </StyledWrapper>
                </GridItem>
                <GridItem {...styles.descriptionGridItem}>
                    {product.brand && <ProductBrand brand={product.brand} extendedStyles={styles.productBrandStyles} />}
                    <ProductDescription product={productContext} extendedStyles={styles.productDescriptionStyles} />
                    <Hidden {...styles.partNumbersHidden}>
                        <GridItem {...styles.partNumbersGridItem}>
                            <ProductPartNumbers
                                productNumber={product.productNumber}
                                customerProductNumber={product.customerProductNumber}
                                manufacturerItem={product.manufacturerItem}
                                extendedStyles={styles.productPartNumbersStyles}
                            />
                        </GridItem>
                        {wishListLine.notes && (
                            <GridItem {...styles.notesGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("Notes")}
                                    text={wishListLine.notes}
                                    extendedStyles={styles.notesStyles}
                                />
                            </GridItem>
                        )}
                    </Hidden>
                </GridItem>
                {canEditWishList && (
                    <GridItem {...styles.overflowMenuGridItem}>
                        <OverflowMenu position="end">
                            <Clickable onClick={() => onEditNotesClick(wishListLine)}>
                                {translate(`${wishListLine.notes ? "Edit" : "Add"} Notes`)}
                            </Clickable>
                            <Clickable onClick={() => onDeleteClick(wishListLine)}>{translate("Delete")}</Clickable>
                        </OverflowMenu>
                    </GridItem>
                )}
                <Hidden {...styles.notesHidden}>
                    <GridItem {...styles.partNumbersGridItem}>
                        <ProductPartNumbers
                            productNumber={product.productNumber}
                            customerProductNumber={product.customerProductNumber}
                            manufacturerItem={product.manufacturerItem}
                            extendedStyles={styles.productPartNumbersStyles}
                        />
                    </GridItem>
                </Hidden>
                <GridItem {...styles.priceAndAvailabilityGridItem}>
                    <GridContainer {...styles.priceAndAvailabilityInnerContainer}>
                        <GridItem {...styles.priceGridItem}>
                            <ProductPrice
                                product={productContext}
                                showSavings={true}
                                showSavingsAmount={productSettings.showSavingsAmount}
                                showSavingsPercent={productSettings.showSavingsPercent}
                                extendedStyles={styles.productPriceStyles}
                            />
                            <ProductQuantityBreakPricing extendedStyles={styles.quantityBreakPricing} />
                        </GridItem>
                        <GridItem {...styles.uomAndQuantityGridItem}>
                            <GridContainer {...styles.uomAndQuantityInnerContainer}>
                                {product.unitOfMeasures && product.unitOfMeasures.length > 1 && (
                                    <GridItem {...styles.uomGridItem}>
                                        <ProductUnitOfMeasureSelect
                                            disabled={!canEditWishList}
                                            extendedStyles={styles.productUnitOfMeasureSelectStyles}
                                        />
                                    </GridItem>
                                )}
                                <GridItem {...styles.quantityGridItem}>
                                    <ProductQuantityOrdered extendedStyles={styles.productQuantityOrderedStyles} />
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                        {productSettings.showInventoryAvailability && (
                            <GridItem {...styles.availabilityGridItem}>
                                <ProductContextAvailability extendedStyles={styles.productAvailabilityStyles} />
                            </GridItem>
                        )}
                    </GridContainer>
                </GridItem>
                {wishListLine.notes && (
                    <Hidden {...styles.notesHidden}>
                        <GridItem {...styles.notesGridItem}>
                            <SmallHeadingAndText
                                heading={translate("Notes")}
                                text={wishListLine.notes}
                                extendedStyles={styles.notesStyles}
                            />
                        </GridItem>
                    </Hidden>
                )}
                <GridItem {...styles.buttonsGridItem}>
                    <ProductAddToCartButton
                        notes={wishListLine.notes}
                        extendedStyles={styles.addToCartButton}
                        data-test-selector="addToCart"
                    />
                    {canEditWishList && (
                        <>
                            <Hidden {...styles.deleteLinkHidden}>
                                <Link
                                    {...styles.deleteLink}
                                    onClick={() => onDeleteClick(wishListLine)}
                                    data-test-selector="deleteListItem"
                                >
                                    {translate("Delete")}
                                </Link>
                            </Hidden>
                            <StyledWrapper {...styles.updateQuantityWrapper}>
                                {productInfo.qtyOrdered > 0 && wishListLine.qtyOrdered !== productInfo.qtyOrdered && (
                                    <Link {...styles.updateQuantityLink} onClick={() => onUpdateQuantityClick()}>
                                        {translate("Update QTY")}
                                    </Link>
                                )}
                                {isQuantityUpdated && wishListLine.qtyOrdered === productInfo.qtyOrdered && (
                                    <>
                                        <Icon {...styles.quantityUpdatedIcon} />
                                        <Typography {...styles.quantityUpdatedText}>
                                            {translate("QTY updated")}
                                        </Typography>
                                    </>
                                )}
                            </StyledWrapper>
                        </>
                    )}
                </GridItem>
            </GridContainer>
        </ProductContext.Provider>
    );
};

const mapWishListLineToProduct = (wishListLine: WishListLineModel) => {
    const product = cloneDeep(wishListLine) as any as ProductModel;
    product.id = wishListLine.productId;
    product.productNumber = wishListLine.erpNumber;
    product.productTitle = wishListLine.shortDescription;
    product.unitOfMeasures =
        wishListLine?.productUnitOfMeasures?.map(u => ({
            id: u.productUnitOfMeasureId,
            ...u,
        })) || null;
    return product;
};

export default connect(mapStateToProps, mapDispatchToProps)(MyListsDetailsProductListLine);
