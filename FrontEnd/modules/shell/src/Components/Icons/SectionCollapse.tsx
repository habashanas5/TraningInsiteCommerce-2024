import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const SectionCollapse: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A4A4A",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 15, 16);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 15 16"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path fill={color1} d="M6.96 4.5h1v7h-1z" />
            <path fill="none" stroke={color1} d="M.96 6V1h13v5m-13 4v5h13v-5" />
        </svg>
    );
};

export default React.memo(SectionCollapse);
