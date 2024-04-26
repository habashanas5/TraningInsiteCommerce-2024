import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductAddToListLink, {
    ProductAddToListLinkStyles,
} from "@insite/content-library/Components/ProductAddToListLink";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

type OwnProps = WidgetProps & HasProduct & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    variantSelectionCompleted: state.pages.productDetails.variantSelectionCompleted,
});

export interface ProductDetailsAddToListLinkStyles {
    wrapper?: InjectableCss;
    link?: ProductAddToListLinkStyles;
}

export const addToListLinkStyles: ProductDetailsAddToListLinkStyles = {
    wrapper: {
        css: css`
            margin-top: 30px;
            text-align: center;
        `,
    },
};

const styles = addToListLinkStyles;

const ProductDetailsAddToListLink: React.FC<OwnProps> = ({ product, variantSelectionCompleted }) => {
    if (!product.canAddToWishlist && !variantSelectionCompleted) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <ProductAddToListLink data-test-selector="productDetails_addToList" extendedStyles={styles.link} />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsAddToListLink)),
    definition: {
        displayName: "Add to List Link",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
