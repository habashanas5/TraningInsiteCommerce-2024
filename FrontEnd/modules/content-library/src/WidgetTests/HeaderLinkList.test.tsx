import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import HeaderLinkListWidgetModule, { HeaderLinkList } from "@insite/content-library/Widgets/Header/HeaderLinkList";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("HeaderLinkList Widget", () => {
    const { renderWidget, useStyles, useFields } = setupWidgetRendering(HeaderLinkList, HeaderLinkListWidgetModule);

    test("Is rendering", () => {
        const headerLinkList = renderWidget().find(HeaderLinkList);

        elementIsRendering(headerLinkList);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.headerLinkList = {
            headerLinkListWrapper: {
                css: css`
                    background: magenta;
                `,
            },
        };
        const fields = useFields();
        fields.links = [
            {
                fields: {
                    destination: {
                        type: "Url",
                        value: "/",
                    },
                },
            },
        ];

        const styledWrappers = renderWidget().find(StyledWrapper);
        const styleRule = /background:\s?magenta;/;

        elementHasStyle(styledWrappers, styleRule);
    });
});
