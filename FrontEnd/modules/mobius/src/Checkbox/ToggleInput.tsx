import { IconMemo } from "@insite/mobius/Icon";
import getColor from "@insite/mobius/utilities/getColor";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import getProp from "@insite/mobius/utilities/getProp";
import injectCss from "@insite/mobius/utilities/injectCss";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import * as React from "react";
import styled, { css } from "styled-components";

const toggleSizes = {
    default: {
        iconSize: 22,
        circleSize: 16,
        height: 20,
        width: 44,
        uncheckedOffset: -24,
    },
    small: {
        iconSize: 18,
        circleSize: 12,
        height: 16,
        width: 36,
        uncheckedOffset: -20,
    },
};

const Slider = styled.span`
    margin: -2px 4px;
    width: 66px;
    position: absolute;
    left: 0;
    transition: all ${getProp("theme.transition.duration.regular", "300")}ms ease-in-out;
    display: flex;
    align-items: center;
`;

type SliderFrameProps = {
    _sizeVariant: keyof typeof toggleSizes;
    _color?: string;
};

const SliderFrame = styled.div<SliderFrameProps>`
    min-width: ${({ _sizeVariant }) => toggleSizes[_sizeVariant].width}px;
    height: ${({ _sizeVariant }) => toggleSizes[_sizeVariant].height}px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    &[aria-checked="true"]:not([aria-disabled]) {
        background: ${({ _color, theme }) => resolveColor(_color, theme)};
        border: ${({ _color, theme }) => resolveColor(_color, theme)} 1px solid;
        color: ${({ _color, theme }) => getContrastColor(_color, theme)};
        fill: ${({ _color, theme }) => getContrastColor(_color, theme)};
    }
    &[aria-checked="false"]:not([aria-disabled]) {
        background: ${getColor("common.background")};
        border: ${getColor("text.accent")} solid 1px;
        color: ${getColor("text.accent")};
        fill: ${getColor("text.accent")};
    }
    &[aria-checked="false"] ${Slider} {
        left: ${({ _sizeVariant }) => toggleSizes[_sizeVariant].uncheckedOffset}px;
    }
    &[aria-disabled] {
        background: ${getColor("common.disabled")};
        border: ${getColor("common.disabled")} 1px solid;
        color: ${getColor("common.background")};
        fill: ${getColor("common.background")};
    }
    & + label {
        margin-left: 10px;
    }
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${getColor("common.backgroundContrast")};
    }
    ${injectCss}
`;

type Props = SliderFrameProps & React.InputHTMLAttributes<HTMLInputElement>;

const ToggleInput: React.FC<Props> = ({ _sizeVariant = "default", ...otherProps }) => (
    <SliderFrame _sizeVariant={_sizeVariant} {...otherProps}>
        <Slider>
            <IconMemo
                src="Check"
                size={toggleSizes[_sizeVariant].iconSize}
                color="currentColor"
                css={css`
                    margin-left: -1px;
                `}
            />
            <IconMemo
                src="FillCircle"
                size={toggleSizes[_sizeVariant].circleSize}
                color="currentColor"
                css={css`
                    margin: 0;
                `}
            />
            <IconMemo
                src="X"
                size={toggleSizes[_sizeVariant].iconSize}
                color="currentColor"
                css={css`
                    margin-left: 2px;
                `}
            />
        </Slider>
    </SliderFrame>
);

export default ToggleInput;
