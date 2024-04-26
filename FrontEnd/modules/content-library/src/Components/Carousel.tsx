import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import translate from "@insite/client-framework/Translate";
import SkipNav, { SkipNavStyles } from "@insite/content-library/Components/SkipNav";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { useEmblaCarousel } from "embla-carousel/react";
import React, { createRef, ReactNode, useCallback, useEffect, useState } from "react";
import { css, ThemeProps, withTheme } from "styled-components";

interface OwnProps {
    id: string;
    extendedStyles?: CarouselStyles;
    title: string;
    maxNumberOfColumns: number;
    slides: CarouselSlide[];
}

type Props = OwnProps & ThemeProps<BaseTheme> & HasShellContext;

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
    carouselWrapper?: InjectableCss;
    carouselContainer?: InjectableCss;
    carouselSlidesContainer?: InjectableCss;
    carouselSlide?: InjectableCss;
    carouselSlideInner?: InjectableCss;
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
};

const Carousel = ({ shellContext, theme, id, extendedStyles, title, maxNumberOfColumns, slides }: Props) => {
    const afterCarousel = createRef<HTMLSpanElement>();
    const [styles] = useState(() => mergeToNew(carouselStyles, extendedStyles));

    const [emblaRef, embla] = useEmblaCarousel();
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
            localSlidesToScroll = 2;
        } else if (window.innerWidth < theme.breakpoints.values[3]) {
            localSlidesToScroll = 3;
        } else {
            localSlidesToScroll = 4;
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
        if (!embla || !slides || slides.length === 0) {
            return;
        }

        embla.reInit({
            align: "start",
            slidesToScroll,
            draggable,
            loop: slides.length > slidesToScroll,
        });
        setCanScroll();
    }, [embla, slidesToScroll, draggable, slides]);

    if (!slides || slides.length === 0) {
        return null;
    }

    return (
        <>
            <SkipNav
                text={translate("Skip Carousel")}
                extendedStyles={styles.skipCarouselButton}
                destination={afterCarousel}
            />
            <Typography {...styles.titleText}>{title}</Typography>
            <GridContainer {...styles.mainContainer} data-test-selector="carousel_gridContainer">
                <GridItem {...styles.prevArrowGridItem}>
                    {slides.length > slidesToScroll && (
                        <Button
                            {...styles.prevArrowButton}
                            onClick={() => embla && embla.scrollPrev()}
                            disabled={!canScrollPrev}
                            data-test-selector="prevBtn"
                        >
                            <ButtonIcon src={ChevronLeft} />
                        </Button>
                    )}
                </GridItem>
                <GridItem {...styles.carouselGridItem}>
                    <StyledWrapper {...styles.carouselWrapper}>
                        <StyledWrapper {...styles.carouselContainer} ref={emblaRef}>
                            <StyledWrapper {...styles.carouselSlidesContainer} data-test-selector="slides">
                                {slides.map(slide => (
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
                <GridItem {...styles.nextArrowGridItem}>
                    {slides.length > slidesToScroll && (
                        <Button
                            {...styles.nextArrowButton}
                            onClick={() => embla && embla.scrollNext()}
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
