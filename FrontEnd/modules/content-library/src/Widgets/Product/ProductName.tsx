/* eslint-disable spire/export-styles */
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import * as React from "react";

const ProductName: React.FC<HasProduct> = ({ product }) => {
    if (!product) {
        return null;
    }

    return (
        <div>
            <span>{product.productNumber}</span>
            {product.manufacturerItem && (
                <span>
                    {translate("MFG #")}': {product.manufacturerItem}
                </span>
            )}
            {product.customerProductNumber && (
                <span>
                    {translate("My Part #")}: {product.customerProductNumber}
                </span>
            )}
        </div>
    );
};

const productNameModule: WidgetModule = {
    component: withProduct(ProductName),
    definition: {
        group: "Products",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default productNameModule;
