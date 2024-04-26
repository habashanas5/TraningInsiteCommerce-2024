import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";
import siteMessage from "@insite/client-framework/SiteMessage";
import { isOutOfStock } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import removeCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/RemoveCartLine";
import updateCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/UpdateCartLine";
import translate from "@insite/client-framework/Translate";
import { ProductSettingsModel, PromotionModel } from "@insite/client-framework/Types/ApiModels";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import CartLineQuantity, { CartLineQuantityStyles } from "@insite/content-library/Widgets/Cart/CartLineQuantity";
import Clickable from "@insite/mobius/Clickable";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import XCircle from "@insite/mobius/Icons/XCircle";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { FC } from "react";
import { HandleThunkActionCreator } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    promotions: PromotionModel[];
    productSettings: ProductSettingsModel;
    showInventoryAvailability?: boolean;
    updateCartLine: HandleThunkActionCreator<typeof updateCartLine>;
    removeCartLine: HandleThunkActionCreator<typeof removeCartLine>;
    showRemoveAction?: boolean;
    extendedStyles?: CartLineCardCondensedStyles;
}

type Props = OwnProps & HasCartLineContext;

export interface CartLineCardCondensedStyles {
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    cartLineInfoGridItem?: GridItemProps;
    cartLineInfoContainer?: GridContainerProps;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productBrand?: ProductBrandStyles;
    productDescription?: ProductDescriptionStyles;
    productErpNumberText?: TypographyProps;
    productPriceAndQuantityGridItem?: GridItemProps;
    productPriceAndQuantityContainer?: GridContainerProps;
    productPriceAndAvailabilityGridItem?: GridItemProps;
    productPrice?: ProductPriceStyles;
    productAvailability?: ProductAvailabilityStyles;
    cartLineErrorMessageText?: TypographyProps;
    quantityGridItem?: GridItemProps;
    quantity?: CartLineQuantityStyles;
    removeCartLineGridItem?: GridItemProps;
    removeCartLineIcon?: IconPresentationProps;
}

export const cartLineCardCondensedStyles: CartLineCardCondensedStyles = {
    container: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: {
        width: 2,
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        font-size: 10px;
                    `,
                    css`
                        font-size: 10px;
                    `,
                    css`
                        font-size: 10px;
                    `,
                    css`
                        font-size: 10px;
                    `,
                    null,
                ])}
        `,
    },
    cartLineInfoGridItem: { width: [8, 8, 8, 9, 9] },
    productBrandAndDescriptionGridItem: {
        width: [12, 12, 12, 6, 5],
        css: css`
            flex-direction: column;
        `,
    },
    productErpNumberText: {
        css: css`
            width: 100%;
            word-wrap: break-word;
        `,
    },
    productPriceAndQuantityGridItem: { width: [12, 12, 12, 6, 7] },
    productPriceAndAvailabilityGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
        `,
    },
    cartLineErrorMessageText: { color: "danger" },
    quantityGridItem: { width: 6 },
    removeCartLineGridItem: {
        css: css`
            justify-content: center;
        `,
        width: [2, 2, 2, 1, 1],
    },
    removeCartLineIcon: { src: XCircle },
};

const CartLineCardCondensed: FC<Props> = ({
    cart,
    cartLine,
    showInventoryAvailability,
    removeCartLine,
    updateCartLine,
    extendedStyles,
    showRemoveAction,
}) => {
    const qtyOrderedChangeHandler = (qtyOrdered: number) => {
        if (qtyOrdered !== cartLine.qtyOrdered) {
            if (qtyOrdered <= 0) {
                removeCartLine({ cartLineId: cartLine.id });
            } else {
                updateCartLine({
                    cartLine: {
                        ...cartLine,
                        qtyOrdered,
                    },
                });
            }
        }
    };

    const removeCartLineClickHandler = () => {
        if (!showRemoveAction) {
            return;
        }

        removeCartLine({ cartLineId: cartLine.id });
    };

    const sumQtyPerUom = cart.cartLines!.reduce((sum, current) => {
        return current.productId === cartLine.productId
            ? sum + current.qtyPerBaseUnitOfMeasure * current.qtyOrdered!
            : sum;
    }, 0);
    const errorMessages: React.ReactNode[] = [];
    if (showInventoryAvailability && cartLine.hasInsufficientInventory && !isOutOfStock(cartLine)) {
        const tooManyRequestedMessage = siteMessage(
            "Cart_ToManyQtyRequested",
            cartLine.qtyOnHand.toLocaleString(),
            sumQtyPerUom.toLocaleString(),
        );
        errorMessages.push(tooManyRequestedMessage);
    }

    if (cartLine.isRestricted) {
        errorMessages.push(translate("Restricted product"));
    }

    if (!cartLine.isActive) {
        errorMessages.push(translate("Inactive Product"));
    }

    const [styles] = React.useState(() => mergeToNew(cartLineCardCondensedStyles, extendedStyles));

    return (
        <GridContainer
            {...styles.container}
            data-test-selector={`cartline_condensed_${cartLine.productId}_${cartLine.unitOfMeasure}`}
        >
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={cartLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.cartLineInfoGridItem}>
                <GridContainer {...styles.cartLineInfoContainer}>
                    <GridItem {...styles.productBrandAndDescriptionGridItem}>
                        {cartLine.brand && <ProductBrand brand={cartLine.brand} extendedStyles={styles.productBrand} />}
                        <ProductDescription product={cartLine} extendedStyles={styles.productDescription} />
                        <Typography {...styles.productErpNumberText}>{cartLine.erpNumber}</Typography>
                    </GridItem>
                    <GridItem {...styles.productPriceAndQuantityGridItem}>
                        <GridContainer {...styles.productPriceAndQuantityContainer}>
                            <GridItem {...styles.productPriceAndAvailabilityGridItem}>
                                {!cart.cartNotPriced && (
                                    <ProductPrice
                                        product={cartLine}
                                        currencySymbol={cart.currencySymbol}
                                        showSavings={false}
                                        showInvalidPriceMessage={true}
                                        extendedStyles={styles.productPrice}
                                    />
                                )}
                                {showInventoryAvailability && !cartLine.quoteRequired && (
                                    <ProductAvailability
                                        productId={cartLine.productId!}
                                        availability={cartLine.availability!}
                                        unitOfMeasure={cartLine.unitOfMeasure}
                                        trackInventory={cartLine.trackInventory}
                                        failedToLoadInventory={cart.failedToGetRealTimeInventory}
                                        extendedStyles={styles.productAvailability}
                                    />
                                )}
                                {errorMessages.length > 0 &&
                                    errorMessages.map((message, index) => (
                                        <Typography
                                            {...styles.cartLineErrorMessageText}
                                            // eslint-disable-next-line react/no-array-index-key
                                            key={index}
                                            data-test-selector="cartline_errorMessage"
                                        >
                                            {message}
                                        </Typography>
                                    ))}
                            </GridItem>
                            <GridItem {...styles.quantityGridItem}>
                                <CartLineQuantity
                                    cart={cart}
                                    editable={true}
                                    onQtyOrderedChange={qtyOrderedChangeHandler}
                                    extendedStyles={styles.quantity}
                                />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...styles.removeCartLineGridItem}>
                {showRemoveAction && (
                    <Clickable onClick={removeCartLineClickHandler} data-test-selector="cartline_removeLine">
                        <VisuallyHidden>{translate("Remove item")}</VisuallyHidden>
                        <IconMemo {...styles.removeCartLineIcon} />
                    </Clickable>
                )}
            </GridItem>
        </GridContainer>
    );
};

export default withCartLine(CartLineCardCondensed);
