import { ComponentThemeProps } from "@insite/mobius/globals/baseTheme";
import { css } from "styled-components";

/* stylelint-disable */
const MenuDefaultProps: ComponentThemeProps["menu"]["defaultProps"] = {
    moreIconProps: {
        css: css`
            padding-right: 5px;
            position: absolute;
            top: 10px;
            right: 0;
        `,
        src: "ChevronRight",
        color: "common.backgroundContrast",
    },
    menuItemTypographyProps: {
        size: 15,
    },
    menuItemClickableProps: {
        css: css`
            word-wrap: break-word;
            display: block;
        `,
    },
};
/* stylelint-enable */

export default MenuDefaultProps;
