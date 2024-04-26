import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import LinkListWidgetModule, { LinkList } from "@insite/content-library/Widgets/Basic/LinkList";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("Link List Widget", () => {
    const { renderWidget, useStyles } = setupWidgetRendering(LinkList, LinkListWidgetModule);

    test("Is rendering", () => {
        const linkList = renderWidget().find(LinkList);

        elementIsRendering(linkList);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.linkList = {
            linkListWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        };

        const styledWrappers = renderWidget().find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers.at(0), styleRule);
    });
});
