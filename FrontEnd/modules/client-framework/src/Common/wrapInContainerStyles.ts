import { css } from "styled-components";

// A portion of this snippet was obtained from
// https://css-tricks.com/snippets/css/prevent-long-urls-from-breaking-out-of-container/
const wrapInContainerStyles = css`
    /* These are technically the same, but IE 11 does not support overflow-wrap, so use both. */
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    /* This is the dangerous property in WebKit, as it breaks things wherever. */
    word-break: break-all;
    /* Instead use this non-standard property. */
    word-break: break-word;
`;

export default wrapInContainerStyles;
