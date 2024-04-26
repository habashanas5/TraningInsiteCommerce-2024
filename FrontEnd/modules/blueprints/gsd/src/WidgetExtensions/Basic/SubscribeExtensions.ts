import { subscribeStyles } from "@insite/content-library/Widgets/Basic/Subscribe";
import { css } from "styled-components";

subscribeStyles.emailButton = {
    css: css`
        padding: 0;
        min-width: 100px; // prevent button from shrinking to be too small for text
    `,
    typographyProps: {
        weight: "normal", // remove bold on the subscribe button
    },
};
