import { socialLinksStyles } from "@insite/content-library/Widgets/Basic/SocialLinks";
import { css } from "styled-components";

socialLinksStyles.socialLinkListWrapper = {
    css: css`
        width: 100%;
        padding: 10px 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
    `,
};

socialLinksStyles.linkWrapper = {
    css: css`
        flex-shrink: 0;
        display: flex; // center all the links
        justify-content: center; // center all the links
        word-break: normal; // allows links to wrap responsively
        flex-grow: 0; // leave space on the sides
    `,
};
