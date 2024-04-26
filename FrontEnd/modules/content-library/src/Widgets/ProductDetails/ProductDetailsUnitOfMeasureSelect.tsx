import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import { SelectPresentationProps } from "@insite/mobius/Select";
import * as React from "react";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct;

export interface ProductDetailsUnitOfMeasureSelectStyles {
    unitOfMeasureSelect?: SelectPresentationProps;
}

export const unitOfMeasureSelectStyles: ProductDetailsUnitOfMeasureSelectStyles = {
    unitOfMeasureSelect: {
        cssOverrides: {
            formField: css`
                margin-top: 10px;
            `,
        },
    },
};

const styles = unitOfMeasureSelectStyles;

const ProductDetailsUnitOfMeasureSelect: React.FC<Props> = ({ product }) => {
    if (!product || !product.unitOfMeasures) {
        return null;
    }

    return <ProductUnitOfMeasureSelect extendedStyles={styles.unitOfMeasureSelect} />;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsUnitOfMeasureSelect),
    definition: {
        displayName: "Unit of Measure Select",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
