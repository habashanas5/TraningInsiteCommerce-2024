import ButtonWidgetModule, { CmsButton, ContentWrapper } from "@insite/content-library/Widgets/Basic/Button";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("Button Widget", () => {
    const { renderWidget, useStyles } = setupWidgetRendering(CmsButton, ButtonWidgetModule);

    test("Is rendering", () => {
        const cmsButton = renderWidget().find(CmsButton);

        elementIsRendering(cmsButton);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.button = {
            wrapperStyles: {
                css: css`
                    background: magenta;
                `,
            },
        };

        const contentWrapper = renderWidget().find(ContentWrapper);
        const styleRule = /\s*background:\s?magenta;\s*/;

        elementHasStyle(contentWrapper, styleRule);
    });
});
