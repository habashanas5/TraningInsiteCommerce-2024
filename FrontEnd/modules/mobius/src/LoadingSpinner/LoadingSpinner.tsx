import get from "@insite/mobius/utilities/get";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import * as React from "react";
import styled, { keyframes } from "styled-components";

export interface LoadingSpinnerProps extends React.SVGAttributes<SVGElement> {
    /** The stroke color of the circular segment.
     * @themable */
    color?: string;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<LoadingSpinnerProps>;
    /** The height and width of the loading spinner.
     * @themable */
    size?: number;
}

const duration = "1.4s";
const dashOffset = 187;

const rotator = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(270deg);
    }
`;

const dash = keyframes`
    0% {
        stroke-dashoffset: ${dashOffset}px;
    }
    50% {
        stroke-dashoffset: ${dashOffset / 4}px;
        transform: rotate(135deg);
    }
    100% {
        stroke-dashoffset: ${dashOffset}px;
        transform: rotate(450deg);
    }
`;

type Attributes = {
    viewBox: string;
    xmlns?: string;
    children: React.ReactNode;
};

const spinnerSvgAttributes: Attributes = {
    viewBox: "0 0 66 66",
    xmlns: "http://www.w3.org/2000/svg",
    children: <circle cx="33" cy="33" r="30" />,
};

const LoadingSpinnerStyle = styled.svg.attrs<LoadingSpinnerProps, LoadingSpinnerProps>(() => spinnerSvgAttributes)`
    height: ${({ size, theme }) => size || get(theme, "loadingSpinner.defaultProps.size") || "40"}px;
    width: ${({ size, theme }) => size || get(theme, "loadingSpinner.defaultProps.size") || "40"}px;
    animation: ${rotator} ${duration} linear infinite;
    circle {
        fill: none;
        stroke: ${({ color, theme }) => {
            const colorOverride = color || get(theme, "loadingSpinner.defaultProps.color");
            return colorOverride ? resolveColor(colorOverride, theme) : "currentColor";
        }};
        stroke-dasharray: ${dashOffset}px;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        stroke-width: 6px;
        transform-origin: center;
        animation: ${dash} ${duration} ease-in-out infinite;
    }
    ${props => get(props, "css") || get(props, "theme.loadingSpinner.defaultProps.css")}
    ${injectCss}
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = props => <LoadingSpinnerStyle {...props} />;

/** @component */
export default LoadingSpinner;

export { LoadingSpinnerStyle };
