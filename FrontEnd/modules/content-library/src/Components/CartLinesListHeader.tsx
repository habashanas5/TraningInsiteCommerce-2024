import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import translate from "@insite/client-framework/Translate";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { FC } from "react";
import { css } from "styled-components";

export interface CartLinesListHeaderStyles {
    wrapper?: InjectableCss;
    productCountText?: TypographyPresentationProps;
    checkboxGroup?: FieldSetGroupPresentationProps<CheckboxGroupComponentProps>;
    condensedCheckbox?: CheckboxPresentationProps;
}

export const cartLinesListHeaderStyles: CartLinesListHeaderStyles = {
    wrapper: {
        css: css`
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid ${getColor("common.border")};
            padding-bottom: 10px;
        `,
    },
    productCountText: { weight: 600 },
    checkboxGroup: {
        css: css`
            @media print {
                display: none;
            }
        `,
    },
};

const CartLinesListHeader: FC<{
    productsCount: number;
    isCondensed: boolean;
    hideCondensedSelector?: boolean;
    onChangeIsCondensed?: (event: React.SyntheticEvent, value: boolean) => void;
    extendedStyles?: CartLinesListHeaderStyles;
}> = ({ productsCount, onChangeIsCondensed, extendedStyles, isCondensed, hideCondensedSelector }) => {
    const [styles] = React.useState(() => mergeToNew(cartLinesListHeaderStyles, extendedStyles));

    const productsLabel = productsCount > 1 ? "Products" : "Product";

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.productCountText} as="h3">
                {productsCount} {translate(productsLabel)}
            </Typography>
            {!hideCondensedSelector && (
                <CheckboxGroup {...styles.checkboxGroup}>
                    <Checkbox {...styles.condensedCheckbox} checked={isCondensed} onChange={onChangeIsCondensed}>
                        {translate("Condensed View")}
                        <VisuallyHidden>{translate("for product list")}</VisuallyHidden>
                    </Checkbox>
                </CheckboxGroup>
            )}
        </StyledWrapper>
    );
};

export default CartLinesListHeader;
