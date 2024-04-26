import { getFocalPointStyles, parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import useRecursiveTimeout from "@insite/client-framework/Common/Hooks/useRecursiveTimeout";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { responsiveStyleRules } from "@insite/client-framework/Common/Utilities/responsive";
import { useGetLinks } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import { IconPresentationProps } from "@insite/mobius/Icon";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import { useHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { useEmblaCarousel } from "embla-carousel/react";
import parse from "html-react-parser";
import React, { FC, useCallback, useEffect, useState } from "react";
import { css } from "styled-components";

interface SlideModel {
    fields: {
        slideTitle: string;
        background: "image" | "color";
        image: string;
        imageOverlay: string;
        partialOverlay: boolean;
        partialOverlayPositioning: "top" | "middle" | "bottom";
        responsiveImageBehavior: "cover" | "center" | "prioritizeHeight" | "prioritizeWidth";
        backgroundColor: string;
        heading: string;
        subheading: string;
        buttonLabel: string;
        buttonLink: LinkFieldValue;
        buttonVariant: "primary" | "secondary" | "tertiary";
        focalPoint:
            | "topLeft"
            | "topCenter"
            | "topRight"
            | "centerLeft"
            | "center"
            | "centerRight"
            | "bottomLeft"
            | "bottomCenter"
            | "bottomRight";
        contentPadding: number;
        centerTextVertically: boolean;
    };
}

const enum fields {
    height = "height",
    textAlignment = "textAlignment",
    showArrows = "showArrows",
    slideIndicator = "slideIndicator",
    autoplay = "autoplay",
    slides = "slides",
    responsiveFontSizes = "responsiveFontSizes",
    customFontSizes = "customFontSizes",
    h1FontSize = "h1FontSize",
    h2FontSize = "h2FontSize",
    h3FontSize = "h3FontSize",
    h4FontSize = "h4FontSize",
    h5FontSize = "h5FontSize",
    h6FontSize = "h6FontSize",
    normalFontSize = "normalFontSize",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.height]: "1/4 viewport" | "1/2 viewport" | "3/4 viewport" | "fullViewport";
        [fields.textAlignment]: "left" | "center" | "right";
        [fields.showArrows]: boolean;
        [fields.slideIndicator]: boolean;
        [fields.autoplay]: number;
        [fields.responsiveFontSizes]: boolean;
        [fields.customFontSizes]: boolean;
        [fields.h1FontSize]: number;
        [fields.h2FontSize]: number;
        [fields.h3FontSize]: number;
        [fields.h4FontSize]: number;
        [fields.h5FontSize]: number;
        [fields.normalFontSize]: number;
        [fields.slides]: SlideModel[];
    };
    extendedStyles?: SlideshowStyles;
}

export interface SlideshowStyles {
    slideshowWrapper?: InjectableCss;
    prevArrowWrapper?: InjectableCss;
    prevArrowButton?: ButtonPresentationProps;
    iconProps?: IconPresentationProps;
    carouselContainer?: InjectableCss;
    slideContainerWrapper?: InjectableCss;
    slideContentWrapper?: InjectableCss;
    slideOverlayWrapper?: InjectableCss;
    slideCenteringWrapperStyles?: InjectableCss;
    headingText?: TypographyPresentationProps;
    subheadingText?: TypographyPresentationProps;
    slideButton?: ButtonPresentationProps;
    dotsContainerWrapper?: InjectableCss;
    dotButton?: ButtonPresentationProps;
    nextArrowWrapper?: InjectableCss;
    nextArrowButton?: ButtonPresentationProps;
}

