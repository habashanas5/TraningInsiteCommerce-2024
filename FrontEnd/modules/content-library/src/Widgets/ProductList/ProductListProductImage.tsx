import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getIsProductCompareFull,
    getProductCompareChecked,
} from "@insite/client-framework/Store/Components/CompareProductsDrawer/CompareProductsDrawerSelectors";
import addProductToCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/AddProductToCompare";
import removeProductFromCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/RemoveProductFromCompare";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    showImage: boolean;
    showCompare: boolean;
    extendedStyles?: ProductListProductImageStyles;
}

const mapStateToProps = (state: ApplicationState, props: HasProductContext) => ({
    settingsCollection: getSettingsCollection(state),
    productCompareChecked: getProductCompareChecked(state, props.productContext),
    isProductCompareFull: getIsProductCompareFull(state),
});

const mapDispatchToProps = {
    addProductToCompare,
    removeProductFromCompare,
};

type Props = ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    OwnProps &
    HasProductContext;

export interface ProductListProductImageStyles {
    wrapper?: InjectableCss;
    productImage?: ProductImageStyles;
    compareCheckbox?: CheckboxPresentationProps;
}

export const productImageStyles: ProductListProductImageStyles = {
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            width: 100%;
        `,
    },
    compareCheckbox: {
        css: css`
            align-self: center;
            padding-top: 20px;
        `,
    },
    productImage: {
        image: {
            css: css`
                img {
                    min-width: 100%;
                }
            `,
        },
    },
};

const ProductListProductImage: FC<Props> = ({
    productContext,
    showImage,
    showCompare,
    isProductCompareFull,
    settingsCollection,
    productCompareChecked,
    extendedStyles,
    addProductToCompare,
    removeProductFromCompare,
}) => {
    const toasterContext = React.useContext(ToasterContext);
    const [styles] = useState(() => mergeToNew(productImageStyles, extendedStyles));

    const handleChanged = (_: React.SyntheticEvent, value: boolean) => {
        if (value && isProductCompareFull) {
            toasterContext.addToast({
                body: siteMessage("ProductionCompare_MaximumItemsReached"),
                messageType: "warning",
            });
        } else if (value) {
            addProductToCompare({ productId: productContext.product.id });
        } else {
            removeProductFromCompare({ productId: productContext.product.id });
        }
    };
    return (
        <StyledWrapper
            {...styles.wrapper}
            data-test-selector="productListProductImage"
            data-test-key={productContext.product.id}
        >
            {showImage && <ProductImage extendedStyles={styles.productImage} product={productContext} />}
            {showCompare && settingsCollection.productSettings.enableProductComparisons && (
                <Checkbox {...styles.compareCheckbox} checked={productCompareChecked} onChange={handleChanged}>
                    {translate("Compare")}
                </Checkbox>
            )}
        </StyledWrapper>
    );
};

export default withProductContext(connect(mapStateToProps, mapDispatchToProps)(ProductListProductImage));
