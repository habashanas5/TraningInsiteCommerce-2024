import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { ImageModel } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonIcon, ButtonProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { useEmblaCarousel } from "embla-carousel/react";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    selectedIndex?: number;
    onSelectImage?: (index: number) => void;
    extendedStyles?: ProductImageCarouselStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

type Props = OwnProps & HasProductContext & ReturnType<typeof mapStateToProps>;

export interface ProductImageCarouselStyles {
    mainContainer?: GridContainerProps;
    prevArrowGridItem?: GridItemProps;
    prevArrowButton?: ButtonProps;
    carouselGridItem?: GridItemProps;
    carouselWrapper?: InjectableCss;
    carouselContainer?: InjectableCss;
    carouselSlidesContainer?: InjectableCss;
    carouselSlide?: InjectableCss;
    carouselSlideInner?: InjectableCss;
    image?: LazyImageProps;
    selectedImage?: LazyImageProps;
    nextArrowGridItem?: GridItemProps;
    nextArrowButton?: ButtonProps;
}

const getImageCss = (borderColor: string) => css`
    width: 100%;
    height: 100%;
    max-width: 64px;
    max-height: 64px;
    border: 1px solid ${getColor(borderColor)};
    cursor: pointer;
    justify-content: flex-start;
    img {
        max-width: 64px;
        max-height: 64px;
        padding: 3px;
    }
`;

export const productImageCarouselStyles: ProductImageCarouselStyles = {
    mainContainer: { gap: 0 },
    prevArrowGridItem: {
        width: 1,
        align: "middle",
        css: css`
            justify-content: flex-end;
        `,
    },
    prevArrowButton: {
        variant: "secondary",
        color: "text.main",
        css: css`
            border: 0;
            padding: 0;
        `,
    },
    carouselGridItem: { width: 10 },
    carouselWrapper: {
        css: css`
            width: 100%;
        `,
    },
    carouselContainer: {
        css: css`
            overflow: hidden;
        `,
    },
    carouselSlidesContainer: {
        css: css`
            display: flex;
        `,
    },
    carouselSlide: {
        css: css`
            flex: 0 0 ${100 / 6}%;
            padding: 0;
            position: relative;
        `,
    },
    carouselSlideInner: {
        css: css`
            width: 100%;
            text-align: center;
            position: relative;
            padding: 10px 3px 0;
        `,
    },
    image: {
        css: getImageCss("common.border"),
    },
    selectedImage: {
        css: getImageCss("text.main"),
    },
    nextArrowGridItem: {
        width: 1,
        align: "middle",
        css: css`
            justify-content: flex-start;
        `,
    },
    nextArrowButton: {
        variant: "secondary",
        color: "text.main",
        css: css`
            border: 0;
            padding: 0;
        `,
    },
};

const ProductImageCarousel = ({
    productSettings,
    productContext,
    selectedIndex,
    onSelectImage,
    extendedStyles,
}: Props) => {
    const [styles] = useState(() => mergeToNew(productImageCarouselStyles, extendedStyles));
    const { product } = productContext;

    const [selectedImageIndex, setSelectedImageIndex] = useState(selectedIndex);
    useEffect(() => {
        setSelectedImageIndex(selectedIndex);
    }, [selectedIndex]);

    const imageClickHandler = (index: number) => {
        setSelectedImageIndex(index);
        onSelectImage?.(index);
    };

    const [emblaRef, embla] = useEmblaCarousel();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const setCanScroll = () => {
        setCanScrollPrev(!!embla && embla.canScrollPrev());
        setCanScrollNext(!!embla && embla.canScrollNext());
    };

    useEffect(() => {
        if (!embla) {
            return;
        }

        embla.on("init", setCanScroll);
        embla.on("select", setCanScroll);
    }, [embla]);

    useEffect(() => {
        if (!embla || !product.images) {
            return;
        }

        embla.reInit({
            align: product.images.length > 6 ? "start" : "center",
            slidesToScroll: 6,
        });
        setCanScroll();
    }, [embla, product]);

    const getProductImageThumbPath = (productImage: ImageModel) => {
        if (productImage.imageType === "Static") {
            return productImage.smallImagePath || productImage.mediumImagePath;
        }
        if (productImage.imageType === "360" && productSettings.imageProvider === "SIRV") {
            return productImage.mediumImagePath + (productImage.mediumImagePath.indexOf("?") > 0 ? "&thumb" : "?thumb");
        }
        return "";
    };

    if (!product || !product.images || product.images?.length === 0) {
        return null;
    }

    return (
        <GridContainer {...styles.mainContainer} key={product.id}>
            <GridItem {...styles.prevArrowGridItem}>
                {product.images.length > 6 && (
                    <Button
                        {...styles.prevArrowButton}
                        onClick={() => embla && embla.scrollPrev()}
                        disabled={!canScrollPrev}
                    >
                        <ButtonIcon src={ChevronLeft} />
                    </Button>
                )}
            </GridItem>
            <GridItem {...styles.carouselGridItem}>
                <StyledWrapper {...styles.carouselWrapper}>
                    <StyledWrapper {...styles.carouselContainer} ref={emblaRef}>
                        <StyledWrapper {...styles.carouselSlidesContainer}>
                            {product.images.map((productImage, index) => (
                                <StyledWrapper {...styles.carouselSlide} key={productImage.id}>
                                    <StyledWrapper {...styles.carouselSlideInner}>
                                        <Clickable onClick={() => imageClickHandler(index)}>
                                            <LazyImage
                                                {...(index === selectedImageIndex
                                                    ? styles.selectedImage
                                                    : styles.image)}
                                                src={getProductImageThumbPath(productImage)}
                                                altText={productImage.imageAltText}
                                            />
                                        </Clickable>
                                    </StyledWrapper>
                                </StyledWrapper>
                            ))}
                        </StyledWrapper>
                    </StyledWrapper>
                </StyledWrapper>
            </GridItem>
            <GridItem {...styles.nextArrowGridItem}>
                {product.images.length > 6 && (
                    <Button
                        {...styles.nextArrowButton}
                        onClick={() => embla && embla.scrollNext()}
                        disabled={!canScrollNext}
                    >
                        <ButtonIcon src={ChevronRight} />
                    </Button>
                )}
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps)(withProductContext(ProductImageCarousel));