export const slideshowStyles: SlideshowStyles = {
    slideshowWrapper: {
        css: css`
            padding: 10px 0;
            position: relative;
        `,
    },
    prevArrowWrapper: {
        css: css`
            position: absolute;
            z-index: 1;
            top: 50%;
            margin-top: -20px;
        `,
    },
    prevArrowButton: {
        css: css`
            background: none;
            border: 0;
            padding: 0;
            &:hover {
                background: none;
            }
            &:focus {
                outline: none;
            }
        `,
    },
    iconProps: {
        size: 35,
    },
    carouselContainer: {
        css: css`
            overflow: hidden;
        `,
    },
    slideContainerWrapper: {
        css: css`
            display: flex;
        `,
    },
    slideContentWrapper: {
        css: css`
            display: flex;
            flex: 0 0 100%;
            position: relative;
            color: white;
            background-repeat: no-repeat;
        `,
    },
    slideOverlayWrapper: {
        css: css`
            width: 100%;
        `,
    },
    slideButton: {
        css: css`
            width: fit-content;
        `,
    },
    dotsContainerWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            margin-top: -20px;
            position: absolute;
            width: 100%;
        `,
    },
    dotButton: {
        css: css`
            height: 3px;
            width: 30px;
            padding: 0;
            margin: 0 4px;
            border: 0;
            background: ${getColor("common.border")};
            &:hover,
            &:active {
                background: ${getColor("common.border")};
            }
            &:focus {
                outline: none;
            }
        `,
    },
    nextArrowWrapper: {
        css: css`
            position: absolute;
            z-index: 1;
            top: 50%;
            margin-top: -20px;
            right: 0;
        `,
    },
    nextArrowButton: {
        css: css`
            background: none;
            border: 0;
            padding: 0;
            &:hover {
                background: none;
            }
            &:focus {
                outline: none;
            }
        `,
    },
};

export const Slideshow: FC<OwnProps> = ({ fields, extendedStyles }) => {
    const history = useHistory();
    const buttonLinks = useGetLinks(fields.slides, o => o.fields.buttonLink);
    const styles = useMergeStyles("slideshow", slideshowStyles, extendedStyles);

    const [emblaRef, embla] = useEmblaCarousel();
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!embla) {
            return;
        }

        embla.on("select", () => {
            setSelectedIndex(embla.selectedScrollSnap());
        });
    }, [embla]);

    const scrollNext = useCallback(() => {
        if (!embla) {
            return;
        }

        embla.scrollNext();
    }, [embla]);

    useRecursiveTimeout(scrollNext, fields.autoplay * 1000);

    useEffect(() => {
        if (!embla || !fields.slides || fields.slides.length === 0) {
            return;
        }

        embla.reInit({
            align: "start",
            loop: true,
        });
    }, [embla, fields.slides]);

    const onClick = (link: string | undefined) => {
        if (link) {
            history.push(link);
        }
    };

    if (!fields.slides || fields.slides.length === 0) {
        return null;
    }

    let heightStyles: string;
    switch (fields.height) {
        case "1/4 viewport":
            heightStyles = "min-height: 25vh;";
            break;
        case "1/2 viewport":
            heightStyles = "min-height: 50vh;";
            break;
        case "3/4 viewport":
            heightStyles = "min-height: 75vh;";
            break;
        case "fullViewport":
            heightStyles = "min-height: 100vh;";
            break;
    }

    const textAlignStyles = `text-align: ${fields.textAlignment};`;

    return (
        <StyledWrapper {...styles.slideshowWrapper}>
            {fields.showArrows && fields.slides.length > 1 && (
                <StyledWrapper {...styles.prevArrowWrapper}>
                    <Button {...styles.prevArrowButton} onClick={() => embla && embla.scrollPrev()}>
                        <ButtonIcon {...styles.iconProps} src={ChevronLeft} />
                    </Button>
                </StyledWrapper>
            )}
            <StyledWrapper {...styles.carouselContainer} ref={emblaRef}>
                <StyledWrapper {...styles.slideContainerWrapper}>
                    {fields.slides.map((slide, index) => {
                        const buttonLink = buttonLinks[index];

                        let responsiveImageBehaviorStyles;
                        if (slide.fields.responsiveImageBehavior === "cover") {
                            responsiveImageBehaviorStyles = "background-size: cover;";
                        } else if (slide.fields.responsiveImageBehavior === "center") {
                            responsiveImageBehaviorStyles = "background-size: contain;";
                        } else if (slide.fields.responsiveImageBehavior === "prioritizeHeight") {
                            responsiveImageBehaviorStyles = "background-size: auto 100%;";
                        } else if (slide.fields.responsiveImageBehavior === "prioritizeWidth") {
                            responsiveImageBehaviorStyles = "background-size: 100% auto;";
                        }

                        const backgroundStyles =
                            slide.fields.background === "image"
                                ? `background-image: url(${slide.fields.image});`
                                : `background-color: ${slide.fields.backgroundColor};`;
                        const focalPointStyles = getFocalPointStyles(slide.fields.focalPoint);

                        let overlayPositioningStyles;
                        if (!slide.fields.partialOverlay) {
                            overlayPositioningStyles = "align-items: stretch;";
                        } else if (slide.fields.partialOverlayPositioning === "top") {
                            overlayPositioningStyles = "align-items: flex-start;";
                        } else if (slide.fields.partialOverlayPositioning === "middle") {
                            overlayPositioningStyles = "align-items: center;";
                        } else if (slide.fields.partialOverlayPositioning === "bottom") {
                            overlayPositioningStyles = "align-items: flex-end;";
                        }

                        let fontSizeStyles;
                        if (fields.responsiveFontSizes || fields.customFontSizes) {
                            fontSizeStyles = responsiveStyleRules(
                                fields.responsiveFontSizes,
                                fields.customFontSizes ? fields : undefined,
                            );
                        }

                        const slideWrapperStyles = {
                            css: css`
                                ${styles.slideContentWrapper?.css || ""}
                                ${heightStyles}
                                ${textAlignStyles}
                                ${backgroundStyles}
                                ${responsiveImageBehaviorStyles}
                                ${focalPointStyles}
                                ${overlayPositioningStyles}
                                ${fontSizeStyles}
                            `,
                        };
                        const slideOverlayWrapperStyles = {
                            css: css`
                                ${styles.slideOverlayWrapper?.css || ""}
                                background-color: ${slide.fields.background === "image"
                                    ? slide.fields.imageOverlay
                                    : ""};
                                padding: ${slide.fields.contentPadding}px;
                                ${slide.fields.centerTextVertically &&
                                `
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;`}
                            `,
                        };
                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <StyledWrapper key={index} {...slideWrapperStyles}>
                                <StyledWrapper {...slideOverlayWrapperStyles}>
                                    <StyledWrapper {...styles.slideCenteringWrapperStyles}>
                                        {slide.fields.heading && (
                                            <Typography {...styles.headingText}>
                                                {parse(slide.fields.heading, parserOptions)}
                                            </Typography>
                                        )}
                                        {slide.fields.subheading && (
                                            <Typography {...styles.subheadingText}>
                                                {parse(slide.fields.subheading, parserOptions)}
                                            </Typography>
                                        )}
                                        {(slide.fields.buttonLabel || slide.fields.buttonLink.value) && (
                                            <Button
                                                {...styles.slideButton}
                                                variant={slide.fields.buttonVariant}
                                                onClick={() => onClick(buttonLink?.url)}
                                            >
                                                {slide.fields.buttonLabel || buttonLink?.title || buttonLink?.url}
                                            </Button>
                                        )}
                                    </StyledWrapper>
                                </StyledWrapper>
                            </StyledWrapper>
                        );
                    })}
                </StyledWrapper>
            </StyledWrapper>
            {fields.slideIndicator && (
                <StyledWrapper {...styles.dotsContainerWrapper}>
                    {fields.slides.map((_, i) => {
                        const dotColorStyles =
                            i === selectedIndex
                                ? `
                                    background: white;
                                    &:hover { background: white; }
                                `
                                : "";
                        const dotButtonStyles = {
                            css: css`
                                ${styles.dotButton?.css || ""}
                                ${dotColorStyles}
                            `,
                        };
                        // eslint-disable-next-line react/no-array-index-key
                        return <Button key={i} {...dotButtonStyles} onClick={() => embla && embla.scrollTo(i)} />;
                    })}
                </StyledWrapper>
            )}
            {fields.showArrows && fields.slides.length > 1 && (
                <StyledWrapper {...styles.nextArrowWrapper}>
                    <Button {...styles.nextArrowButton} onClick={() => embla && embla.scrollNext()}>
                        <ButtonIcon {...styles.iconProps} src={ChevronRight} />
                    </Button>
                </StyledWrapper>
            )}
        </StyledWrapper>
    );
};

const contentTab = {
    displayName: "Content",
    sortOrder: 0,
};

const settingsTab = {
    displayName: "Settings",
    sortOrder: 1,
};

const widgetModule: WidgetModule = {
    component: Slideshow,
    definition: {
        group: "Basic",
        icon: "Carousel",
        fieldDefinitions: [
            {
                name: fields.height,
                editorTemplate: "DropDownField",
                fieldType: "General",
                options: [
                    { displayName: "1/4 Viewport", value: "1/4 viewport" },
                    { displayName: "1/2 Viewport", value: "1/2 viewport" },
                    { displayName: "3/4 Viewport", value: "3/4 viewport" },
                    { displayName: "Full Viewport", value: "fullViewport" },
                ],
                defaultValue: "1/4 viewport",
                hideEmptyOption: true,
                tab: settingsTab,
            },
            {
                name: fields.textAlignment,
                editorTemplate: "DropDownField",
                defaultValue: "center",
                fieldType: "General",
                options: [
                    { displayName: "Left", value: "left" },
                    { displayName: "Center", value: "center" },
                    { displayName: "Right", value: "right" },
                ],
                hideEmptyOption: true,
                tab: settingsTab,
            },
            {
                name: fields.showArrows,
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                tab: settingsTab,
            },
            {
                name: fields.slideIndicator,
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                tab: settingsTab,
            },
            {
                name: fields.autoplay,
                editorTemplate: "IntegerField",
                defaultValue: 10,
                fieldType: "General",
                tab: settingsTab,
                min: 1,
            },
            {
                name: fields.responsiveFontSizes,
                editorTemplate: "CheckboxField",
                fieldType: "General",
                tab: settingsTab,
                defaultValue: true,
            },
            {
                name: fields.customFontSizes,
                editorTemplate: "CheckboxField",
                fieldType: "General",
                tab: settingsTab,
                defaultValue: false,
            },
            {
                name: fields.normalFontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h1FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: 40,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h2FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: 32,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h3FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h4FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h5FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.h6FontSize,
                editorTemplate: "IntegerField",
                fieldType: "General",
                tab: settingsTab,
                min: 1,
                defaultValue: null,
                isVisible: item => item?.fields[fields.customFontSizes],
            },
            {
                name: fields.slides,
                editorTemplate: "ListField",
                tab: contentTab,
                getDisplay: ({ fields: { slideTitle } }) => slideTitle || "Slide",
                defaultValue: [],
                fieldType: "Translatable",
                fieldDefinitions: [
                    {
                        name: "slideTitle",
                        editorTemplate: "TextField",
                        defaultValue: "Slide",
                    },
                    {
                        name: "background",
                        displayName: "Background",
                        editorTemplate: "DropDownField",
                        options: [
                            { displayName: "Image", value: "image" },
                            { displayName: "Color", value: "color" },
                        ],
                        defaultValue: "image",
                        hideEmptyOption: true,
                    },
                    {
                        name: "image",
                        editorTemplate: "ImagePickerField",
                        defaultValue: "",
                        isVisible: widget => widget.fields.background === "image",
                    },
                    {
                        name: "imageOverlay",
                        displayName: "Image Color Overlay",
                        editorTemplate: "ColorPickerField",
                        defaultValue: "",
                        isVisible: widget => widget.fields.background === "image",
                    },
                    {
                        name: "partialOverlay",
                        editorTemplate: "CheckboxField",
                        defaultValue: false,
                    },
                    {
                        name: "partialOverlayPositioning",
                        editorTemplate: "DropDownField",
                        options: [
                            { displayName: "Top", value: "top" },
                            { displayName: "Middle", value: "middle" },
                            { displayName: "Bottom", value: "bottom" },
                        ],
                        hideEmptyOption: true,
                        defaultValue: "bottom",
                        isVisible: widget => widget.fields.partialOverlay,
                    },
                    {
                        name: "responsiveImageBehavior",
                        editorTemplate: "DropDownField",
                        options: [
                            { displayName: "Cover", value: "cover" },
                            { displayName: "Center", value: "center" },
                            { displayName: "Prioritize height", value: "prioritizeHeight" },
                            { displayName: "Prioritize width", value: "prioritizeWidth" },
                        ],
                        hideEmptyOption: true,
                        defaultValue: "cover",
                    },
                    {
                        name: "backgroundColor",
                        editorTemplate: "ColorPickerField",
                        displayName: "Color",
                        defaultValue: "black",
                        isVisible: widget => widget.fields.background === "color",
                    },
                    {
                        name: "focalPoint",
                        displayName: "Focal Point",
                        editorTemplate: "DropDownField",
                        options: [
                            { displayName: "Top Left", value: "topLeft" },
                            { displayName: "Top Center", value: "topCenter" },
                            { displayName: "Top Right", value: "topRight" },
                            { displayName: "Center Left", value: "centerLeft" },
                            { displayName: "Center", value: "center" },
                            { displayName: "Center Right", value: "centerRight" },
                            { displayName: "Bottom Left", value: "bottomLeft" },
                            { displayName: "Bottom Center", value: "bottomCenter" },
                            { displayName: "Bottom Right", value: "bottomRight" },
                        ],
                        defaultValue: "center",
                        hideEmptyOption: true,
                    },
                    {
                        name: "heading",
                        editorTemplate: "RichTextField",
                        displayName: "Heading",
                        defaultValue: "",
                        extendedConfig: { height: 100 },
                        expandedToolbarButtons: {
                            moreMisc: {},
                            code: {},
                        },
                    },
                    {
                        name: "subheading",
                        editorTemplate: "RichTextField",
                        displayName: "Subheading",
                        defaultValue: "",
                        extendedConfig: { height: 170 },
                        expandedToolbarButtons: {
                            moreMisc: {},
                            code: {},
                        },
                    },
                    {
                        name: "buttonLabel",
                        editorTemplate: "TextField",
                        displayName: "Button Label",
                        defaultValue: "",
                    },
                    {
                        name: "buttonLink",
                        displayName: "Button Link",
                        editorTemplate: "LinkField",
                        defaultValue: { type: "Page", value: "" },
                    },
                    {
                        name: "buttonVariant",
                        displayName: "Button Variant",
                        editorTemplate: "DropDownField",
                        options: [
                            { displayName: "Primary", value: "primary" },
                            { displayName: "Secondary", value: "secondary" },
                            { displayName: "Tertiary", value: "tertiary" },
                        ],
                        hideEmptyOption: true,
                        defaultValue: "primary",
                    },
                    {
                        name: "contentPadding",
                        editorTemplate: "IntegerField",
                        defaultValue: 50,
                    },
                    {
                        name: "centerTextVertically",
                        editorTemplate: "CheckboxField",
                        defaultValue: false,
                    },
                ],
            },
        ],
    },
};

export default widgetModule;
