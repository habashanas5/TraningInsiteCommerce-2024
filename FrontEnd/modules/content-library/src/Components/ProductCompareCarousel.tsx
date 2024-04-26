import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import translate from "@insite/client-framework/Translate";
import { AttributeTypeModel, ProductModel } from "@insite/client-framework/Types/ApiModels";
import SkipNav, { SkipNavStyles } from "@insite/content-library/Components/SkipNav";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { resolveColor } from "@insite/mobius/utilities";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import { useEmblaCarousel } from "embla-carousel/react";
import React, { createRef, ReactNode, useCallback, useEffect, useState } from "react";
import { css, ThemeProps, withTheme } from "styled-components";

interface OwnProps {
    id: string;
    extendedStyles?: CarouselStyles;
    title: string;
    hideTitle?: boolean;
    maxNumberOfColumns: number;
    slideDetails: ProductCarouselSlideDetails;
}

type Props = OwnProps & ThemeProps<BaseTheme> & HasShellContext;

export interface ProductCarouselSlideDetails {
    slides: CarouselSlide[];
    products: ProductModel[];
    attributeTypes: AttributeTypeModel[];
}

export interface CarouselSlide {
    id: string;
    renderComponent: (options: CarouselSlideOptions) => ReactNode;
}

export interface CarouselSlideOptions {}

export interface CarouselStyles {
    titleText?: TypographyPresentationProps;
    skipCarouselButton?: SkipNavStyles;
    mainContainer?: GridContainerProps;
    prevArrowGridItem?: GridItemProps;
    prevArrowButton?: ButtonPresentationProps;
    nextArrowGridItem?: GridItemProps;
    nextArrowButton?: ButtonPresentationProps;
    carouselGridItem?: GridItemProps;
    carouselContentEmptyCellGridItem?: GridItemProps;
    carouselCellGridItem?: GridItemProps;
    carouselContentContainer?: GridContainerProps;
    carouselWrapper?: InjectableCss;
    carouselContainer?: InjectableCss;
    carouselSlidesContainer?: InjectableCss;
    carouselSlide?: InjectableCss;
    carouselSlideInner?: InjectableCss;
    attributeLabelsCellGridItem?: GridItemProps;
    attributeLabelsGridContainer?: GridContainerProps;
    attributeLabelGridItem?: GridItemProps;
    attributeLabelText?: TypographyPresentationProps;
    attributeValuesCellGridItem?: GridItemProps;
    attributeValuesWrapper?: InjectableCss;
    attributeValuesContainer?: InjectableCss;
    attributeValuesSlidesContainer?: InjectableCss;
    attributeValueSlide?: InjectableCss;
    attributeValueSlideInner?: InjectableCss;
    attributeValuesGridContainer?: GridContainerProps;
    attributeValueGridItem?: GridItemProps;
    attributeValueText?: TypographyPresentationProps;
}

export const carouselStyles: CarouselStyles = {
    titleText: {
        variant: "h2",
        css: css`
            text-align: center;
            margin-bottom: 10px;
        `,
    },
    mainContainer: {
        gap: 0,
        css: css`
            margin: 0 auto;
        `,
    },
    prevArrowGridItem: {
        width: 1,
        align: "middle",
        css: css`
            justify-content: flex-start;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                ])}
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
    nextArrowGridItem: {
        width: 1,
        align: "middle",
        css: css`
            justify-content: flex-end;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                    css`
                        flex-basis: 5%;
                        max-width: 5%;
                    `,
                ])}
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
    carouselGridItem: {
        width: 10,
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        flex-basis: 90%;
                        max-width: 90%;
                    `,
                    css`
                        flex-basis: 90%;
                        max-width: 90%;
                    `,
                    css`
                        flex-basis: 90%;
                        max-width: 90%;
                    `,
                    css`
                        flex-basis: 90%;
                        max-width: 90%;
                    `,
                    css`
                        flex-basis: 90%;
                        max-width: 90%;
                    `,
                ])}
        `,
    },
    carouselContentContainer: {
        gap: 0,
    },
    carouselContentEmptyCellGridItem: {
        width: 4,
    },
    carouselCellGridItem: {
        width: 8,
    },
    carouselWrapper: {
        css: css`
            width: 100%;
            position: relative;
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
            padding: 0;
            position: relative;
            flex: 0 0 auto;
        `,
    },
    carouselSlideInner: {
        css: css`
            width: 100%;
            height: 100%;
            position: relative;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
        `,
    },
    attributeLabelsCellGridItem: {
        width: 4,
    },
    attributeLabelsGridContainer: {
        gap: 0,
        css: css`
            box-shadow: 2px 2px 3px -1px black;
            z-index: 999;
        `,
    },
    attributeLabelGridItem: {
        width: 12,
        css: css`
            border-bottom: ${({ theme }) => resolveColor("common.border", theme)} solid 1px;
            border-right: ${({ theme }) => resolveColor("common.border", theme)} solid 1px;
            padding: 0.8rem 0.3rem;
            &:nth-child(even) {
                background-color: ${getColor("common.accent")};
            }
        `,
    },
    attributeLabelText: {
        ellipsis: true,
    },
    attributeValuesCellGridItem: {
        width: 8,
    },
    attributeValuesWrapper: {
        css: css`
            width: 100%;
            position: relative;
        `,
    },
    attributeValuesContainer: {
        css: css`
            overflow: hidden;
        `,
    },
    attributeValuesSlidesContainer: {
        css: css`
            display: flex;
        `,
    },
    attributeValueSlide: {
        css: css`
            padding: 0;
            position: relative;
            flex: 0 0 auto;
        `,
    },
    attributeValueSlideInner: {
        css: css`
            width: 100%;
            height: 100%;
            position: relative;
            padding: 0;
            display: flex;
            flex-direction: column;
        `,
    },
    attributeValuesGridContainer: {
        gap: 0,
    },
    attributeValueGridItem: {
        width: 12,
        css: css`
            border-bottom-style: solid;
            border-bottom-width: 1px;
            border-bottom-color: ${({ theme }) => resolveColor("common.border", theme)};
            padding: 0.8rem 0.8rem;
            &:nth-child(even) {
                background-color: ${getColor("common.accent")};
            }
        `,
    },
    attributeValueText: {
        ellipsis: true,
    },
};

