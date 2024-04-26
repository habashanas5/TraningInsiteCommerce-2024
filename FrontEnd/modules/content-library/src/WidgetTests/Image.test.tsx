import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ImageWidgetModule, { Image } from "@insite/content-library/Widgets/Basic/Image";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("Image Widget", () => {
    const { renderWidget, useStyles } = setupWidgetRendering(Image, ImageWidgetModule);

    test("Is rendering", () => {
        const image = renderWidget().find(Image);
        elementIsRendering(image);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.image = {
            wrapper: {
                css: css`
                    background: magenta;
                `,
            },
        };

        const styledWrapper = renderWidget().find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;
        elementHasStyle(styledWrapper, styleRule);
    });
});
