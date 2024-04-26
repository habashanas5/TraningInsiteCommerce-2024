import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { CartLineContext } from "@insite/client-framework/Components/CartLineContext";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    getCurrentCartState,
    hasProductsWithInvalidPrice,
} from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getCurrentPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import clearCurrentCart from "@insite/client-framework/Store/Pages/Cart/Handlers/ClearCurrentCart";
import removeCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/RemoveCartLine";
import updateCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/UpdateCartLine";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import { CardListStyles } from "@insite/content-library/Components/CardList";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";
import CartLineCardCondensed, {
    CartLineCardCondensedStyles,
} from "@insite/content-library/Widgets/Cart/CartLineCardCondensed";
import CartLineCardExpanded, {
    CartLineCardExpandedStyles,
} from "@insite/content-library/Widgets/Cart/CartLineCardExpanded";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import Clickable from "@insite/mobius/Clickable";
import Hidden from "@insite/mobius/Hidden";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import ShoppingCart from "@insite/mobius/Icons/ShoppingCart";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingOverlay, { LoadingOverlayProps } from "@insite/mobius/LoadingOverlay";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { FC, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    showLineNotes = "showLineNotes",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showLineNotes]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    cart: getCurrentCartState(state).value,
    promotionsDataView: getCurrentPromotionsDataView(state),
    settingsCollection: getSettingsCollection(state),
    isClearingCart: state.pages.cart.isClearingCart,
    isUpdatingCartLine: state.pages.cart.isUpdatingCartLine,
    isLoading: state.data.carts.isLoading,
});

const mapDispatchToProps = {
    clearCurrentCart,
    updateCartLine,
    removeCartLine,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CartLinesStyles {
    wrapper?: InjectableCss;
    loadingOverlay?: LoadingOverlayProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noCartLinesText?: TypographyProps;
    noCartLinesIcon?: IconPresentationProps;
    headerWrapper?: InjectableCss;
    header?: CartLinesHeaderStyles;
    cardList?: CardListStyles;
    cardContainer?: CardContainerStyles;
    cardExpanded?: CartLineCardExpandedStyles;
    cardCondensed?: CartLineCardCondensedStyles;
    footerWrapper?: InjectableCss;
    backToTopButton?: ButtonPresentationProps;
}

interface CartLinesHeaderStyles {
    itemCountText?: TypographyProps;
    condensedViewCheckboxGroup?: FieldSetGroupPresentationProps<CheckboxGroupComponentProps>;
    condensedViewCheckbox?: CheckboxPresentationProps;
    overflowMenu?: OverflowMenuPresentationProps;
    removeAllLink?: LinkPresentationProps;
    mainSection?: InjectableCss;
    warningIcon?: IconPresentationProps;
    warningSection?: InjectableCss;
    warningText?: InjectableCss;
}

export const cartLinesStyles: CartLinesStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            height: 300px;
            justify-content: center;
            align-items: center;
        `,
    },
    noCartLinesText: {
        variant: "h3",
    },
    noCartLinesIcon: {
        src: ShoppingCart,
        size: 45,
        color: "text.link",
        css: css`
            margin-bottom: 20px;
        `,
    },
    headerWrapper: {
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding-bottom: 10px;
        `,
    },
    header: {
        condensedViewCheckboxGroup: {
            css: css`
                margin-left: auto;
            `,
        },
        condensedViewCheckbox: {
            typographyProps: {
                css: css`
                    margin-left: 10px;
                `,
            },
        },
        overflowMenu: {
            cssOverrides: {
                wrapper: css`
                    margin-left: 20px;
                `,
            },
        },
        removeAllLink: {
            css: css`
                margin-left: 24px;
            `,
        },
        mainSection: {
            css: css`
                display: flex;
                align-items: center;
                padding-bottom: 5px;
            `,
        },
        warningIcon: {
            src: "AlertCircle",
            color: "danger.main",
            css: css`
                margin-right: 10px;
            `,
        },
        warningSection: {
            css: css`
                display: flex;
                align-items: center;
                border: 2px solid ${getColor("danger.main")};
                padding: 15px 10px;
            `,
        },
    },
    footerWrapper: {
        css: css`
            display: flex;
            justify-content: center;
        `,
    },
    backToTopButton: {
        variant: "secondary",
        css: css`
            margin: 16px 0;
        `,
    },
};

