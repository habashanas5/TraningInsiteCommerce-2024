import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductShareLink, { ProductShareLinkStyles } from "@insite/content-library/Components/ProductShareLink";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    variantSelectionCompleted: state.pages.productDetails.variantSelectionCompleted,
});

export interface ProductDetailsShareLinkStyles {
    wrapper?: InjectableCss;
    link?: ProductShareLinkStyles;
}

export const shareLinkStyles: ProductDetailsShareLinkStyles = {
    wrapper: {
        css: css`
            margin-top: 30px;
            text-align: center;
        `,
    },
};

const styles = shareLinkStyles;

const ProductDetailsShareLink: React.FC<Props> = ({ product }) => {
    if (!product) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <ProductShareLink extendedStyles={styles.link} />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsShareLink)),
    definition: {
        displayName: "Share Link",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
