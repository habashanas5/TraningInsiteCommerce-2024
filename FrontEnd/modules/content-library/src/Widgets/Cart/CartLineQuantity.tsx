import useAccessibleSubmit from "@insite/client-framework/Common/Hooks/useAccessibleSubmit";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { isOutOfStock } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import translate from "@insite/client-framework/Translate";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    /**
     * If true, the qtyOrdered will display in a text field for editing.
     * If false, the qtyOrdered will display as read-only text.
     * Default value: false
     */
    editable?: boolean;
    onQtyOrderedChange?: (qtyOrdered: number) => void;
    extendedStyles?: CartLineQuantityStyles;
    label?: string;
}

const mapStateToProps = (state: ApplicationState) => ({
    isLoading: state.data.carts.isLoading,
    cartLoadedTime: state.data.carts.cartLoadedTime,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & HasCartLineContext;

export interface CartLineQuantityStyles {
    editableQuantityTextField?: TextFieldPresentationProps;
    readOnlyQuantityText?: SmallHeadingAndTextStyles;
}

export const cartLineQuantityStyles: CartLineQuantityStyles = {
    editableQuantityTextField: {
        labelProps: {
            variant: "legend",
            css: css`
                font-size: 10px;
                text-transform: uppercase;
                font-weight: 600;
            `,
        },
    },
};

const CartLineQuantity: FC<Props> = ({
    cart,
    cartLine,
    editable = false,
    label,
    isLoading,
    cartLoadedTime,
    onQtyOrderedChange = () => {},
    extendedStyles,
}) => {
    const localOnQtyOrderedChange = (value: string) => {
        const inputQty = parseFloat(value);
        if (Number.isNaN(inputQty)) {
            return;
        }

        onQtyOrderedChange(inputQty);
    };

    const { value, changeHandler, keyDownHandler, blurHandler } = useAccessibleSubmit(
        cartLine.qtyOrdered!.toString(),
        localOnQtyOrderedChange,
        cartLoadedTime,
    );

    const [styles] = React.useState(() => mergeToNew(cartLineQuantityStyles, extendedStyles));

    if (editable && !isOutOfStock(cartLine)) {
        return (
            <TextField
                {...styles.editableQuantityTextField}
                type="number"
                min={0}
                max={999999}
                label={label || translate("QTY")}
                value={value}
                disabled={!cart.canModifyOrder || cartLine.isPromotionItem || cart.type === "Job" || isLoading[cart.id]}
                onChange={changeHandler}
                onKeyDown={keyDownHandler}
                onBlur={blurHandler}
                data-test-selector="cartline_qty"
            />
        );
    }

    return (
        <SmallHeadingAndText
            {...styles.readOnlyQuantityText}
            heading={label || translate("QTY")}
            text={cartLine.qtyOrdered!}
        />
    );
};

export default connect(mapStateToProps)(withCartLine(CartLineQuantity));
