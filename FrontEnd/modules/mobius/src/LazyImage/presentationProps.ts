import { ComponentThemeProps } from "@insite/mobius/globals/baseTheme";

const LazyImagePresentationPropsDefault: ComponentThemeProps["lazyImage"]["defaultProps"] = {
    height: "100%",
    width: "auto",
    errorIconProps: {
        src: "ImageIcon",
        color: "text.accent",
    },
    errorTypographyProps: {
        variant: "legend",
        color: "text.accent",
    },
};

export default LazyImagePresentationPropsDefault;
