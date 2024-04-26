import BannerWidgetModule, { Banner } from "@insite/content-library/Widgets/Basic/Banner";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import Button from "@insite/mobius/Button";
import "jest-styled-components";
import { css } from "styled-components";

describe("Button Widget", () => {
    const { renderWidget, useStyles } = setupWidgetRendering(Banner, BannerWidgetModule);

    test("Is rendering", () => {
        const banner = renderWidget().find(Banner);

        elementIsRendering(banner);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.banner = {
            bannerButton: {
                css: css`
                    background: magenta;
                `,
            },
        };

        const button = renderWidget().find(Button);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(button, styleRule);
    });
});
