import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const Drag: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4D4D4D",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 9, 15);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 9 15"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="1.5" cy="1.5" r="1.5" />
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="1.5" cy="7.5" r="1.5" />
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="1.5" cy="13.5" r="1.5" />
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="7.5" cy="1.5" r="1.5" />
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="7.5" cy="7.5" r="1.5" />
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="7.5" cy="13.5" r="1.5" />
        </svg>
    );
};

export default React.memo(Drag);