const StyledSection = getStyledWrapper("section");

const styles = cartLinesStyles;

const CartLines: FC<Props> = ({
    cart,
    promotionsDataView,
    settingsCollection,
    clearCurrentCart,
    fields,
    isClearingCart,
    isUpdatingCartLine,
    isLoading,
    updateCartLine,
    removeCartLine,
}) => {
    const [isCondensed, setIsCondensed] = useState(false);

    if (!cart || !cart.cartLines || isClearingCart) {
        return (
            <StyledSection {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledSection>
        );
    }

    const cartLines = cart.cartLines;

    if (cartLines.length === 0) {
        return (
            <StyledSection {...styles.centeringWrapper}>
                <Icon {...styles.noCartLinesIcon} />
                <Typography {...styles.noCartLinesText} data-test-selector="cart_noCartLinesMessage">
                    {siteMessage("Cart_NoOrderLines")}
                </Typography>
            </StyledSection>
        );
    }

    const isCondensedChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setIsCondensed(value);
    };

    const removeAllClickHandler = () => {
        clearCurrentCart();
    };

    const { productSettings } = settingsCollection;
    const { value: promotions } = promotionsDataView;
    const productsCannotBePurchased = cartLines.some(o => o.isRestricted || !o.isActive);
    const isLoadingCart = isLoading[cart.id];

    const cartLinesDisplay = cartLines.map(cartLine => {
        const matchingPromotions = promotions ? promotions.filter(promo => promo.orderLineId === cartLine.id) : [];
        const showRemoveAction = !cartLine.isPromotionItem && cart.canModifyOrder;
        return (
            <CartLineContext.Provider value={cartLine} key={cartLine.id}>
                {isCondensed ? (
                    <CartLineCardCondensed
                        cart={cart}
                        promotions={matchingPromotions}
                        productSettings={productSettings}
                        showInventoryAvailability={true}
                        extendedStyles={styles.cardCondensed}
                        updateCartLine={updateCartLine}
                        removeCartLine={removeCartLine}
                        showRemoveAction={showRemoveAction}
                    />
                ) : (
                    <CartLineCardExpanded
                        cart={cart}
                        promotions={matchingPromotions}
                        productSettings={productSettings}
                        showInventoryAvailability={true}
                        showLineNotes={fields.showLineNotes}
                        extendedStyles={styles.cardExpanded}
                        updateCartLine={updateCartLine}
                        removeCartLine={removeCartLine}
                        showRemoveAction={showRemoveAction}
                    />
                )}
            </CartLineContext.Provider>
        );
    });

    return (
        <StyledSection {...styles.wrapper}>
            <LoadingOverlay
                {...styles.loadingOverlay}
                loading={isLoadingCart || isUpdatingCartLine || !promotionsDataView.value}
            >
                <CartLinesHeader
                    totalItemCount={cartLines.length}
                    isCondensed={isCondensed}
                    productsCannotBePurchased={productsCannotBePurchased}
                    cartNotPriced={cart.cartNotPriced}
                    hasInsufficientInventory={cart.hasInsufficientInventory && cart.fulfillmentMethod === "Ship"}
                    hasInvalidPrice={hasProductsWithInvalidPrice(cart)}
                    failedToGetRealTimeInventory={cart.failedToGetRealTimeInventory}
                    onIsCondensedChange={isCondensedChangeHandler}
                    onRemoveAllClick={removeAllClickHandler}
                />
                {cartLinesDisplay}
                <CartLinesFooter />
            </LoadingOverlay>
        </StyledSection>
    );
};

interface CartLinesHeaderProps {
    totalItemCount: number;
    isCondensed: boolean;
    productsCannotBePurchased?: boolean;
    cartNotPriced?: boolean;
    hasInsufficientInventory?: boolean;
    hasInvalidPrice?: boolean;
    failedToGetRealTimeInventory?: boolean;
    onIsCondensedChange: CheckboxProps["onChange"];
    onRemoveAllClick: () => void;
}

