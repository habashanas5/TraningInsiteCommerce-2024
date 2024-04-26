import { cartLinkStyles } from "@insite/content-library/Widgets/Common/CartLink";
import { css } from "styled-components";

cartLinkStyles.routerLink = {
    typographyProps: {
        variant: "headerSecondary",
    },
    icon: {
        iconProps: {
            size: 24,
        },
    },
    color: "black",
    css: css`
        height: 50px;
        padding: 0 4px 0 10px;
    `,
};
