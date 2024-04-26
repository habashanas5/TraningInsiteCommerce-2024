import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import translate from "@insite/client-framework/Translate";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import CartLineQuantity, { CartLineQuantityStyles } from "@insite/content-library/Widgets/Cart/CartLineQuantity";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    showSavingsAmount?: boolean;
    showSavingsPercent?: boolean;
    extendedStyles?: SavedOrderDetailsCartLineStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    allowMultipleWishLists: getSettingsCollection(state).wishListSettings.allowMultipleWishLists,
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

type Props = OwnProps &
    HasCartLineContext &
    HasToasterContext &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps>;

export interface SavedOrderDetailsCartLineStyles {
    productPrice?: ProductPriceStyles;
    cartLineQuantity?: CartLineQuantityStyles;
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    savedOrderLineInfoGridItem?: GridItemProps;
    savedOrderLineInfoContainer?: GridContainerProps;
    productDescriptionAndPartNumbersGridItem?: GridItemProps;
    productDescriptionAndPartNumbersContainer?: GridContainerProps;
    productBrand?: ProductBrandStyles;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productDescription?: ProductDescriptionStyles;
    productPartNumbersGridItem?: GridItemProps;
    productPartNumbers?: ProductPartNumbersStyles;
    productAvailabilityGridItem?: GridItemProps;
    productAvailability?: ProductAvailabilityStyles;
    cartLineErrorMessageGridItem?: GridItemProps;
    cartLineErrorMessageText?: TypographyPresentationProps;
    productPriceAndQuantityGridItem?: GridItemProps;
    productPriceAndQuantityContainer?: GridContainerProps;
    inactiveProductLabel?: TypographyPresentationProps;
    priceGridItem?: GridItemProps;
    quantityGridItem?: GridItemProps;
    extendedUnitNetPriceGridItem?: GridItemProps;
    extendedUnitNetPrice?: SmallHeadingAndTextStyles;
    subtotalWithoutVatText?: SmallHeadingAndTextStyles;
    vatAmount?: SmallHeadingAndTextStyles;
    savedOrderLineCardAddToListGridItem?: GridItemProps;
    savedOrderLineCardAddToListButton?: ButtonPresentationProps;
}

export const savedOrderDetailsCartLineStyles: SavedOrderDetailsCartLineStyles = {
    container: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: {
        width: [2, 2, 2, 1, 1],
        printWidth: 1,
        css: css`
            @media print {
                max-height: 83px;
                max-width: 83px;
                padding: 0;
            }
        `,
    },
    savedOrderLineInfoGridItem: {
        width: [10, 10, 10, 11, 11],
        printWidth: 11,
    },
    savedOrderLineInfoContainer: {
        gap: 15,
    },
    productDescriptionAndPartNumbersGridItem: {
        width: [12, 12, 5, 5, 5],
        printWidth: 5,
    },
    productDescriptionAndPartNumbersContainer: {
        gap: 15,
    },
    productBrand: {
        nameText: {
            color: "text.main",
        },
    },
    productBrandAndDescriptionGridItem: {
        css: css`
            flex-direction: column;
        `,
        width: 12,
    },
    productPartNumbersGridItem: {
        width: 12,
    },
    productAvailabilityGridItem: {
        width: 12,
    },
    cartLineErrorMessageGridItem: {
        width: 12,
    },
    cartLineErrorMessageText: {
        color: "danger",
    },
    productPriceAndQuantityGridItem: {
        width: [12, 12, 7, 7, 7],
        printWidth: 7,
    },
    productPriceAndQuantityContainer: {
        gap: 15,
    },
    priceGridItem: {
        width: [12, 12, 12, 4, 4],
        printWidth: 4,
        css: css`
            flex-direction: column;
        `,
    },
    productPrice: {
        price: {
            priceText: {
                weight: "normal",
            },
        },
        secondaryPrice: {
            priceText: {
                weight: "normal",
            },
        },
    },
    inactiveProductLabel: {
        color: "danger",
    },
    quantityGridItem: {
        width: [2, 2, 2, 1, 1],
    },
    extendedUnitNetPriceGridItem: {
        width: [4, 4, 4, 3, 3],
        css: css`
            flex-direction: column;
        `,
    },
    extendedUnitNetPrice: {
        text: {
            weight: 700,
        },
    },
    subtotalWithoutVatText: {
        wrapper: {
            css: css`
                margin-bottom: 6px;
            `,
        },
    },
    vatAmount: {
        wrapper: {
            css: css`
                margin-bottom: 6px;
            `,
        },
    },
    savedOrderLineCardAddToListGridItem: {
        width: [6, 6, 6, 4, 4],
        printWidth: 0,
    },
};

