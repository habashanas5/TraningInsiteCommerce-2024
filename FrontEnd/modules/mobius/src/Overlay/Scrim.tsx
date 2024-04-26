import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { OverlayComponentProps, Transition } from "@insite/mobius/Overlay/Overlay";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import * as React from "react";
import styled, { css, ThemeProps } from "styled-components";

export type ScrimProps = {
    isClosing?: boolean;
    transition?: Transition;
    persistentClosed?: boolean;
    persisted?: boolean;
} & ThemeProps<BaseTheme> &
    InjectableCss &
    Pick<OverlayComponentProps, "zIndexLevel">;

const Scrim = styled.div<ScrimProps>`
    z-index: ${({ theme, zIndexLevel }) => theme.zIndex[zIndexLevel]};
    transition: background-color 300ms ease-in-out;
    ${({ persistentClosed, persisted }) =>
        persisted && persistentClosed
            ? `
        background-color: rgba(0, 0, 0, 0);
    `
            : `
        background-color: rgba(0, 0, 0, 0.4);
        touch-action: none;
    `}
    overflow: hidden;
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    ${
        /* sc-declaration */ ({ isClosing, transition }) =>
            transition &&
            css`
                animation: ${isClosing ? transition.scrimExitKeyframes : transition.scrimEntryKeyframes}
                    ${transition.length}ms;
            `
    }
    ${injectCss}
`;

export default Scrim;
