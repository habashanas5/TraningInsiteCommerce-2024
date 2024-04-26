import { ComponentThemeProps } from "@insite/mobius/globals/baseTheme";

const OverflowMenuPresentationPropsDefault: ComponentThemeProps["overflowMenu"]["defaultProps"] = {
    buttonProps: {
        color: "common.background",
        shape: "pill",
        buttonType: "solid",
        shadow: false,
    },
    iconProps: { src: "MoreVertical" },
};

export default OverflowMenuPresentationPropsDefault;
