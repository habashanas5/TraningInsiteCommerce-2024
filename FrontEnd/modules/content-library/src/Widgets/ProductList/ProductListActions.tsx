import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import ProductAddToListLink, {
    ProductAddToListLinkStyles,
} from "@insite/content-library/Components/ProductAddToListLink";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductQuantityBreakPricing, {
    ProductQuantityBreakPricingStyles,
} from "@insite/content-library/Components/ProductQuantityBreakPricing";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import { SelectPresentationProps } from "@insite/mobius/Select";
import { TextFieldProps } from "@insite/mobius/TextField";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    showPrice: boolean;
    showAddToList: boolean;
}

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

const mapDispatchToProps = {};

type Props = ReturnType<typeof mapStateToProps> &
    HasProductContext &
    ResolveThunks<typeof mapDispatchToProps> &
    OwnProps;

export interface ProductListActionsStyles {
    wrapper?: InjectableCss;
    addToCartWrapper?: InjectableCss;
    addToCartButton?: ButtonPresentationProps;
    quantityOrdered?: TextFieldProps;
    unitOfMeasureSelect?: SelectPresentationProps;
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
    price?: ProductPriceStyles;
    addToListLink?: ProductAddToListLinkStyles;
    addToListWrapper?: InjectableCss;
}

export const actionsStyles: ProductListActionsStyles = {
    wrapper: {
        css: css`
            display: flex;
            width: 100%;
            flex-direction: column;
        `,
    },
    unitOfMeasureSelect: {
        cssOverrides: {
            formField: css`
                margin-top: 20px;
            `,
        },
    },
    quantityBreakPricing: {
        viewLink: {
            css: css`
                margin: 8px 0;
            `,
        },
    },
    addToCartWrapper: {
        css: css`
            display: flex;
            align-items: flex-end;
            margin-top: 10px;
        `,
    },
    addToCartButton: {
        css: css`
            width: 80%;
        `,
    },
    quantityOrdered: {
        cssOverrides: {
            formField: css`
                margin-right: 10px;
                width: 4.1rem;
                min-width: 4.1rem;
            `,
        },
    },
    addToListWrapper: {
        css: css`
            margin-top: 20px;
            min-height: 2rem;
        `,
    },
};

const styles = actionsStyles;

const ProductListActions: FC<Props> = ({ productContext, productSettings, showPrice, showAddToList }) => {
    return (
        <StyledWrapper {...styles.wrapper}>
            {showPrice && (
                <>
                    <ProductPrice
                        product={productContext}
                        showLabel={false}
                        showSavings={true}
                        showSavingsAmount={productSettings.showSavingsAmount}
                        showSavingsPercent={productSettings.showSavingsPercent}
                        extendedStyles={styles.price}
                    />
                    <ProductQuantityBreakPricing extendedStyles={styles.quantityBreakPricing} />
                </>
            )}
            <ProductUnitOfMeasureSelect extendedStyles={styles.unitOfMeasureSelect} />
            <StyledWrapper {...styles.addToCartWrapper}>
                <ProductQuantityOrdered extendedStyles={styles.quantityOrdered} />
                <ProductAddToCartButton
                    data-test-selector={`actionsAddToCart${productContext.product.id}`}
                    extendedStyles={styles.addToCartButton}
                />
            </StyledWrapper>
            {showAddToList && (
                <StyledWrapper {...styles.addToListWrapper}>
                    <ProductAddToListLink
                        data-test-selector={`actionsAddToList${productContext.product.id}`}
                        extendedStyles={styles.addToListLink}
                    />
                </StyledWrapper>
            )}
        </StyledWrapper>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withProductContext(ProductListActions));
