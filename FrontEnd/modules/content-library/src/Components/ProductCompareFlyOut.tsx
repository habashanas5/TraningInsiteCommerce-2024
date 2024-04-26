import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getProductIdsForCompare,
    getProductsForCompare,
} from "@insite/client-framework/Store/Components/CompareProductsDrawer/CompareProductsDrawerSelectors";
import loadProductIdsToCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/LoadProductIdsToCompare";
import loadProductsToCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/LoadProductsToCompare";
import removeAllProductsFromCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/RemoveAllProductsFromCompare";
import removeProductIdToCompare from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/RemoveProductFromCompare";
import setProductCompareReturnUrl from "@insite/client-framework/Store/Components/CompareProductsDrawer/Handlers/SetProductCompareReturnUrl";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import Carousel, { CarouselSlide, CarouselStyles } from "@insite/content-library/Components/Carousel";
import ProductCarouselProductCondensed from "@insite/content-library/Components/ProductCarouselProductCondensed";
import Button, { ButtonIcon, ButtonIconPresentationProps, ButtonPresentationProps } from "@insite/mobius/Button";
import Drawer, { DrawerPresentationProps, DrawerProps } from "@insite/mobius/Drawer";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import X from "@insite/mobius/Icons/X";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import getColor from "@insite/mobius/utilities/getColor";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const PRODUCT_COMPARE_CAROUSEL_ID = "product-compare-carousel-id";

interface OwnProps {
    extendedStyles?: ProductCompareFlyOutStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

const mapStateToProps = (state: ApplicationState) => ({
    productIds: getProductIdsForCompare(state),
    products: getProductsForCompare(state),
    productComparePageLink: getPageLinkByPageType(state, "ProductComparePage"),
    currentLocation: getLocation(state),
});

const mapDispatchToProps = {
    loadProductIdsToCompare,
    loadProductsToCompare,
    removeProductIdToCompare,
    removeAllProductsFromCompare,
    setProductCompareReturnUrl,
};

export interface ProductCompareFlyOutStyles {
    carousel?: CarouselStyles;
    carouselDrawer?: DrawerPresentationProps;
    carouselDrawerContainer?: InjectableCss;
    removeProductFromCompareButton?: ButtonPresentationProps;
    removeProductFromCompareButtonIcon?: ButtonIconPresentationProps;
    headerGridContainer?: GridContainerProps;
    headerTitleGridItem?: GridItemProps;
    headerTitleText?: TypographyPresentationProps;
    headerActionsGridItem?: GridItemProps;
    headerRemoveAllButton?: ButtonPresentationProps;
    headerCompareButton?: ButtonPresentationProps;
}

export const productCompareFlyOutStyles: ProductCompareFlyOutStyles = {
    carouselDrawer: {
        position: "bottom",
        size: 200,
        cssOverrides: {
            scrim: css`
                ${({ theme }: { theme: BaseTheme }) =>
                    breakpointMediaQueries(
                        theme,
                        [
                            css`
                                height: 125px;
                            `,
                        ],
                        "max",
                    )}
            `,
            drawerBody: css`
                ${({ theme }: { theme: BaseTheme }) =>
                    breakpointMediaQueries(
                        theme,
                        [
                            css`
                                height: 125px;
                            `,
                        ],
                        "max",
                    )}
            `,
            drawerTitle: css`
                background: ${getColor("common.accent")};
                color: ${getContrastColor("common.accent")};
            `,
        },
        closeButtonProps: {
            css: css`
                display: none;
            `,
        },
        enableClickThrough: true,
    },
    carouselDrawerContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            display: none;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    carousel: {
        titleText: {
            css: css`
                display: none;
            `,
        },
    },
    removeProductFromCompareButton: {
        buttonType: "solid",
        color: "common.accent",
        sizeVariant: "small",
    },
    headerGridContainer: {
        gap: 0,
        css: css`
            margin: 0 auto;
        `,
    },
    headerTitleGridItem: {
        width: [12, 6, 6, 6, 6],
        align: "middle",
    },
    headerTitleText: {
        variant: "h5",
    },
    headerActionsGridItem: {
        width: [12, 6, 6, 6, 6],
        css: css`
            justify-content: flex-end;
        `,
    },
    headerRemoveAllButton: {
        css: css`
            margin: 5px;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            flex: 1;
                        `,
                    ],
                    "max",
                )}
        `,
        variant: "secondary",
    },
    headerCompareButton: {
        css: css`
            margin: 5px;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            flex: 1;
                        `,
                    ],
                    "max",
                )}
        `,
    },
};

