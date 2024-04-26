import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductQuantityBreakPricing, {
    ProductQuantityBreakPricingStyles,
} from "@insite/content-library/Components/ProductQuantityBreakPricing";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import * as React from "react";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct;

export interface ProductDetailsQuantityBreakPricingStyles {
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
}

export const quantityBreakPricingStyles: ProductDetailsQuantityBreakPricingStyles = {
    quantityBreakPricing: {
        viewLink: {
            css: css`
                margin: 8px 0;
            `,
        },
    },
};

const styles = quantityBreakPricingStyles;

const ProductDetailsQuantityBreakPricing: React.FC<Props> = ({ product }) => {
    if (!product) {
        return null;
    }

    return <ProductQuantityBreakPricing extendedStyles={styles.quantityBreakPricing} />;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsQuantityBreakPricing),
    definition: {
        displayName: "Quantity Break Pricing",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
