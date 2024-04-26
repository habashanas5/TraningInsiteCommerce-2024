import "@episerver/platform-navigation/dist/main.css";
import italicInterFont from "@optimizely/design-tokens/dist/fonts/src/Inter-italic.var.woff2";
import romanInterFont from "@optimizely/design-tokens/dist/fonts/src/Inter-roman.var.woff2";
import * as axiomTypography from "@optimizely/design-tokens/dist/js/typography";
import { createGlobalStyle } from "styled-components";

const BrandStyles = createGlobalStyle`
    @font-face {
        font-family: Inter;
        font-weight: 100 900;
        font-display: swap;
        font-style: normal;
        src: url(${romanInterFont}) format("woff2");
    }

    @font-face {
        font-family: Inter;
        font-weight: 100 900;
        font-display: swap;
        font-style: italic;
        src: url(${italicInterFont}) format("woff2");
    }

    h1 {
        font-size: ${axiomTypography.header1FontSize};
        font-weight: ${axiomTypography.header1FontWeight};
        line-height: ${axiomTypography.header1LineHeight};
        letter-spacing: ${axiomTypography.letterSpacingHeader1};
    }

    h2 {
        font-size: ${axiomTypography.header2FontSize};
        font-weight: ${axiomTypography.header2FontWeight};
        line-height: ${axiomTypography.header2LineHeight};
        letter-spacing: ${axiomTypography.letterSpacingHeader2};
    }

    h3:not(.link-selector) {
        font-size: ${axiomTypography.header3FontSize};
        font-weight: ${axiomTypography.header3FontWeight};
        line-height: ${axiomTypography.header3LineHeight};
        letter-spacing: ${axiomTypography.letterSpacingHeader3};
    }

    h4 {
        font-size: ${axiomTypography.header4FontSize};
        font-weight: ${axiomTypography.header4FontWeight};
        line-height: ${axiomTypography.header4LineHeight};
        letter-spacing: ${axiomTypography.letterSpacingHeader4};
    }

    h5 {
        font-size: ${axiomTypography.header5FontSize};
        font-weight: ${axiomTypography.header5FontWeight};
        line-height: ${axiomTypography.header5LineHeight};
        letter-spacing: ${axiomTypography.letterSpacingHeader5};
    }

    body, p {
        font-size: ${axiomTypography.bodyFontSize};
        font-weight: ${axiomTypography.bodyFontWeight};
        line-height: ${axiomTypography.bodyLineHeight};
        letter-spacing: ${axiomTypography.bodyLetterSpacing};
    }
`;

export default BrandStyles;