const mapProductsToSlides = (
    products: ProductModel[],
    styles: ProductCompareFlyOutStyles,
    removeProductIdToCompare: (productId: string) => void,
) =>
    products.map(product => ({
        id: product.id,
        renderComponent: function ProductCarouselProductCondensedRenderer() {
            return (
                <ProductCarouselProductCondensed
                    carouselId={PRODUCT_COMPARE_CAROUSEL_ID}
                    product={product}
                    labelsVisible={false}
                    showImage={true}
                    showBrand={false}
                    showTitle={true}
                    showPartNumbers={true}
                    showPrice={true}
                    showAddToCart={false}
                    showAddToList={false}
                    condensedActionsTemplate={(product: ProductModel) => {
                        return (
                            <Button
                                {...styles.removeProductFromCompareButton}
                                onClick={() => removeProductIdToCompare(product.id)}
                                data-test-selector="productCompareRemoveProductButton"
                                data-test-key={product.id}
                            >
                                <VisuallyHidden>
                                    {translate("Remove Product {0} from Compare", product.productTitle)}
                                </VisuallyHidden>
                                <ButtonIcon {...styles.removeProductFromCompareButtonIcon} src={X} />
                            </Button>
                        );
                    }}
                />
            );
        },
    }));

const ProductCompareFlyOut = ({
    extendedStyles,
    history,
    productIds,
    products,
    productComparePageLink,
    currentLocation,
    loadProductIdsToCompare,
    loadProductsToCompare,
    removeProductIdToCompare,
    removeAllProductsFromCompare,
    setProductCompareReturnUrl,
}: Props) => {
    const [styles] = useState(() => mergeToNew(productCompareFlyOutStyles, extendedStyles));

    const [slides, setSlides] = useState<CarouselSlide[]>([]);

    useEffect(() => {
        // We load in the ProductIds to Compare from storage
        loadProductIdsToCompare();
    }, []);

    useEffect(() => {
        // Load in products from the ProductCompareService Compare Storage
        if (productIds.length === 0) {
            return;
        }

        loadProductsToCompare({ id: PRODUCT_COMPARE_CAROUSEL_ID, productIds });
    }, [productIds]);

    useEffect(() => {
        if (products.length === 0) {
            return;
        }
        setSlides(mapProductsToSlides(products, styles, productId => removeProductIdToCompare({ productId })));
    }, [products, styles]);

    const handleRemoveAll = () => {
        removeAllProductsFromCompare();
    };
    const handleOpenCompare = () => {
        if (productComparePageLink) {
            setProductCompareReturnUrl({ returnUrl: currentLocation.pathname + currentLocation.search });
            history.push(productComparePageLink.url);
        }
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <Drawer
            isOpen={true}
            headline={
                <ProductCompareHeader
                    styles={styles}
                    productCount={products.length}
                    onOpenCompare={handleOpenCompare}
                    onRemoveAll={handleRemoveAll}
                />
            }
            {...styles.carouselDrawer}
            data-test-selector="productCompareDrawer"
        >
            <StyledWrapper {...styles.carouselDrawerContainer}>
                <Carousel
                    id={PRODUCT_COMPARE_CAROUSEL_ID}
                    extendedStyles={styles.carousel}
                    maxNumberOfColumns={4}
                    title={translate("Product Compare Carousel")}
                    slides={slides}
                />
            </StyledWrapper>
        </Drawer>
    );
};

interface ProductCompareHeaderProps {
    styles: ProductCompareFlyOutStyles;
    productCount: number;
    onOpenCompare: () => void;
    onRemoveAll: () => void;
}

const ProductCompareHeader = ({ styles, productCount, onOpenCompare, onRemoveAll }: ProductCompareHeaderProps) => {
    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.headerTitleGridItem}>
                <Typography {...styles.headerTitleText}>
                    {translate("Compare {0} Items", productCount.toString())}
                </Typography>
            </GridItem>
            <GridItem {...styles.headerActionsGridItem}>
                <Button
                    {...styles.headerRemoveAllButton}
                    onClick={onRemoveAll}
                    data-test-selector="productCompareRemoveAllButton"
                >
                    {translate("Remove All")}
                </Button>
                <Button
                    {...styles.headerCompareButton}
                    onClick={onOpenCompare}
                    data-test-selector="productCompareOpenComparePageButton"
                >
                    {translate("Compare")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withHistory(ProductCompareFlyOut));
