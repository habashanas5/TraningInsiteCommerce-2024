import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const Page: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#D8D8D8",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 12, 16);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 12 16"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill={color1}
                d="M5.072 0L.014 5.349 0 14c0 1.1.9 2 2 2l8.008-.005c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2L5.072 0z"
            />
            <path fillOpacity=".2" d="M.014 5.377H3.1c1.1 0 2-.9 2-2L5.058.014.014 5.377z" />
        </svg>
    );
};

export default React.memo(Page);
