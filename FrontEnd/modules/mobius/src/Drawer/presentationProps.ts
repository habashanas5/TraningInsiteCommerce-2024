import { css, keyframes } from "styled-components";

const DrawerPresentationPropsDefault = {
    cssOverrides: {
        titleButton: css`
            padding: 0 1em;
        `,
        headlineTypography: css`
            margin: 7px 0 7px 45px;
        `,
    },
    headlineTypographyProps: {
        size: 24,
        lineHeight: "33px",
    },
    closeButtonIconProps: {
        src: "X",
        size: 24,
    },
    transitions: {
        left: {
            enabled: true,
            length: 300,
            scrimEntryKeyframes: keyframes`
                from { opacity: 0; }
                to { opacity: 1; }
            `,
            scrimExitKeyframes: keyframes`
                from { opacity: 1; }
                to { opacity: 0; }
            `,
            overlayEntryKeyframes: keyframes`
                from { margin-left: -100%; }
                to { margin-left: 0; }
            `,
            overlayExitKeyframes: keyframes`
                from { margin-left: 0; }
                to { margin-left: -100%; }
            `,
        },
        top: {
            overlayEntryKeyframes: keyframes`
                0% { transform: translateY(-100%); }
                100% { transform: translateY(0%); }
            `,
            overlayExitKeyframes: keyframes`
                0% { transform: translateY(0%); }
                100% { transform: translateY(-100%); }
            `,
        },
        bottom: {
            overlayEntryKeyframes: keyframes`
                0% { transform: translateY(100%); }
                100% { transform: translateY(0%); }
            `,
            overlayExitKeyframes: keyframes`
                0% { transform: translateY(0%); }
                100% { transform: translateY(100%); }
            `,
        },
        right: {
            overlayEntryKeyframes: keyframes`
                0% { transform: translateX(100%); }
                100% { transform: translateX(0%); }
            `,
            overlayExitKeyframes: keyframes`
                0% { transform: translateX(100%); }
                100% { transform: translateX(0%); }
            `,
        },
    },
};

export default DrawerPresentationPropsDefault;
