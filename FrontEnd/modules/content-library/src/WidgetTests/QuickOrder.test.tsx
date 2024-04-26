import QuickOrderWidgetModule, { QuickOrder } from "@insite/content-library/Widgets/Basic/QuickOrder";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import GridContainer from "@insite/mobius/GridContainer";
import "jest-styled-components";
import { css } from "styled-components";

describe("QuickOrder Widget", () => {
    const { renderWidget, useStyles, useProps } = setupWidgetRendering(QuickOrder, QuickOrderWidgetModule);

    test("Is rendering", () => {
        const quickOrder = renderWidget().find(QuickOrder);

        elementIsRendering(quickOrder);
    });

    test("StylesProvider styles are being passed", () => {
        const props = useProps();
        props.allowQuickOrder = true;
        const styles = useStyles();
        styles.quickOrder = {
            container: {
                css: css`
                    background: magenta;
                `,
            },
        };

        const gridContainer = renderWidget().find(GridContainer).at(0);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(gridContainer, styleRule);
    });
});
