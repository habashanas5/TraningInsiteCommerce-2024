import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { ExtendedTheme } from "@insite/mobius/ThemeProvider";
import get from "@insite/mobius/utilities/get";
import getProp from "@insite/mobius/utilities/getProp";
import styled, { createGlobalStyle, GlobalStyleComponent } from "styled-components";

export interface GlobalStyleProps {}

const fontSize =
    () =>
    ({ theme }: { theme: BaseTheme }) => {
        const size = get(theme, "typography.body.size", 15);
        return typeof size === "string" ? size : `${size}px`;
    };

/**
 * GlobalStyle is used to set the basic CSS for the site.
 * Use it only for style rules that apply to the entire site.
 * Since this creates styling at a global level,
 * place it in the outermost element of the site to avoid multiple instantiation.
 */
const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
    html {
        font-family: ${getProp("theme.typography.body.fontFamily")};
        box-sizing: border-box;
        height: 100%;
    }
    body {
        margin: 0;
        height: 100%;
        line-height: 1.5;
        font-size: ${getProp("theme.typography.body.size")};
        font-weight: ${getProp("theme.typography.body.weight")};
        color: ${getProp("theme.colors.text.main")};
        background: ${getProp("theme.colors.common.background")};
    }
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    a {
        color: inherit;
        cursor: pointer; // for links without href
        text-decoration: none;
    }

    /* Typography resets */
    span, p, h1, h2, h3, h4, h5, h6 {
        margin: 0;
        padding: 0;
        font-size: inherit;
        font-weight: inherit;
    }
    *, *::before, *::after {
        box-sizing: inherit;
    }
    #react-app {
        height: 100%;
    }

    @media print {
        header, footer, button {
            display: none !important;
        }
        h1 {
            font-size: 15px !important;
        }
        a {
            color: ${getProp("theme.colors.text.main")} !important;
        }
        body {
            font-size: 11px !important;
        }
    }

    ${getProp("theme.globalStyle.css")};
` as GlobalStyleComponent<GlobalStyleProps, ExtendedTheme>;

export const ChildGlobals = styled.div`
    font-family: ${getProp("theme.typography.body.fontFamily")};
    color: ${getProp("theme.colors.text.main")};
    font-size: ${fontSize()};
`;

/** @component */
export default GlobalStyle;
