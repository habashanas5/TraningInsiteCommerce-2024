import { ComponentThemeProps } from "@insite/mobius/globals/baseTheme";

const FileUploadPresentationPropsDefault: ComponentThemeProps["fileUpload"]["defaultProps"] = {
    iconProps: { src: "UploadCloud" },
    clearIconProps: { src: "X" },
    transitionLength: "short",
};

export default FileUploadPresentationPropsDefault;
