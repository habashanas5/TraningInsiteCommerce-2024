import { headerSignInStyles } from "@insite/content-library/Widgets/Common/HeaderSignIn";
import { css } from "styled-components";

headerSignInStyles.titleTypography = {
    css: css`
        margin-left: 10px;
        max-width: 150px;
        color: white;
    `,
    ellipsis: true,
    transform: "uppercase",
};

headerSignInStyles.titleIcon = {
    size: 22,
    color: "white",
};

headerSignInStyles.signOutClickable = {
    css: css`
        flex: 0 0 auto;
        margin-left: 30px;
        text-transform: uppercase;
        color: white;
    `,
};
