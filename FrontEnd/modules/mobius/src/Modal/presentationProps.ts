import { ComponentThemeProps } from "@insite/mobius/globals/baseTheme";
import { css, keyframes } from "styled-components";

const ModalPresentationPropsDefault: ComponentThemeProps["modal"]["defaultProps"] = {
    cssOverrides: {
        headlineTypography: css`
            margin-bottom: 0;
            display: inline-block;
        `,
        titleButton: css`
            padding: 4px;
        `,
    },
    closeButtonProps: {
        shape: "pill",
        buttonType: "solid",
        color: "common.background",
        size: 36,
    },
    closeButtonIconProps: {
        src: "X",
        size: 24,
    },
    transition: {
        enabled: true,
        length: 300,
        overlayEntryKeyframes: keyframes`
            from { margin-top: -100px; }
            to { margin-top: 0; }
        `,
        overlayExitKeyframes: keyframes`
            from { margin-top: 0; }
            to { margin-top: -100px; }
        `,
        scrimEntryKeyframes: keyframes`
            from { opacity: 0; }
            to { opacity: 1; }
        `,
        scrimExitKeyframes: keyframes`
            from { opacity: 1; }
            to { opacity: 0; }
        `,
    },
};

export default ModalPresentationPropsDefault;
