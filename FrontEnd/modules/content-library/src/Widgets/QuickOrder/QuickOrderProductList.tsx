import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { ProductContext, ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getProductState } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import calculateTotal from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/CalculateTotal";
import changeProductQty from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/ChangeProductQty";
import removeProduct from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/RemoveProduct";
import translate from "@insite/client-framework/Translate";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CardContainer, { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import CardList from "@insite/content-library/Components/CardList";
import LocalizedCurrency from "@insite/content-library/Components/LocalizedCurrency";
import ProductAddToListLink, {
    ProductAddToListLinkStyles,
} from "@insite/content-library/Components/ProductAddToListLink";
import { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductContextAvailability from "@insite/content-library/Components/ProductContextAvailability";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import { QuickOrderPageContext } from "@insite/content-library/Pages/QuickOrderPage";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import XCircle from "@insite/mobius/Icons/XCircle";
import { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    productInfos: state.pages.quickOrder.productInfos,
    products: state.pages.quickOrder.productInfos.map(o => getProductState(state, o.productId).value) as (
        | ProductModel
        | undefined
    )[],
    total: state.pages.quickOrder.total,
    currencySymbol: state.context.session.currency?.currencySymbol || "",
});

const mapDispatchToProps = {
    calculateTotal,
    changeProductQty,
    removeProduct,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface QuickOrderProductListStyles {
    wrapper?: InjectableCss;
    cardContainer?: CardContainerStyles;
    gridContainer?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    productInfoGridItem?: GridItemProps;
    productInfoContainer?: GridContainerProps;
    brandAndProductDescriptionGridItem?: GridItemProps;
    brand?: ProductBrandStyles;
    productDescription?: ProductDescriptionStyles;
    productNumberText?: TypographyPresentationProps;
    availability?: ProductAvailabilityStyles;
    priceAndQuantityGridItem?: GridItemProps;
    priceAndQuantityContainer?: GridContainerProps;
    priceGridItem?: GridItemProps;
    price?: ProductPriceStyles;
    quantityGridItem?: GridItemProps;
    quantityOrdered?: TextFieldProps;
    extendedPriceGridItem?: GridItemProps;
    extendedPriceText?: TypographyPresentationProps;
    removeProductGridItem?: GridItemProps;
    removeProductClickable?: ClickableProps;
    removeProductIcon?: IconPresentationProps;
    addToListLink?: ProductAddToListLinkStyles;
    totalText?: TypographyPresentationProps;
}

export const quickOrderProductListStyles: QuickOrderProductListStyles = {
    wrapper: {
        css: css`
            padding-bottom: 20px;
            margin-top: 20px;
        `,
    },
    cardContainer: {
        cardDivider: {
            css: css`
                margin: 0 20px;
                width: 100%;
                border-top: 1px solid ${getColor("common.border")};
                &:last-child {
                    border-bottom: 1px solid ${getColor("common.border")};
                }
            `,
        },
    },
    productImageGridItem: {
        width: 2,
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        padding-left: 0;
                        padding-right: 0;
                        font-size: 10px;
                    `,
                    css`
                        padding-left: 0;
                        padding-right: 0;
                        font-size: 10px;
                    `,
                    css`
                        padding-left: 0;
                    `,
                    css`
                        padding-left: 0;
                    `,
                    css`
                        padding-left: 0;
                    `,
                ])}
        `,
    },
    productInfoGridItem: { width: [7, 7, 7, 8, 8] },
    brandAndProductDescriptionGridItem: {
        width: [12, 12, 12, 6, 5],
        css: css`
            flex-direction: column;
        `,
    },
    availability: {
        container: {
            css: css`
                margin-top: 10px;
            `,
        },
    },
    priceAndQuantityGridItem: { width: [12, 12, 12, 6, 7] },
    priceGridItem: {
        width: [12, 12, 4, 4, 4],
        css: css`
            flex-direction: column;
            justify-content: center;
        `,
    },
    quantityGridItem: { width: [6, 6, 5, 5, 4] },
    quantityOrdered: {
        labelPosition: "left",
        labelProps: {
            css: css`
                width: auto;
                display: inline-flex;
            `,
        },
        cssOverrides: {
            formInputWrapper: css`
                width: 70px;
            `,
        },
    },
    extendedPriceGridItem: { width: [6, 6, 3, 3, 4] },
    extendedPriceText: {
        css: css`
            font-weight: bold;
            align-self: center;
        `,
    },
    removeProductGridItem: {
        css: css`
            text-align: center;
            display: block;
        `,
        width: [3, 3, 3, 2, 2],
    },
    removeProductClickable: {
        css: css`
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 15px;
        `,
    },
    removeProductIcon: { src: XCircle },
    totalText: {
        css: css`
            float: right;
            font-weight: bold;
            margin: 15px 0;
        `,
    },
};

const styles = quickOrderProductListStyles;
const StyledSection = getStyledWrapper("section");

const QuickOrderProductList: FC<Props> = ({
    products,
    productInfos,
    total,
    currencySymbol,
    calculateTotal,
    changeProductQty,
    removeProduct,
}) => {
    if (!products || products.length === 0) {
        return null;
    }

    React.useEffect(() => calculateTotal(), [products]);

    const removeProductHandler = (productInfo: ProductInfo) => {
        removeProduct({ productId: productInfo.productId, unitOfMeasure: productInfo.unitOfMeasure });
    };

    const productListDisplay = products.map((product, index) => {
        if (!product || index >= productInfos.length) {
            return;
        }
        const productInfo = productInfos[index];

        const productContext: ProductContextModel = {
            product,
            productInfo,
            onQtyOrderedChanged: qtyOrdered => {
                changeProductQty({
                    qtyOrdered,
                    productId: product.id,
                    unitOfMeasure: productInfo.unitOfMeasure,
                    product,
                });
            },
        };
        return (
            <ProductContext.Provider value={productContext} key={product.id + productInfo.unitOfMeasure}>
                <CardContainer extendedStyles={styles.cardContainer}>
                    <GridContainer
                        {...styles.gridContainer}
                        data-test-selector={`QuickOrderProductList_ProductId_${product.id}`}
                    >
                        <GridItem {...styles.productImageGridItem}>
                            <ProductImage product={productContext} extendedStyles={styles.productImage} />
                        </GridItem>
                        <GridItem {...styles.productInfoGridItem}>
                            <GridContainer {...styles.productInfoContainer}>
                                <GridItem {...styles.brandAndProductDescriptionGridItem}>
                                    <ProductBrand brand={product.brand!} extendedStyles={styles.brand} />
                                    <ProductDescription
                                        product={productContext}
                                        extendedStyles={styles.productDescription}
                                    />
                                    <Typography {...styles.productNumberText}>{product.productNumber}</Typography>
                                    {!product.quoteRequired && (
                                        <ProductContextAvailability extendedStyles={styles.availability} />
                                    )}
                                </GridItem>
                                <GridItem {...styles.priceAndQuantityGridItem}>
                                    <GridContainer {...styles.priceAndQuantityContainer}>
                                        <GridItem {...styles.priceGridItem}>
                                            <ProductPrice
                                                product={productContext}
                                                currencySymbol={currencySymbol}
                                                showSavings={false}
                                                showLabel={false}
                                                extendedStyles={styles.price}
                                            />
                                        </GridItem>
                                        <GridItem {...styles.quantityGridItem}>
                                            <ProductQuantityOrdered extendedStyles={styles.quantityOrdered} />
                                        </GridItem>
                                        <GridItem {...styles.extendedPriceGridItem}>
                                            {!product.quoteRequired && !productInfo.pricing?.requiresRealTimePrice && (
                                                <Typography {...styles.extendedPriceText}>
                                                    {" "}
                                                    {productInfo.pricing?.extendedUnitNetPriceDisplay}{" "}
                                                </Typography>
                                            )}
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                        <GridItem {...styles.removeProductGridItem}>
                            <Clickable
                                {...styles.removeProductClickable}
                                onClick={() => removeProductHandler(productInfo)}
                            >
                                <IconMemo {...styles.removeProductIcon} />
                            </Clickable>
                            <ProductAddToListLink extendedStyles={styles.addToListLink} />
                        </GridItem>
                    </GridContainer>
                </CardContainer>
            </ProductContext.Provider>
        );
    });

    return (
        <>
            <StyledSection {...styles.wrapper}>
                <CardList>{productListDisplay}</CardList>
            </StyledSection>
            <Typography {...styles.totalText}>
                {`${translate("Total")}`} <LocalizedCurrency amount={total} />
            </Typography>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(QuickOrderProductList),
    definition: {
        group: "Quick Order",
        icon: "List",
        allowedContexts: [QuickOrderPageContext],
    },
};

export default widgetModule;
