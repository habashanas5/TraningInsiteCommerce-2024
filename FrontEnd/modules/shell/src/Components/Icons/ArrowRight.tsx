import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const ArrowRight: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4a4a4a",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 9.5, 14);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 9.5 14"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path fill="none" stroke={color1} strokeWidth="2" strokeLinecap="round" d="M1 1l7 6-7 6" />
        </svg>
    );
};

export default React.memo(ArrowRight);