const SavedOrderDetailsCartLine: React.FC<Props> = ({
    cart,
    cartLine,
    showSavingsAmount,
    showSavingsPercent,
    extendedStyles,
    allowMultipleWishLists,
    enableVat,
    vatPriceDisplay,
    setAddToListModalIsOpen,
    addToWishList,
    toaster,
}) => {
    const [styles] = React.useState(() => mergeToNew(savedOrderDetailsCartLineStyles, extendedStyles));

    const addToListClickHandler = () => {
        const productInfo = {
            productId: cartLine.productId!,
            qtyOrdered: cartLine.qtyOrdered!,
            unitOfMeasure: cartLine.unitOfMeasure ?? "",
        };

        if (!allowMultipleWishLists) {
            addToWishList({
                productInfos: [productInfo],
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

        setAddToListModalIsOpen({ modalIsOpen: true, productInfos: [productInfo] });
    };

    return (
        <GridContainer {...styles.container} data-test-selector={`savedOrderDetails_orderLine_${cartLine.id}`}>
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={cartLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.savedOrderLineInfoGridItem}>
                <GridContainer {...styles.savedOrderLineInfoContainer}>
                    <GridItem {...styles.productDescriptionAndPartNumbersGridItem}>
                        <GridContainer {...styles.productDescriptionAndPartNumbersContainer}>
                            <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                {cartLine.brand && (
                                    <ProductBrand brand={cartLine.brand} extendedStyles={styles.productBrand} />
                                )}
                                <ProductDescription product={cartLine} extendedStyles={styles.productDescription} />
                            </GridItem>
                            <GridItem {...styles.productPartNumbersGridItem}>
                                <ProductPartNumbers
                                    productNumber={cartLine.erpNumber}
                                    customerProductNumber={cartLine.customerName}
                                    manufacturerItem={cartLine.manufacturerItem}
                                    extendedStyles={styles.productPartNumbers}
                                />
                            </GridItem>
                            <GridItem {...styles.productAvailabilityGridItem}>
                                <ProductAvailability
                                    productId={cartLine.productId!}
                                    availability={cartLine.availability!}
                                    unitOfMeasure={cartLine.unitOfMeasure}
                                    trackInventory={cartLine.trackInventory}
                                    failedToLoadInventory={cart.failedToGetRealTimeInventory}
                                    extendedStyles={styles.productAvailability}
                                />
                            </GridItem>
                            {cartLine.isRestricted && (
                                <GridItem {...styles.productAvailabilityGridItem}>
                                    <Typography {...styles.cartLineErrorMessageText}>
                                        {translate("Restricted product")}
                                    </Typography>
                                </GridItem>
                            )}
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.productPriceAndQuantityGridItem}>
                        <GridContainer {...styles.productPriceAndQuantityContainer}>
                            <GridItem {...styles.priceGridItem}>
                                <ProductPrice
                                    product={cartLine}
                                    showSavings={true}
                                    showSavingsAmount={showSavingsAmount}
                                    showSavingsPercent={showSavingsPercent}
                                    extendedStyles={styles.productPrice}
                                />
                                {!cartLine.isActive && (
                                    <Typography {...styles.inactiveProductLabel}>
                                        {translate("Inactive Product")}
                                    </Typography>
                                )}
                            </GridItem>
                            <GridItem {...styles.quantityGridItem}>
                                <CartLineQuantity
                                    cart={cart}
                                    editable={false}
                                    extendedStyles={styles.cartLineQuantity}
                                />
                            </GridItem>
                            <GridItem {...styles.extendedUnitNetPriceGridItem}>
                                {cartLine.pricing && (
                                    <>
                                        {enableVat && vatPriceDisplay === "DisplayWithAndWithoutVat" && (
                                            <>
                                                <SmallHeadingAndText
                                                    heading={`${translate("Subtotal")} (${translate("Ex. VAT")})`}
                                                    text={cartLine.pricing.extendedUnitNetPriceDisplay}
                                                    extendedStyles={styles.subtotalWithoutVatText}
                                                />
                                                <SmallHeadingAndText
                                                    heading={`${translate("Total VAT")} (${cartLine.pricing.vatRate}%)`}
                                                    text={cartLine.pricing.vatAmountDisplay}
                                                    extendedStyles={styles.vatAmount}
                                                />
                                            </>
                                        )}
                                        <SmallHeadingAndText
                                            heading={
                                                !enableVat
                                                    ? translate("Subtotal")
                                                    : vatPriceDisplay !== "DisplayWithoutVat"
                                                    ? `${translate("Subtotal")} (${translate("Inc. VAT")})`
                                                    : `${translate("Subtotal")} (${translate("Ex. VAT")})`
                                            }
                                            text={
                                                enableVat && vatPriceDisplay !== "DisplayWithoutVat"
                                                    ? cartLine.pricing.extendedUnitRegularPriceWithVatDisplay
                                                    : cartLine.pricing.extendedUnitNetPriceDisplay
                                            }
                                            extendedStyles={styles.extendedUnitNetPrice}
                                        />
                                    </>
                                )}
                            </GridItem>
                            <GridItem {...styles.savedOrderLineCardAddToListGridItem}>
                                {cartLine.canAddToWishlist && !cartLine.isRestricted && (
                                    <Button
                                        {...styles.savedOrderLineCardAddToListButton}
                                        data-test-selector={`tst_savedOrderDetails_productLine_${cartLine.erpNumber}`}
                                        onClick={addToListClickHandler}
                                    >
                                        {translate("Add to List")}
                                    </Button>
                                )}
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(withCartLine(SavedOrderDetailsCartLine)));
