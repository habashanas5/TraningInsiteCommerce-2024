import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import SocialLinksWidgetModule, { SocialLinks } from "@insite/content-library/Widgets/Basic/SocialLinks";
import { elementHasStyle, elementIsRendering, setupWidgetRendering } from "@insite/content-library/WidgetTests/helpers";
import "jest-styled-components";
import { css } from "styled-components";

describe("SocialLinks Widget", () => {
    const { renderWidget, useStyles } = setupWidgetRendering(SocialLinks, SocialLinksWidgetModule);

    test("Is rendering", () => {
        const socialLinks = renderWidget().find(SocialLinks);

        elementIsRendering(socialLinks);
    });

    test("StylesProvider styles are being passed", () => {
        const styles = useStyles();
        styles.socialLinks = {
            socialLinkListWrapper: {
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
