import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const ArrowDown: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A4A4A",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 14, 9.5);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 14 9.5"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path fill="none" stroke={color1} strokeWidth="2" strokeLinecap="round" d="M1 1l6 7 6-7" />
        </svg>
    );
};

export default React.memo(ArrowDown);
