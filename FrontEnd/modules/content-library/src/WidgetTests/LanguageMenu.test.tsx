import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import LanguageMenuWidgetModule, { LanguageMenu } from "@insite/content-library/Widgets/Common/LanguageMenu";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("LanguageMenu Widget", () => {
    const { renderWidget, useStyles, useProps } = setupWidgetRendering(LanguageMenu, LanguageMenuWidgetModule);

    test("Is rendering", () => {
        const languageMenu = renderWidget().find(LanguageMenu);

        elementIsRendering(languageMenu);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.languageMenu = {
            languageWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        };

        const props = useProps();
        props.languages = [
            { id: 1, languageCode: 1 },
            { id: 2, languageCode: 2 },
        ] as any;

        const styledWrappers = renderWidget().find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});
