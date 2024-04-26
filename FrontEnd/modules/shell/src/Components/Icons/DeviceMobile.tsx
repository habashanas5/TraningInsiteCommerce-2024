import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const DeviceMobile: React.FC<{
    width?: number;
    height?: number;
    color1?: string;
    color2?: string;
    className?: string;
}> = ({ width = undefined, height = undefined, color1 = "#DBDADA", color2 = "#F3F3F3", className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 400, 855);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 400 855"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill={color1}
                d="M370 0H30C13.4 0 0 13.4 0 30v795c0 16.6 13.4 30 30 30h340c16.6 0 30-13.4 30-30V30c0-16.6-13.4-30-30-30zm16.5 812.5c0 15.8-12.5 28.5-28 28.5h-317c-15.5 0-28-12.8-28-28.5V56.4c0-15.8 12.5-28.5 28-28.5h317.1c15.5 0 28 12.8 28 28.5v756.1h-.1z"
            />
            <ellipse fillRule="evenodd" clipRule="evenodd" fill={color2} cx="253" cy="14.7" rx="4" ry="3.9" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill={color2}
                d="M138.9 10.8H239c2.2 0 3.9 1.8 3.9 3.9 0 2.2-1.8 3.9-3.9 3.9H138.9c-2.2 0-3.9-1.8-3.9-3.9 0-2.1 1.8-3.9 3.9-3.9z"
            />
        </svg>
    );
};

export default React.memo(DeviceMobile);
