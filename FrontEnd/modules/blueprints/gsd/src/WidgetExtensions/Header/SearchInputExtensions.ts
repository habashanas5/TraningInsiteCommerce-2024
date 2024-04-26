import { searchInputStyles } from "@insite/content-library/Widgets/Header/SearchInput";
import Search from "@insite/mobius/Icons/Search";
import { css } from "styled-components";

searchInputStyles.input = {
    sizeVariant: "default",
    iconProps: { src: Search },
    border: "rectangle", // full rectangle border
    cssOverrides: {
        formField: css`
            width: 520px; // longer search box
        `,
    },
};
