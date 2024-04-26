import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getProductCompareReturnUrl,
    getProductIdsForCompare,
    getProductsForCompare,
} from "@insite/client-framework/Store/Components/CompareProductsDrawer/CompareProductsDrawerSelectors";
import loadProductIdsToCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/LoadProductIdsToCompare";
import loadProductCompareReturnUrl from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/LoadProductReturnUrl";
import loadProductsToCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/LoadProductsToCompare";
import removeAllProductsFromCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/RemoveAllProductsFromCompare";
import removeProductIdToCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/RemoveProductFromCompare";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductCarouselProductFull, {
    ProductCarouselProductFullStyles,
} from "@insite/content-library/Components/ProductCarouselProductFull";
import ProductCompareCarouselComponent, {
    CarouselStyles,
    ProductCarouselSlideDetails,
} from "@insite/content-library/Components/ProductCompareCarousel";
import { ProductComparePageContext } from "@insite/content-library/Pages/ProductComparePage";
import Button, { ButtonIcon, ButtonIconPresentationProps, ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import X from "@insite/mobius/Icons/X";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    productIds: getProductIdsForCompare(state),
    products: getProductsForCompare(state),
    homePageUrl: getPageLinkByPageType(state, "HomePage")?.url,
    returnUrl: getProductCompareReturnUrl(state),
});

