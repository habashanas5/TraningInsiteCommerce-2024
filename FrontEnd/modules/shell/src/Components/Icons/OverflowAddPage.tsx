import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const OverflowAddPage: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#9B9B9B",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 20, 15);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 20 15"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path fill={color1} d="M0 7h5c1.1 0 2-.9 2-2V0L0 7z" />
            <path
                fill="none"
                stroke={color1}
                d="M6.2.5H18c.8 0 1.5.6 1.5 1.4v11.2c0 .8-.7 1.4-1.5 1.4H2c-.8 0-1.5-.6-1.5-1.4V5.8L6.2.5z"
            />
            <path fill={color1} d="M14 7h-3V4h-1v3H7v1h3v3h1V8h3z" />
        </svg>
    );
};

export default React.memo(OverflowAddPage);
