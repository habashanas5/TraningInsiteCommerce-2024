import { footerStyles } from "@insite/content-library/Pages/Footer";
import { css } from "styled-components";

footerStyles.page = {
    fullWidth: [true, true, true, true, true],
    padding: 0,
    css: css`
        padding-top: 15px; // prevents image above from overlapping
        background-color: #f3f3f3; // show gray all the way to edge
    `,
};