const mapDispatchToProps = {
    loadProductIdsToCompare,
    loadProductCompareReturnUrl,
    loadProductsToCompare,
    removeProductIdToCompare,
    removeAllProductsFromCompare,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface ProductCompareCarouselStyles {
    container?: GridContainerProps;
    navigationLinkGridItem?: GridItemProps;
    navigationLink?: LinkPresentationProps;
    headerGridItem?: GridItemProps;
    headerContainer?: GridContainerProps;
    headerTextGridItem?: GridItemProps;
    headerText?: TypographyPresentationProps;
    headerButtonsGridItem?: GridItemProps;
    headerRemoveAllButton?: ButtonPresentationProps;
    carouselGridItem?: GridItemProps;
    productFull?: ProductCarouselProductFullStyles;
    removeProductFromCompareClickable?: ClickablePresentationProps;
    removeProductFromCompareButtonIcon?: ButtonIconPresentationProps;
    carousel?: CarouselStyles;
}

export const ProductCompareCarouselStyles: ProductCompareCarouselStyles = {
    navigationLinkGridItem: {
        width: 12,
    },
    navigationLink: {
        icon: { iconProps: { src: ChevronLeft } },
        typographyProps: { size: 15 },
    },
    headerGridItem: {
        width: 12,
    },
    headerTextGridItem: {
        width: [12, 6, 6, 6, 6],
    },
    headerText: {
        variant: "h2",
        forwardAs: "h1",
    },
    headerButtonsGridItem: {
        width: [12, 6, 6, 6, 6],
        css: css`
            justify-content: flex-end;
        `,
    },
    carouselGridItem: {
        width: 12,
    },
    removeProductFromCompareClickable: {
        css: css`
            position: absolute;
            right: 0;
        `,
    },
    removeProductFromCompareButtonIcon: {
        src: X,
    },
};

const mapProductsToSlideAttributeTypes = (products: ProductModel[]) =>
    products
        .map(a => a.attributeTypes || [])
        .reduce((acc, current) => {
            return [...(acc || []), ...current];
        }, [])
        .filter((current, index, self) => index === self.findIndex(a => a.name === current.name));

const mapProductsToSlides = (
    products: ProductModel[],
    productCompareCarouselId: string,
    styles: ProductCompareCarouselStyles,
    removeProductIdToCompare: (productId: string) => void,
) =>
    products.map(product => ({
        id: product.id,
        renderComponent: function ProductCarouselProductCondensedRenderer() {
            return (
                <ProductCarouselProductFull
                    {...styles.productFull}
                    carouselId={productCompareCarouselId}
                    product={product}
                    actionsTemplate={(product: ProductModel) => {
                        return (
                            <Clickable
                                onClick={() => removeProductIdToCompare(product.id)}
                                data-test-selector="productCompareRemoveProductButton"
                                data-test-key={product.id}
                                {...styles.removeProductFromCompareClickable}
                            >
                                <VisuallyHidden>
                                    {translate("Remove Product {0} from Compare", product.productTitle)}
                                </VisuallyHidden>
                                <ButtonIcon {...styles.removeProductFromCompareButtonIcon} />
                            </Clickable>
                        );
                    }}
                />
            );
        },
    }));

const styles = ProductCompareCarouselStyles;

const ProductCompareCarousel = ({
    history,
    productIds,
    products,
    homePageUrl,
    returnUrl,
    loadProductIdsToCompare,
    loadProductCompareReturnUrl,
    loadProductsToCompare,
    removeProductIdToCompare,
    removeAllProductsFromCompare,
}: Props) => {
    const productCompareCarouselId = "product-compare-carousel-id";
    const [lastProductCount, setLastProductCount] = useState<number>(0);

    const [slideDetails, setSlideDetails] = useState<ProductCarouselSlideDetails>({
        products: [],
        attributeTypes: [],
        slides: [],
    });

    useEffect(() => {
        // We load in the ProductIds to Compare from storage
        loadProductIdsToCompare();
        loadProductCompareReturnUrl();
    }, []);

    useEffect(() => {
        // Load in products from the ProductCompareService Compare Storage
        if (productIds.length === 0) {
            if (lastProductCount > 0) {
                // Navigate back to last page or homepage
                let url = homePageUrl ?? "";
                if (returnUrl) {
                    url = returnUrl;
                }
                history.push(url);
            }
            return;
        }

        loadProductsToCompare({ id: productCompareCarouselId, productIds, includeAttributeTypes: true });
    }, [productIds]);

    useEffect(() => {
        if (products.length === 0) {
            return;
        }
        setSlideDetails({
            products,
            attributeTypes: mapProductsToSlideAttributeTypes(products),
            slides: mapProductsToSlides(products, productCompareCarouselId, styles, (productId: string) =>
                removeProductIdToCompare({ productId }),
            ),
        });
        setLastProductCount(products.length);
    }, [products]);

    const goBack = () => {
        if (returnUrl) {
            history.push(returnUrl);
        }
    };

    const onRemoveAll = () => {
        removeAllProductsFromCompare();
        let url = homePageUrl ?? "";
        if (returnUrl) {
            url = returnUrl;
        }
        history.push(url);
    };

    return (
        <GridContainer {...styles.container}>
            {returnUrl && (
                <GridItem {...styles.navigationLinkGridItem}>
                    <Link {...styles.navigationLink} onClick={goBack} data-test-selector="productCompareGoBackButton">
                        {translate("Back to Previous Page")}
                    </Link>
                </GridItem>
            )}
            {products.length !== 0 && (
                <>
                    <GridItem {...styles.headerGridItem}>
                        <GridContainer {...styles.headerContainer}>
                            <GridItem {...styles.headerTextGridItem}>
                                <Typography {...styles.headerText}>{translate("Compare Products")}</Typography>
                            </GridItem>
                            <GridItem {...styles.headerButtonsGridItem}>
                                <Button
                                    {...styles.headerRemoveAllButton}
                                    variant="secondary"
                                    onClick={onRemoveAll}
                                    data-test-selector="productCompareRemoveAllButton"
                                >
                                    {translate("Remove All")}
                                </Button>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.carouselGridItem}>
                        <ProductCompareCarouselComponent
                            id={productCompareCarouselId}
                            extendedStyles={styles.carousel}
                            maxNumberOfColumns={3}
                            title={translate("Compare Products Carousel")}
                            hideTitle={true}
                            slideDetails={slideDetails}
                        />
                    </GridItem>
                </>
            )}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(ProductCompareCarousel)),
    definition: {
        group: "Product Compare",
        icon: "List",
        allowedContexts: [ProductComparePageContext],
    },
};

export default widgetModule;
