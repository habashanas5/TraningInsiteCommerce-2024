import { ButtonIcon, ButtonProps } from "@insite/mobius/Button/Button";
import baseTheme, { BaseTheme } from "@insite/mobius/globals/baseTheme";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import safeColor from "@insite/mobius/utilities/safeColor";
import styleObjectToString from "@insite/mobius/utilities/styleObjectToString";
import { css, ThemeProps } from "styled-components";

type ButtonTypesProps = ThemeProps<BaseTheme> &
    Pick<ButtonProps, "hoverMode" | "hoverStyle" | "activeMode" | "activeStyle"> & {
        _color?: string;
    };

const calculateHoverColor = ({ _color, hoverMode = "darken", hoverStyle, theme = baseTheme }: ButtonTypesProps) => {
    if (hoverMode === null || hoverMode === "none") {
        return _color;
    }
    if (hoverStyle?.color) {
        return resolveColor(hoverStyle.color, theme);
    }
    return safeColor(resolveColor(_color, theme))[hoverMode](0.3).string();
};

const calculateActiveColor = ({ _color, activeMode = "darken", activeStyle, theme = baseTheme }: ButtonTypesProps) => {
    if (activeMode === null || activeMode === "none") {
        return _color;
    }
    if (activeStyle?.color) {
        return resolveColor(activeStyle.color, theme);
    }
    return safeColor(resolveColor(_color, theme))[activeMode](0.6).string();
};

const buttonTypes = {
    outline: (props: ButtonTypesProps) => {
        const mainColor = resolveColor(props._color, props.theme);
        const disabledColor = resolveColor("common.disabled", props.theme);
        const hoverColor = calculateHoverColor(props);
        const activeColor = calculateActiveColor(props);
        return css`
            border: 2px solid ${mainColor};
            background: transparent;
            color: ${mainColor};
            ${ButtonIcon} {
                color: ${mainColor};
            }
            &:not(:disabled):hover {
                color: ${hoverColor};
                border-color: ${hoverColor};
                ${styleObjectToString(props.hoverStyle)};
                ${ButtonIcon} {
                    color: ${hoverColor};
                }
            }
            &:active {
                color: ${activeColor};
                border-color: ${activeColor};
                ${styleObjectToString(props.activeStyle)};
                ${ButtonIcon} {
                    color: ${activeColor};
                }
            }
            &:disabled {
                ${ButtonIcon} {
                    color: ${disabledColor};
                }
                color: ${disabledColor};
                border-color: ${disabledColor};
            }
        `;
    },
    solid: (props: ButtonTypesProps) => {
        const mainColor = resolveColor(props._color, props.theme);
        const hoverColor = calculateHoverColor(props);
        const activeColor = calculateActiveColor(props);
        const disabledColor = resolveColor("common.disabled", props.theme);
        const contrastColor = getContrastColor(props._color, props.theme);
        return css`
            background: ${mainColor};
            border: 2px solid ${mainColor};
            color: ${contrastColor};
            ${ButtonIcon} {
                color: ${contrastColor};
            }
            &:hover {
                background: ${hoverColor};
                border-color: ${hoverColor};
                ${styleObjectToString(props.hoverStyle)};
            }
            &:active {
                background: ${activeColor};
                border-color: ${activeColor};
                ${styleObjectToString(props.activeStyle)};
            }
            &:disabled {
                background: ${disabledColor};
                border-color: ${disabledColor};
                color: ${resolveColor("common.background", props.theme)};
            }
        `;
    },
};

export default buttonTypes;
