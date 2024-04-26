import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Button, { ButtonIcon } from "@insite/mobius/Button";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import { useEmblaCarousel } from "embla-carousel/react";
import React, { useEffect, useState } from "react";

type SlideModel = {
    fields: {
        background: "image" | "color";
        image: string;
        backgroundColor: string;
        link: string;
        heading: string;
        headingColor: string;
        subheading: string;
        subheadingColor: string;
        textAlignment: "left" | "center" | "right";
    };
};

type Props = {
    fields: {
        timerSpeed: number;
        animationSpeed: number;
        slides: SlideModel[];
    };
};

// These styles come straight from the Embla examples, nothing fancy.
const viewportCss = {
    overflow: "hidden",
} as const;

const containerCss = {
    display: "flex",
} as const;

const slideCss = {
    position: "relative",
    minWidth: "100%",
} as const;

const Slideshow = ({ fields: { timerSpeed, slides } }: Props) => {
    const [emblaRef, embla] = useEmblaCarousel({
        align: "start",
        loop: true,
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const setCanScroll = () => {
        setCanScrollPrev(!!embla?.canScrollPrev());
        setCanScrollNext(!!embla?.canScrollNext());
    };

    useEffect(() => {
        if (!embla) {
            return;
        }

        embla.on("init", setCanScroll);
        embla.on("select", () => {
            setCanScroll();
        });
    }, [embla]);

    useEffect(() => {
        if (!embla) {
            return;
        }

        const interval = setInterval(() => {
            embla.scrollNext();
        }, timerSpeed);
        return () => clearInterval(interval);
    }, [timerSpeed, embla]);

    return (
        <div>
            <div style={viewportCss} ref={emblaRef}>
                <div style={containerCss}>
                    {slides.map(
                        (
                            {
                                fields: {
                                    heading,
                                    headingColor,
                                    subheading,
                                    subheadingColor,
                                    backgroundColor,
                                    textAlignment,
                                },
                            },
                            index,
                        ) => {
                            return (
                                <div
                                    style={{
                                        ...slideCss,
                                        backgroundColor: backgroundColor || "transparent",
                                        textAlign: textAlignment || "left",
                                    }}
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                >
                                    {heading && <div style={{ color: headingColor || "black" }}>{heading}</div>}
                                    {subheading && (
                                        <div style={{ color: subheadingColor || "black" }}>{subheading}</div>
                                    )}
                                </div>
                            );
                        },
                    )}
                </div>
            </div>
            <Button onClick={() => embla?.scrollPrev()} disabled={!canScrollPrev || slides.length < 2}>
                <ButtonIcon src={ChevronLeft} />
            </Button>
            <Button onClick={() => embla?.scrollNext()} disabled={!canScrollNext || slides.length < 2}>
                <ButtonIcon src={ChevronRight} />
            </Button>
        </div>
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
        group: "Mobile",
        icon: "Carousel",
        fieldDefinitions: [
            {
                name: "timerSpeed",
                displayName: "Timer Speed (ms)",
                editorTemplate: "IntegerField",
                defaultValue: 10000,
                fieldType: "General",
                tab: settingsTab,
                min: 1,
            },
            {
                name: "animationSpeed",
                displayName: "Animation Speed (ms)",
                editorTemplate: "IntegerField",
                defaultValue: 50,
                fieldType: "General",
                tab: settingsTab,
                min: 1,
            },
            {
                name: "slides",
                editorTemplate: "ListField",
                tab: contentTab,
                getDisplay: ({ fields: { heading, subheading, link } }) => heading || subheading || link || "Slide",
                defaultValue: [],
                fieldType: "Translatable",
                fieldDefinitions: [
                    {
                        name: "background",
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
                        isVisible: ({ fields: { background } }) => background === "image",
                    },
                    {
                        name: "backgroundColor",
                        editorTemplate: "ColorPickerField",
                        defaultValue: "transparent",
                        isVisible: ({ fields: { background } }) => background === "color",
                    },
                    {
                        name: "link",
                        editorTemplate: "TextField",
                        defaultValue: "",
                    },
                    {
                        name: "heading",
                        editorTemplate: "TextField",
                        defaultValue: "",
                    },
                    {
                        name: "headingColor",
                        editorTemplate: "ColorPickerField",
                        defaultValue: "black",
                    },
                    {
                        name: "subheading",
                        editorTemplate: "TextField",
                        defaultValue: "",
                    },
                    {
                        name: "subheadingColor",
                        editorTemplate: "ColorPickerField",
                        defaultValue: "black",
                    },
                    {
                        name: "textAlignment",
                        editorTemplate: "DropDownField",
                        defaultValue: "left",
                        options: [
                            { displayName: "Left", value: "left" },
                            { displayName: "Center", value: "center" },
                            { displayName: "Right", value: "right" },
                        ],
                        hideEmptyOption: true,
                    },
                ],
            },
        ],
    },
};

export default widgetModule;
