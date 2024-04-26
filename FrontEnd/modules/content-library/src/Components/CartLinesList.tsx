import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { CartLineContext } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";
import { PromotionModel } from "@insite/client-framework/Types/ApiModels";
import CartLineCardCondensed, {
    CartLineCardCondensedStyles,
} from "@insite/content-library/Components/CartLineCardCondensed";
import CartLineCardExpanded, {
    CartLineCardExpandedStyles,
} from "@insite/content-library/Components/CartLineCardExpanded";
import CartLinesListHeader, { CartLinesListHeaderStyles } from "@insite/content-library/Components/CartLinesListHeader";
import { PaginationPresentationProps } from "@insite/mobius/Pagination";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    promotions?: PromotionModel[];
    isCondensed: boolean;
    hideCondensedSelector?: boolean;
    onChangeIsCondensed?: (event: React.SyntheticEvent<Element, Event>, value: boolean) => void;
    editable: boolean;
    showSavingsAmount: boolean;
    showSavingsPercent: boolean;
    extendedStyles?: CartLinesListStyles;
}

export interface CartLinesListStyles {
    wrapper?: InjectableCss;
    header?: CartLinesListHeaderStyles;
    cardCondensed?: CartLineCardCondensedStyles;
    cardExpanded?: CartLineCardExpandedStyles;
    pagination?: PaginationPresentationProps;
}

export const orderLinesListStyles: CartLinesListStyles = {
    pagination: {
        cssOverrides: {
            pagination: css`
                @media print {
                    display: none;
                }
            `,
        },
    },
};

const CartLinesList: FC<OwnProps> = ({
    cart,
    promotions,
    isCondensed,
    hideCondensedSelector,
    onChangeIsCondensed,
    editable,
    showSavingsAmount,
    showSavingsPercent,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(orderLinesListStyles, extendedStyles));

    if (!cart.cartLines) {
        return null;
    }

    const cartLines =
        cart.status === "Cart" ? cart.cartLines.filter(cartline => !cartline.quoteRequired) : cart.cartLines;

    const CartLineComponent = isCondensed ? CartLineCardCondensed : CartLineCardExpanded;

    return (
        <StyledWrapper {...styles.wrapper} data-test-selector={`cardLinesList_${cart.id}`}>
            <CartLinesListHeader
                productsCount={cartLines.length}
                isCondensed={isCondensed}
                hideCondensedSelector={hideCondensedSelector}
                onChangeIsCondensed={onChangeIsCondensed}
                extendedStyles={styles.header}
            />
            {cartLines!.map(cartLine => {
                const cartLinePromotions = promotions?.filter(promotion => promotion.orderLineId === cartLine.id);
                return (
                    <CartLineContext.Provider value={cartLine} key={cartLine.id}>
                        <CartLineComponent
                            cart={cart}
                            promotions={cartLinePromotions}
                            editable={editable}
                            showSavingsAmount={showSavingsAmount}
                            showSavingsPercent={showSavingsPercent}
                            showInvalidPriceMessage={true}
                            extendedStyles={isCondensed ? styles.cardCondensed : styles.cardExpanded}
                        />
                    </CartLineContext.Provider>
                );
            })}
        </StyledWrapper>
    );
};

export default CartLinesList;
