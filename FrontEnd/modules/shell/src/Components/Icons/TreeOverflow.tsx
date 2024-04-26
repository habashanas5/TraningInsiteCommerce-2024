import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const TreeOverflow: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A4A4A",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 12, 24);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 12 24"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="6" cy="6" r="2" />
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="6" cy="12" r="2" />
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="6" cy="18" r="2" />
        </svg>
    );
};

export default React.memo(TreeOverflow);
