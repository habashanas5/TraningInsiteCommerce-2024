import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct;

export interface ProductDetailsPartNumberStyles {
    labelText?: TypographyProps;
    valueText?: TypographyProps;
}

export const partNumberStyles: ProductDetailsPartNumberStyles = {
    labelText: {
        size: 16,
        weight: "bold",
        css: css`
            margin-right: 15px;
        `,
    },
    valueText: {
        size: 16,
        css: css`
            margin-bottom: 5px;
        `,
    },
};

const styles = partNumberStyles;

const ProductDetailsPartNumber: React.FC<Props> = ({ product }) => {
    if (!product.productNumber) {
        return null;
    }

    return (
        <Typography {...styles.valueText} as="p" data-test-selector="ProductDetailsPartNumber">
            <Typography {...styles.labelText}>{translate("Part #")}</Typography>
            {product.productNumber}
        </Typography>
    );
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsPartNumber),
    definition: {
        displayName: "Part Number",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
