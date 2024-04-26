/* eslint-disable spire/export-styles */
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import logger from "@insite/client-framework/Logger";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { canAddToCart, hasEnoughInventory } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import translate from "@insite/client-framework/Translate";
import TextField, { TextFieldPresentationProps, TextFieldProps } from "@insite/mobius/TextField";
import React, { ChangeEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends TextFieldProps {
    configurationCompleted?: boolean;
    variantSelectionCompleted?: boolean;
    labelOverride?: React.ReactNode;
    extendedStyles?: TextFieldPresentationProps;
}

const mapStateToProps = (
    state: ApplicationState,
    props: { configurationCompleted?: boolean; variantSelectionCompleted?: boolean } & HasProductContext,
) => {
    return {
        productSettings: getSettingsCollection(state).productSettings,
        canAddToCart: canAddToCart(
            state,
            props.productContext.product,
            props.productContext.productInfo,
            props.configurationCompleted,
            props.variantSelectionCompleted,
        ),
        hasEnoughInventory: hasEnoughInventory(state, props.productContext),
    };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & HasProductContext;

export const productQuantityOrderedStyles: TextFieldPresentationProps = {
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
        inputSelect: css`
            /* ISC-11023 deal with this. */
            /* stylelint-disable-next-line */
            -moz-appearance: textfield;
        `,
    },
};

const ProductQuantityOrdered = ({
    productSettings,
    hasEnoughInventory,
    productContext: {
        product: { id: productId },
        onQtyOrderedChanged,
        productInfo: { qtyOrdered },
    },
    labelOverride,
    extendedStyles,
    canAddToCart,
    configurationCompleted,
    variantSelectionCompleted,
    ...otherProps
}: Props) => {
    const [styles] = useState(() => mergeToNew(productQuantityOrderedStyles, extendedStyles));
    const [productQty, setProductQty] = useState(qtyOrdered.toString());

    useEffect(() => {
        if (qtyOrdered === Number(productQty)) {
            return;
        }
        setProductQty(`${qtyOrdered || ""}`);
    }, [qtyOrdered]);

    if (!productSettings.canAddToCart || !hasEnoughInventory || !canAddToCart) {
        return null;
    }

    const keyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.which === 13) {
            (event.target as any).blur();
        }
    };

    const qtyChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setProductQty(value);

        if (!onQtyOrderedChanged) {
            logger.warn(`There was no onQtyOrderedChanged passed to the ProductContext for ${productId}`);
            return;
        }

        const possibleNumber = Number(value);
        if (!Number.isNaN(possibleNumber)) {
            onQtyOrderedChanged(possibleNumber);
        }
    };

    return (
        <TextField
            label={labelOverride ?? translate("QTY")}
            value={productQty}
            type="number"
            min={0}
            max={999999}
            data-test-selector="product_qtyOrdered"
            {...otherProps}
            onKeyPress={keyPressHandler}
            onChange={qtyChangeHandler}
            {...styles}
        />
    );
};

export default withProductContext(connect(mapStateToProps)(ProductQuantityOrdered));
