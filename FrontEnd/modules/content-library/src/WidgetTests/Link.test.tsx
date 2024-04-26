import LinkWidgetModule, { Link } from "@insite/content-library/Widgets/Basic/Link";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import MobiusLink from "@insite/mobius/Link";
import "jest-styled-components";
import { css } from "styled-components";

describe("Link Widget", () => {
    const { renderWidget, useStyles, useFields } = setupWidgetRendering(Link, LinkWidgetModule);

    test("Is rendering", () => {
        const link = renderWidget().find(Link);
        elementIsRendering(link);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.link = {
            css: css`
                background: magenta;
            `,
        };
        const fields = useFields();
        fields.destination = { type: "Url", value: "/" };

        const mobiusLink = renderWidget().find(MobiusLink);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(mobiusLink, styleRule);
    });
});
