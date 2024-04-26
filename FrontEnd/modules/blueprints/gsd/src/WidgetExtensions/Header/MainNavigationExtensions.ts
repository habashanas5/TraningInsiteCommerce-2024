import { mainNavigationStyles } from "@insite/content-library/Widgets/Header/MainNavigation";
import getColor from "@insite/mobius/utilities/getColor";
import { css } from "styled-components";

mainNavigationStyles.mobileSearchButton = {
    size: 48,
    buttonType: "solid",
    color: "#f3f3f3",
    css: css`
        padding: 0 10px;
    `,
};

mainNavigationStyles.menuItemTypography = {
    variant: "headerSecondary",
    color: "black",
    css: css`
        padding-right: 35px;
    `,
};

mainNavigationStyles.container = {
    css: css`
        color: ${getColor("common.background")};
        padding: 0 16px 0 20px; // decrease left gap
        display: flex;
        justify-content: left;
    `,
};

mainNavigationStyles.menuItemIcon = {
    css: css`
        display: none; // no down arrows on navigation
    `,
};
