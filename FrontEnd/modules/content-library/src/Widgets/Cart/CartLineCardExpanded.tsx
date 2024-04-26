import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { isOutOfStock } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import removeCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/RemoveCartLine";
import updateCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/UpdateCartLine";
import translate from "@insite/client-framework/Translate";
import { ProductSettingsModel, ProductSubscriptionDto, PromotionModel } from "@insite/client-framework/Types/ApiModels";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDeliveryScheduleButton from "@insite/content-library/Components/ProductDeliveryScheduleButton";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import CartLineNotes, { CartLineNotesStyles } from "@insite/content-library/Widgets/Cart/CartLineNotes";
import CartLineQuantity, { CartLineQuantityStyles } from "@insite/content-library/Widgets/Cart/CartLineQuantity";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import XCircle from "@insite/mobius/Icons/XCircle";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { FC, useContext } from "react";
import { connect, HandleThunkActionCreator, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    promotions: PromotionModel[];
    productSettings: ProductSettingsModel;
    showInventoryAvailability?: boolean;
    showLineNotes?: boolean;
    updateCartLine: HandleThunkActionCreator<typeof updateCartLine>;
    removeCartLine: HandleThunkActionCreator<typeof removeCartLine>;
    showRemoveAction?: boolean;
    hideAddToList?: boolean;
    extendedStyles?: CartLineCardExpandedStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    wishListSettings: getSettingsCollection(state).wishListSettings,
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

type Props = OwnProps &
    HasCartLineContext &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps>;

export interface CartLineCardExpandedStyles {
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    cartLineInfoGridItem?: GridItemProps;
    cartLineInfoContainer?: GridContainerProps;
    productInfoGridItem?: GridItemProps;
    productInfoContainer?: GridContainerProps;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productBrand?: ProductBrandStyles;
    productDescriptionGridItem?: GridItemProps;
    productDescription?: ProductDescriptionStyles;
    configurationGridItem?: GridItemProps;
    configurationOptionText?: TypographyProps;
    productPartNumbersGridItem?: GridItemProps;
    productPartNumbers?: ProductPartNumbersStyles;
    quantityAndExtendedUnitNetPriceGridItem?: GridItemProps;
    quantityAndExtendedUnitNetPriceContainer?: GridContainerProps;
    quantityGridItem?: GridItemProps;
    quantity?: CartLineQuantityStyles;
    extendedUnitNetPriceGridItem?: GridItemProps;
    extendedUnitNetPriceText?: TypographyProps;
    vatLabelText?: TypographyPresentationProps;
    subtotalWithoutVatText?: TypographyPresentationProps;
    cartLineErrorMessageGridItem?: GridItemProps;
    cartLineErrorMessageText?: TypographyProps;
    productPriceAndAvailabilityGridItem?: GridItemProps;
    productPrice?: ProductPriceStyles;
    promotionNameText?: TypographyProps;
    productAvailability?: ProductAvailabilityStyles;
    addToListLink?: LinkPresentationProps;
    deliveryScheduleButton?: ButtonPresentationProps;
    costCodeGridItem?: GridItemProps;
    costCodeLabelText?: TypographyPresentationProps;
    costCodeSelect?: SelectPresentationProps;
    costCodeText?: TypographyPresentationProps;
    cartLineNotesGridItem?: GridItemProps;
    cartLineNotes?: CartLineNotesStyles;
    removeCartLineGridItem?: GridItemProps;
    removeCartLineIcon?: IconPresentationProps;
}

export const cartLineCardExpandedStyles: CartLineCardExpandedStyles = {
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
    cartLineInfoContainer: { gap: 20 },
    productInfoGridItem: { width: [12, 12, 12, 7, 7] },
    productInfoContainer: { gap: 12 },
    productBrandAndDescriptionGridItem: {
        css: css`
            flex-direction: column;
        `,
        width: 12,
    },
    productDescriptionGridItem: {
        width: 12,
    },
    configurationGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    productPartNumbersGridItem: { width: 12 },
    quantityAndExtendedUnitNetPriceGridItem: { width: 12 },
    quantityGridItem: { width: 6 },
    extendedUnitNetPriceGridItem: {
        width: 6,
        css: css`
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-end;
        `,
    },
    extendedUnitNetPriceText: {
        weight: "bold",
    },
    vatLabelText: {
        size: 12,
    },
    subtotalWithoutVatText: {
        weight: "bold",
        css: css`
            margin-top: 5px;
        `,
    },
    cartLineErrorMessageGridItem: { width: 12 },
    cartLineErrorMessageText: { color: "danger" },
    productPriceAndAvailabilityGridItem: {
        width: [12, 12, 12, 5, 5],
        css: css`
            flex-direction: column;
        `,
    },
    addToListLink: {
        css: css`
            margin-top: 20px;
        `,
    },
    deliveryScheduleButton: {
        css: css`
            margin-top: 20px;
        `,
    },
    costCodeGridItem: {
        width: [12, 12, 12, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    costCodeLabelText: {
        css: css`
            margin-bottom: 10px;
        `,
    },
    cartLineNotesGridItem: { width: 12 },
    removeCartLineGridItem: {
        css: css`
            justify-content: center;
        `,
        width: [2, 2, 2, 1, 1],
    },
    removeCartLineIcon: { src: XCircle },
};

const CartLineCardExpanded: FC<Props> = ({
    cart,
    cartLine,
    promotions,
    productSettings,
    showInventoryAvailability,
    showLineNotes,
    updateCartLine,
    removeCartLine,
    extendedStyles,
    showRemoveAction,
    wishListSettings,
    setAddToListModalIsOpen,
    addToWishList,
    hideAddToList,
    enableVat,
    vatPriceDisplay,
}) => {
    const toasterContext = useContext(ToasterContext);
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

    const costCodeChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const costCode = event.currentTarget.value;
        if (costCode !== cartLine.costCode) {
            updateCartLine({
                cartLine: {
                    ...cartLine,
                    costCode,
                },
            });
        }
    };

    const notesChangeHandler = (notes: string) => {
        if (notes !== cartLine.notes) {
            updateCartLine({
                cartLine: {
                    ...cartLine,
                    notes,
                },
                shouldNotReloadPromotions: true,
                onSuccess: () => {
                    toasterContext.addToast({
                        body: translate("Line Notes Updated"),
                        messageType: "success",
                    });
                },
                onComplete(resultProps) {
                    if (resultProps.apiResult) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.();
                    }
                },
            });
        }
    };

    const removeCartLineClickHandler = () => {
        if (!showRemoveAction) {
            return;
        }

        removeCartLine({ cartLineId: cartLine.id });
    };

    const addToListClickHandler = () => {
        if (!wishListSettings) {
            return;
        }

        const productInfo = {
            productId: cartLine.productId!,
            qtyOrdered: cartLine.qtyOrdered!,
            unitOfMeasure: cartLine.unitOfMeasure,
        };
        if (!wishListSettings.allowMultipleWishLists) {
            addToWishList({
                productInfos: [productInfo],
                onSuccess: () => {
                    toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
                onComplete(resultProps) {
                    if (resultProps.result?.wishList) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.(resultProps.result.wishList);
                    } else if (resultProps.result?.errorMessage) {
                        toasterContext.addToast({ body: resultProps.result.errorMessage, messageType: "danger" });
                    }
                },
            });
            return;
        }

        setAddToListModalIsOpen({ modalIsOpen: true, productInfos: [productInfo] });
    };

    const saveScheduleHandler = (updatedSubscription: ProductSubscriptionDto) => {
        updateCartLine({
            cartLine: {
                ...cartLine,
                properties: {
                    productSubscription: JSON.stringify(updatedSubscription),
                },
            },
        });
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

    const [styles] = React.useState(() => mergeToNew(cartLineCardExpandedStyles, extendedStyles));

    return (
        <GridContainer
            {...styles.container}
            data-test-selector={`cartline_expanded_${cartLine.productId}_${cartLine.unitOfMeasure}`}
        >
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={cartLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.cartLineInfoGridItem}>
                <GridContainer {...styles.cartLineInfoContainer}>
                    <GridItem {...styles.productInfoGridItem}>
                        <GridContainer {...styles.productInfoContainer}>
                            <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                {cartLine.brand && (
                                    <ProductBrand brand={cartLine.brand} extendedStyles={styles.productBrand} />
                                )}
                                <ProductDescription product={cartLine} extendedStyles={styles.productDescription} />
                            </GridItem>
                            {!cartLine.isFixedConfiguration && cartLine.sectionOptions!.length > 0 && (
                                <GridItem {...styles.configurationGridItem}>
                                    {cartLine.sectionOptions!.map(option => (
                                        <Typography {...styles.configurationOptionText} key={option.sectionOptionId}>
                                            {`${option.sectionName}:${option.optionName}`}
                                        </Typography>
                                    ))}
                                </GridItem>
                            )}
                            <GridItem {...styles.productPartNumbersGridItem}>
                                <ProductPartNumbers
                                    productNumber={cartLine.erpNumber}
                                    customerProductNumber={cartLine.customerName}
                                    manufacturerItem={cartLine.manufacturerItem}
                                    extendedStyles={styles.productPartNumbers}
                                />
                            </GridItem>
                            <GridItem {...styles.quantityAndExtendedUnitNetPriceGridItem}>
                                <GridContainer {...styles.quantityAndExtendedUnitNetPriceContainer}>
                                    <GridItem {...styles.quantityGridItem}>
                                        <CartLineQuantity
                                            cart={cart}
                                            editable={true}
                                            onQtyOrderedChange={qtyOrderedChangeHandler}
                                            extendedStyles={styles.quantity}
                                        />
                                    </GridItem>
                                    {!cartLine.quoteRequired && !cart.cartNotPriced && cartLine.pricing && (
                                        <GridItem {...styles.extendedUnitNetPriceGridItem}>
                                            <Typography
                                                {...styles.extendedUnitNetPriceText}
                                                data-test-selector="cartline_extendedUnitNetPrice"
                                            >
                                                {enableVat && vatPriceDisplay !== "DisplayWithoutVat"
                                                    ? cartLine.pricing.extendedUnitRegularPriceWithVatDisplay
                                                    : cartLine.pricing.extendedUnitNetPriceDisplay}
                                            </Typography>
                                            {enableVat && (
                                                <>
                                                    <Typography as="p" {...styles.vatLabelText}>
                                                        {vatPriceDisplay === "DisplayWithVat" ||
                                                        vatPriceDisplay === "DisplayWithAndWithoutVat"
                                                            ? `${translate("Inc. VAT")} (${cartLine.pricing.vatRate}%)`
                                                            : translate("Ex. VAT")}
                                                    </Typography>
                                                    {vatPriceDisplay === "DisplayWithAndWithoutVat" && (
                                                        <>
                                                            <Typography {...styles.subtotalWithoutVatText}>
                                                                {cartLine.pricing.extendedUnitNetPriceDisplay}
                                                            </Typography>
                                                            <Typography as="p" {...styles.vatLabelText}>
                                                                {translate("Ex. VAT")}
                                                            </Typography>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </GridItem>
                                    )}
                                </GridContainer>
                            </GridItem>
                            {errorMessages.length > 0 && (
                                <GridItem {...styles.cartLineErrorMessageGridItem}>
                                    {errorMessages.map((message, index) => (
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
                            )}
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.productPriceAndAvailabilityGridItem}>
                        {!cart.cartNotPriced && (
                            <ProductPrice
                                product={cartLine}
                                currencySymbol={cart.currencySymbol}
                                showSavings={true}
                                showSavingsAmount={productSettings.showSavingsAmount}
                                showSavingsPercent={productSettings.showSavingsPercent}
                                showInvalidPriceMessage={true}
                                extendedStyles={styles.productPrice}
                            />
                        )}
                        {promotions.map(promotion => (
                            <Typography {...styles.promotionNameText} key={promotion.id}>
                                {promotion.name}
                            </Typography>
                        ))}
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
                        {!hideAddToList && cartLine.canAddToWishlist && (
                            <Link {...styles.addToListLink} onClick={addToListClickHandler}>
                                {translate("Add to List")}
                            </Link>
                        )}
                        {cartLine.isSubscription && cartLine.productSubscription && (
                            <ProductDeliveryScheduleButton
                                subscription={
                                    cartLine.properties.productSubscription
                                        ? JSON.parse(cartLine.properties.productSubscription)
                                        : cartLine.productSubscription
                                }
                                disabled={
                                    !cart.canModifyOrder ||
                                    cartLine.isPromotionItem ||
                                    !cartLine.qtyOrdered ||
                                    cartLine.qtyOrdered <= 0
                                }
                                onSave={saveScheduleHandler}
                                extendedStyles={styles.deliveryScheduleButton}
                            />
                        )}
                    </GridItem>
                    {cart.showCostCode && !cartLine.isPromotionItem && (
                        <GridItem {...styles.costCodeGridItem}>
                            <Typography {...styles.costCodeLabelText}>{cart.costCodeLabel}</Typography>
                            {cart.canEditCostCode ? (
                                <Select
                                    value={cartLine.costCode}
                                    onChange={costCodeChangeHandler}
                                    {...styles.costCodeSelect}
                                >
                                    {cart.costCodes?.map(costCode => (
                                        <option key={costCode.costCode} value={costCode.costCode}>
                                            {costCode.description}
                                        </option>
                                    ))}
                                </Select>
                            ) : (
                                <Typography {...styles.costCodeText}>{cartLine.costCode}</Typography>
                            )}
                        </GridItem>
                    )}
                    {showLineNotes && !cartLine.isPromotionItem && cart.properties["isPunchout"] === undefined && (
                        <GridItem {...styles.cartLineNotesGridItem}>
                            <CartLineNotes
                                cart={cart}
                                editable={true}
                                onNotesChange={notesChangeHandler}
                                extendedStyles={styles.cartLineNotes}
                            />
                        </GridItem>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(withCartLine(CartLineCardExpanded));
