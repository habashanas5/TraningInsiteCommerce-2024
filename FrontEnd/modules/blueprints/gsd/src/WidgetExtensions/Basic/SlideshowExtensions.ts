import { slideshowStyles } from "@insite/content-library/Widgets/Basic/Slideshow";
import { css } from "styled-components";

slideshowStyles.slideshowWrapper = {
    css: css`
        padding: 0 0;
        position: relative;
    `,
};

slideshowStyles.iconProps = {
    css: css`
        color: white !important;
    `,
};

slideshowStyles.slideButton = {
    shape: "pill",
    typographyProps: {
        weight: "normal",
    },
    sizeVariant: "large",
    css: css`
        text-transform: uppercase;
        width: fit-content;
        font-weight: normal;
    `,
};

// slideshowStyles.headingText = {};
