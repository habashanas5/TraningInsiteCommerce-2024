import { footerContainerStyles } from "@insite/content-library/Widgets/Footer/FooterContainer";
import baseTheme from "@insite/mobius/globals/baseTheme";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import { css } from "styled-components";

footerContainerStyles.widgetGridContainer = {
    css: css`
        background-color: #f3f3f3;
        width: 100%;
        margin: 0 auto;
        ${({ theme }) => {
            const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
            return breakpointMediaQueries(theme, [
                css`
                    padding: 0 40px;
                    max-width: ${maxWidths[1]}px;
                `,
                css`
                    padding: 0 20px;
                    max-width: ${maxWidths[1]}px;
                `,
                css`
                    max-width: ${maxWidths[2]}px;
                `,
                css`
                    max-width: ${maxWidths[3]}px;
                `,
                css`
                    max-width: ${maxWidths[4]}px;
                `,
            ]);
        }}
    `,
};

footerContainerStyles.socialLinksGridItem = {
    css: css`
        > div > div > div {
            margin: 0 5px;
        }
    `,
    width: 12,
};

footerContainerStyles.siteMapLinksGridItem = {
    css: css`
        padding: 0;
        > div > div {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            width: 100%;
        }
    `,
    width: 12,
};
