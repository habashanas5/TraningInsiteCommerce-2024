import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import LogoWidgetModule, { Logo } from "@insite/content-library/Widgets/Basic/Logo";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("Logo Widget", () => {
    const { renderWidget, useStyles } = setupWidgetRendering(Logo, LogoWidgetModule);

    test("Is rendering", () => {
        const logo = renderWidget().find(Logo);

        elementIsRendering(logo);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.logo = {
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