const CartLinesHeader: FC<CartLinesHeaderProps> = ({
    totalItemCount,
    isCondensed,
    productsCannotBePurchased,
    cartNotPriced,
    hasInsufficientInventory,
    hasInvalidPrice,
    failedToGetRealTimeInventory,
    onIsCondensedChange,
    onRemoveAllClick,
}) => {
    const headerStyles = styles.header || {};

    return (
        <StyledSection {...styles.headerWrapper} id="cartHeader">
            <StyledSection {...headerStyles.mainSection}>
                <Typography {...headerStyles.itemCountText}>{`${totalItemCount} ${translate("Items")}`}</Typography>
                <CheckboxGroup {...headerStyles.condensedViewCheckboxGroup}>
                    <Checkbox
                        checked={isCondensed}
                        onChange={onIsCondensedChange}
                        data-test-selector="cartlineHeader_condensedCheckbox"
                        {...headerStyles.condensedViewCheckbox}
                    >
                        {translate("Condensed View")}
                        <VisuallyHidden>{translate("for product list")}</VisuallyHidden>
                    </Checkbox>
                </CheckboxGroup>
                <Hidden above="md">
                    <OverflowMenu position="end" {...headerStyles.overflowMenu}>
                        <Clickable onClick={onRemoveAllClick}>{translate("Remove All")}</Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden below="lg">
                    <Link
                        onClick={onRemoveAllClick}
                        {...headerStyles.removeAllLink}
                        data-test-selector="cartlineHeader_removeAll"
                    >
                        {translate("Remove All")}
                    </Link>
                </Hidden>
            </StyledSection>
            {productsCannotBePurchased && (
                <StyledSection {...headerStyles.warningSection}>
                    <Icon {...headerStyles.warningIcon}></Icon>
                    <Typography {...headerStyles.warningText}>
                        {siteMessage("Cart_ProductsCannotBePurchased")}
                    </Typography>
                </StyledSection>
            )}
            {cartNotPriced && (
                <StyledSection {...headerStyles.warningSection}>
                    <Icon {...headerStyles.warningIcon}></Icon>
                    <Typography {...headerStyles.warningText}>
                        {siteMessage("Cart_NoPriceAvailableAtCheckout")}
                    </Typography>
                </StyledSection>
            )}
            {hasInsufficientInventory && (
                <StyledSection {...headerStyles.warningSection}>
                    <Icon {...headerStyles.warningIcon}></Icon>
                    <Typography {...headerStyles.warningText}>
                        {siteMessage("Cart_InsufficientInventoryAtCheckout")}
                    </Typography>
                </StyledSection>
            )}
            {!cartNotPriced && hasInvalidPrice && (
                <StyledSection {...headerStyles.warningSection}>
                    <Icon {...headerStyles.warningIcon}></Icon>
                    <Typography {...headerStyles.warningText}>{siteMessage("Cart_InvalidPriceAtCheckout")}</Typography>
                </StyledSection>
            )}
            {failedToGetRealTimeInventory && (
                <StyledSection {...headerStyles.warningSection}>
                    <Icon {...headerStyles.warningIcon}></Icon>
                    <Typography {...headerStyles.warningText}>
                        {siteMessage("Cart_NoInventoryAvailableAtCheckout")}
                    </Typography>
                </StyledSection>
            )}
        </StyledSection>
    );
};

const CartLinesFooter: FC = () => {
    const backToTopClickHandler = () => {
        const header = document.getElementById("cartHeader");
        if (header) {
            window.scrollTo(0, header.offsetTop);
        }
    };

    return (
        <StyledSection {...styles.footerWrapper}>
            <Button onClick={backToTopClickHandler} {...styles.backToTopButton}>
                {translate("Back to Top")}
            </Button>
        </StyledSection>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CartLines),
    definition: {
        group: "Cart",
        allowedContexts: [CartPageContext],
        fieldDefinitions: [
            {
                name: fields.showLineNotes,
                displayName: "Show Line Notes",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                isRequired: false,
                variant: "toggle",
                tooltip: "This setting does not apply to Punchout orders, which will never display Line Notes.",
            },
        ],
    },
};

export default widgetModule;