const Carousel = ({
    shellContext,
    theme,
    id,
    extendedStyles,
    title,
    hideTitle,
    maxNumberOfColumns,
    slideDetails,
}: Props) => {
    const afterCarousel = createRef<HTMLSpanElement>();
    const [styles] = useState(() => mergeToNew(carouselStyles, extendedStyles));

    const [emblaRef, embla] = useEmblaCarousel();
    const [emblaSecondRef, emblaSecond] = useEmblaCarousel();
    const [windowResizeTime, setWindowResizeTime] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const setCanScroll = () => {
        if (shellContext.isInShell) {
            return;
        }
        setCanScrollPrev(!!embla && embla.canScrollPrev());
        setCanScrollNext(!!embla && embla.canScrollNext());
    };

    const getSlidesToScroll = useCallback(() => {
        if (typeof window === "undefined") {
            return maxNumberOfColumns;
        }

        let localSlidesToScroll: number;
        if (window.innerWidth < theme.breakpoints.values[1]) {
            localSlidesToScroll = 1;
        } else if (window.innerWidth < theme.breakpoints.values[2]) {
            localSlidesToScroll = 1;
        } else if (window.innerWidth < theme.breakpoints.values[3]) {
            localSlidesToScroll = 2;
        } else {
            localSlidesToScroll = 3;
        }
        return Math.min(localSlidesToScroll, maxNumberOfColumns);
    }, [maxNumberOfColumns]);

    const [slidesToScroll, setSlidesToScroll] = useState(getSlidesToScroll());

    const getDraggable = () => {
        if (typeof window === "undefined") {
            return false;
        }

        return window.innerWidth < theme.breakpoints.values[1];
    };

    const [draggable, setDraggable] = useState(getDraggable());

    useEffect(() => {
        const newSlidesToScroll = getSlidesToScroll();
        setSlidesToScroll(newSlidesToScroll);

        const newDraggable = getDraggable();
        setDraggable(newDraggable);
    }, [maxNumberOfColumns, windowResizeTime]);

    useEffect(() => {
        if (!embla) {
            return;
        }

        embla.on("init", setCanScroll);
        embla.on("select", setCanScroll);

        const onWindowResize = () => {
            setWindowResizeTime(Date.now());
        };

        window.addEventListener("resize", onWindowResize);
        onWindowResize();

        return () => {
            window.removeEventListener("resize", onWindowResize);
        };
    }, [embla]);

    useEffect(() => {
        if (!emblaSecond) {
            return;
        }

        emblaSecond.on("init", setCanScroll);
        emblaSecond.on("select", setCanScroll);
    }, [emblaSecond]);

    useEffect(() => {
        if (!embla || !emblaSecond || !slideDetails || slideDetails.slides.length === 0) {
            return;
        }

        embla.reInit({
            align: "start",
            slidesToScroll,
            draggable,
            loop: true,
        });
        emblaSecond.reInit({
            align: "start",
            slidesToScroll,
            draggable,
            loop: true,
        });
        setCanScroll();
    }, [embla, emblaSecond, slidesToScroll, draggable, slideDetails]);

    const getProductAttributeValue = (product: ProductModel, attribute: AttributeTypeModel) => {
        const productAttributeValue = product.attributeTypes
            ?.filter(a => a.id === attribute.id)
            .map(a => a.attributeValues || [])
            .reduce((acc, currentValue) => [...acc, ...currentValue], []);

        if (productAttributeValue && productAttributeValue.length > 0) {
            return (
                <Typography
                    aria-describedby={`carousel-${id}_attribute-label-${attribute.id}`}
                    {...styles.attributeValueText}
                >
                    {productAttributeValue.map(o => o.valueDisplay).join(", ")}
                </Typography>
            );
        }

        return <>&nbsp;</>;
    };

    if (!slideDetails || slideDetails.slides.length === 0) {
        return null;
    }

    return (
        <>
            <SkipNav
                text={translate("Skip Carousel")}
                extendedStyles={styles.skipCarouselButton}
                destination={afterCarousel}
            />
            {hideTitle ? (
                <VisuallyHidden>
                    <Typography {...styles.titleText}>{title}</Typography>
                </VisuallyHidden>
            ) : (
                <Typography {...styles.titleText}>{title}</Typography>
            )}

            <GridContainer {...styles.mainContainer} data-test-selector="productCompareCarousel_gridContainer">
                <GridItem {...styles.prevArrowGridItem}>
                    {slideDetails.slides.length > slidesToScroll && (
                        <Button
                            {...styles.prevArrowButton}
                            onClick={() => {
                                embla && embla.scrollPrev();
                                emblaSecond && emblaSecond.scrollPrev();
                            }}
                            disabled={!canScrollPrev}
                            data-test-selector="prevBtn"
                        >
                            <ButtonIcon src={ChevronLeft} />
                        </Button>
                    )}
                </GridItem>
                <GridItem {...styles.carouselGridItem}>
                    <GridContainer {...styles.carouselContentContainer}>
                        <GridItem {...styles.carouselContentEmptyCellGridItem}></GridItem>
                        <GridItem {...styles.carouselCellGridItem}>
                            <StyledWrapper {...styles.carouselWrapper}>
                                <StyledWrapper {...styles.carouselContainer} ref={emblaRef}>
                                    <StyledWrapper {...styles.carouselSlidesContainer} data-test-selector="slides">
                                        {slideDetails.slides.map(slide => (
                                            <StyledWrapper
                                                {...styles.carouselSlide}
                                                key={slide.id}
                                                style={{ width: `calc(100% / ${slidesToScroll})` }}
                                            >
                                                <StyledWrapper
                                                    {...styles.carouselSlideInner}
                                                    id={`slide_${slide.id}`}
                                                    data-test-selector="slideContainer"
                                                >
                                                    {slide.renderComponent({})}
                                                </StyledWrapper>
                                            </StyledWrapper>
                                        ))}
                                    </StyledWrapper>
                                </StyledWrapper>
                            </StyledWrapper>
                        </GridItem>
                        <GridItem {...styles.attributeLabelsCellGridItem}>
                            <GridContainer {...styles.attributeLabelsGridContainer}>
                                {slideDetails.attributeTypes.map(attribute => (
                                    <GridItem key={attribute.id} {...styles.attributeLabelGridItem}>
                                        <Typography
                                            id={`carousel-${id}_attribute-label-${attribute.id}`}
                                            {...styles.attributeLabelText}
                                        >
                                            {attribute.label || attribute.name}
                                        </Typography>
                                    </GridItem>
                                ))}
                            </GridContainer>
                        </GridItem>
                        <GridItem {...styles.attributeValuesCellGridItem}>
                            <StyledWrapper {...styles.attributeValuesWrapper}>
                                <StyledWrapper {...styles.attributeValuesContainer} ref={emblaSecondRef}>
                                    <StyledWrapper
                                        {...styles.attributeValuesSlidesContainer}
                                        data-test-selector="attribute-value-slides"
                                    >
                                        {slideDetails.products.map(product => (
                                            <StyledWrapper
                                                {...styles.attributeValueSlide}
                                                key={`${product.id}-attributes`}
                                                style={{ width: `calc(100% / ${slidesToScroll})` }}
                                            >
                                                <StyledWrapper
                                                    {...styles.attributeValueSlideInner}
                                                    id={`product-attribute_${product.id}`}
                                                    data-test-selector="slideAttributesContainer"
                                                    data-test-key={product.id}
                                                >
                                                    <GridContainer {...styles.attributeValuesGridContainer}>
                                                        {slideDetails.attributeTypes.map(attribute => (
                                                            <GridItem
                                                                key={`${product.id}-attribute-${attribute.id}`}
                                                                {...styles.attributeValueGridItem}
                                                            >
                                                                {getProductAttributeValue(product, attribute)}
                                                            </GridItem>
                                                        ))}
                                                    </GridContainer>
                                                </StyledWrapper>
                                            </StyledWrapper>
                                        ))}
                                    </StyledWrapper>
                                </StyledWrapper>
                            </StyledWrapper>
                        </GridItem>
                    </GridContainer>
                </GridItem>
                <GridItem {...styles.nextArrowGridItem}>
                    {slideDetails.slides.length > slidesToScroll && (
                        <Button
                            {...styles.nextArrowButton}
                            onClick={() => {
                                embla && embla.scrollNext();
                                emblaSecond && emblaSecond.scrollNext();
                            }}
                            disabled={!canScrollNext}
                            data-test-selector="nextBtn"
                        >
                            <ButtonIcon src={ChevronRight} />
                        </Button>
                    )}
                </GridItem>
            </GridContainer>
            <span ref={afterCarousel} tabIndex={-1} />
        </>
    );
};

Carousel.defaultProps = {
    maxNumberOfColumns: 4,
};

export default withIsInShell(withTheme(Carousel));
