import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const DeviceTablet: React.FC<{
    width?: number;
    height?: number;
    color1?: string;
    color2?: string;
    className?: string;
}> = ({ width = undefined, height = undefined, color1 = "#DBDBDB", color2 = "#F4F4F4", className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 815, 1085);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 815 1085"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill={color1}
                d="M785 0H30C13.4 0 0 13.4 0 30v1025c0 16.6 13.4 30 30 30h755c16.6 0 30-13.4 30-30V30c0-16.6-13.4-30-30-30zm7 1031c0 16.6-13.4 30-30 30H54c-16.6 0-30-13.4-30-30V67c0-16.6 13.4-30 30-30h708c16.6 0 30 13.4 30 30v964z"
            />
            <circle fillRule="evenodd" clipRule="evenodd" fill={color2} cx="408" cy="19" r="8" />
        </svg>
    );
};

export default React.memo(DeviceTablet);
