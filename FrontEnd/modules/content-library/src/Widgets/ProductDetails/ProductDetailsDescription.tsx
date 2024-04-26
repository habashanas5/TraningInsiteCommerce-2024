import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import * as React from "react";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct;

export interface ProductDetailsDescriptionStyles {
    wrapper?: InjectableCss;
}

export const descriptionStyles: ProductDetailsDescriptionStyles = {
    wrapper: {
        css: css`
            margin-bottom: 15px;
        `,
    },
};

const styles = descriptionStyles;

const ProductDetailsDescription: React.FC<Props> = ({ product }) => {
    if (!product.content) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <div data-test-selector="productDetails_htmlContent">
                {parse(product.content.htmlContent, parserOptions)}
            </div>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsDescription),
    definition: {
        displayName: "Description",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
