import { ComponentThemeProps } from "@insite/mobius/globals/baseTheme";
import getColor from "@insite/mobius/utilities/getColor";
import { css } from "styled-components";

const DynamicDropdownPresentationPropsDefault: ComponentThemeProps["dynamicDropdown"]["defaultProps"] = {
    cssOverrides: {
        noOptions: css`
            color: ${getColor("text.disabled")};
        ` as any,
    },
    iconProps: { src: "ChevronDown" },
};

export default DynamicDropdownPresentationPropsDefault;
