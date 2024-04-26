import { logoLinksSearchStyles } from "@insite/content-library/Widgets/Header/LogoLinksSearch";
import baseTheme from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { css } from "styled-components";

logoLinksSearchStyles.container = {
    css: css`
        display: flex;
        width: 100%;
        margin: 0 auto -5px auto; // center and reduce the header height a bit
        justify-content: space-between;
        ${({ theme }) => {
            const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
            return breakpointMediaQueries(theme, [
                css`
                    max-width: ${maxWidths[1]}px;
                `,
                css`
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

logoLinksSearchStyles.logoWrapper = {
    css: css`
        text-align: left;
        padding: 0 0 0 20px; // less gap on logo
        margin: 0;
        ${({ theme }) => {
            return breakpointMediaQueries(
                theme,
                [
                    null,
                    null,
                    css`
                        flex-grow: 1;
                    `,
                    null,
                    null,
                ],
                "max",
            );
        }}
        img {
            height: 78px;
            width: auto;
            ${({ theme }) => {
                return breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            height: 42px;
                            width: auto;
                            margin: 0;
                        `,
                        null,
                        null,
                    ],
                    "max",
                );
            }}
        }
    `,
};

logoLinksSearchStyles.linkListHidden = {
    css: css`
        display: none;
    `,
};

logoLinksSearchStyles.searchMenuWrapper = {
    css: css`
        text-align: right;
        padding: 10px 20px 0 0;
        ${({ theme }) => {
            return breakpointMediaQueries(
                theme,
                [
                    null,
                    css`
                        display: none;
                    `,
                    css`
                        flex-grow: 8;
                    `,
                    null,
                    null,
                ],
                "max",
            );
        }}
    `,
};
