import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import CurrencyMenuWidgetModule, { CurrencyMenu } from "@insite/content-library/Widgets/Common/CurrencyMenu";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("CurrencyMenu Widget", () => {
    const { renderWidget, useStyles, useProps } = setupWidgetRendering(CurrencyMenu, CurrencyMenuWidgetModule);

    test("Is rendering", () => {
        const currencyMenu = renderWidget().find(CurrencyMenu);

        elementIsRendering(currencyMenu);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.currencyMenu = {
            currencyWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        };

        const props = useProps();
        props.currencies = [
            { id: 1, currencyCode: 123 },
            { id: 2, currencyCode: 345 },
        ] as any;

        const styledWrappers = renderWidget().find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});
