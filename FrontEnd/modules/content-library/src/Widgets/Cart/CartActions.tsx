import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    canAddAllToList,
    canSaveOrder,
    getCurrentCartState,
    isCartEmpty,
    isPunchOutOrder,
} from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";
import CartSaveOrderButton from "@insite/content-library/Widgets/Cart/CartSaveOrderButton";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const cart = getCurrentCartState(state).value;
    return {
        wishListSettings: getSettingsCollection(state).wishListSettings,
        cart,
        isCartEmpty: isCartEmpty(cart),
        canSaveOrder: canSaveOrder(cart),
        canAddAllToList: canAddAllToList(cart),
        isPunchOutOrder: isPunchOutOrder(cart),
    };
};

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CartActionsStyles {
    narrowHidden?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuPresentationProps;
    saveOrderClickable?: ClickablePresentationProps;
    addAllToListClickable?: ClickablePresentationProps;
    requestAQuoteClickable?: ClickablePresentationProps;
    wideHidden?: HiddenProps;
    wideOverflowMenu?: OverflowMenuPresentationProps;
    saveOrderButton?: ButtonPresentationProps;
}

export const cartActionsStyles: CartActionsStyles = {
    narrowHidden: {
        above: "sm",
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    wideHidden: {
        below: "md",
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    saveOrderButton: {
        buttonType: "outline",
        variant: "secondary",
    },
    wideOverflowMenu: {
        cssOverrides: {
            wrapper: css`
                margin-left: 20px;
            `,
        },
    },
};

const styles = cartActionsStyles;

const CartActions: FC<Props> = ({
    cart,
    isCartEmpty,
    canAddAllToList,
    wishListSettings,
    setAddToListModalIsOpen,
    addToWishList,
    isPunchOutOrder,
}) => {
    if (!cart || isPunchOutOrder) {
        return null;
    }

    const toasterContext = React.useContext(ToasterContext);
    const overflowItems = [];
    const wideHiddenOverflowMenu = [];

    const addAllToListClickHandler = () => {
        if (!wishListSettings) {
            return;
        }

        const productInfos =
            cart.cartLines
                ?.filter(o => o.productId && o.qtyOrdered)
                .map(cartLine => ({
                    productId: cartLine.productId!,
                    qtyOrdered: cartLine.qtyOrdered!,
                    unitOfMeasure: cartLine.unitOfMeasure,
                })) || [];
        if (!wishListSettings.allowMultipleWishLists) {
            addToWishList({
                productInfos,
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

        setAddToListModalIsOpen({ modalIsOpen: true, productInfos });
    };

    if (!isCartEmpty) {
        overflowItems.push(
            <Clickable
                {...styles.addAllToListClickable}
                key="addAll"
                disabled={!canAddAllToList}
                onClick={addAllToListClickHandler}
                data-test-selector="cartActionsAddAllToList"
            >
                {translate("Add All to List")}
            </Clickable>,
        );

        wideHiddenOverflowMenu.push(
            <OverflowMenu key="overflow" {...styles.wideOverflowMenu} data-test-selector="cartActionsOverflowMenu">
                {overflowItems}
            </OverflowMenu>,
        );
    }

    return (
        <>
            <Hidden {...styles.narrowHidden} data-test-selector="cartActionsNarrow">
                <OverflowMenu position="end" {...styles.narrowOverflowMenu}>
                    <CartSaveOrderButton variant="clickable" extendedStyles={styles.saveOrderClickable} />
                    {overflowItems}
                </OverflowMenu>
            </Hidden>
            <Hidden {...styles.wideHidden} data-test-selector="cartActionsWide">
                <CartSaveOrderButton variant="button" extendedStyles={styles.saveOrderButton} />
                {wideHiddenOverflowMenu}
            </Hidden>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CartActions),
    definition: {
        group: "Cart",
        allowedContexts: [CartPageContext],
    },
};

export default widgetModule;
