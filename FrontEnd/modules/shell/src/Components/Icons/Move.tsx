import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const Move: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#484848",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 10, 18);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 10 18"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill={color1}
                d="M9.2 4.2L5 0 .8 4.2l1.4 1.5L4 3.8V8h2V3.8l1.8 1.9zM.7 13.7L5 18l4.2-4.3-1.4-1.4L6 14.2V10H4v4.2l-1.9-1.9z"
            />
        </svg>
    );
};

export default React.memo(Move);
