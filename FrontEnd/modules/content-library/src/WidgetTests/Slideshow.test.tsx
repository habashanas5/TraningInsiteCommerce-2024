import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import SlideshowWidgetModule, { Slideshow } from "@insite/content-library/Widgets/Basic/Slideshow";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("SlideShow Widget", () => {
    const { renderWidget, useStyles, useFields } = setupWidgetRendering(Slideshow, SlideshowWidgetModule);

    test("Is rendering", () => {
        const slideShow = renderWidget().find(Slideshow);

        elementIsRendering(slideShow);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.slideshow = {
            slideshowWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        };
        const fields = useFields();
        // this should probably default all the field values
        fields.slides = [{ fields: { buttonLink: {} } } as any];

        const styledWrappers = renderWidget().find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});
