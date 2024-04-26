import RichContentWidgetModule, {
    ContentWrapper,
    RichContent,
} from "@insite/content-library/Widgets/Basic/RichContent";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("RichContent Widget", () => {
    const { renderWidget, useStyles, useFields } = setupWidgetRendering(RichContent, RichContentWidgetModule);

    test("Is rendering", () => {
        const richContent = renderWidget().find(RichContent);

        elementIsRendering(richContent);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.richContent = {
            wrapper: {
                css: css`
                    background: magenta;
                `,
            },
        };

        const fields = useFields();
        fields.content = "content";

        const contentWrapper = renderWidget().find(ContentWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(contentWrapper, styleRule);
    });
});
