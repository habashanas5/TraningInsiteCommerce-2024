import SubscribeWidgetModule, { CmsSubscribe } from "@insite/content-library/Widgets/Basic/Subscribe";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import GridContainer from "@insite/mobius/GridContainer";
import "jest-styled-components";
import { css } from "styled-components";

describe("Subscribe Widget", () => {
    const { renderWidget, useStyles } = setupWidgetRendering(CmsSubscribe, SubscribeWidgetModule);

    test("Is rendering", () => {
        const cmsSubscribe = renderWidget().find(CmsSubscribe);

        elementIsRendering(cmsSubscribe);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.subscribe = {
            mainGridContainer: {
                css: css`
                    background: magenta;
                `,
            },
        };

        const styledWrappers = renderWidget().find(GridContainer);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});
