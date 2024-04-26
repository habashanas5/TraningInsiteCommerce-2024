import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const Link: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#99999A",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 18.5, 19.5);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 18.5 19.5"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill="none"
                stroke={color1}
                strokeWidth="1.5"
                strokeLinecap="round"
                d="M9.3 4.4l2.5-2.6c1.4-1.4 3.6-1.4 4.9 0 1.4 1.4 1.4 3.7 0 5.2l-3.9 4.1c-1.4 1.4-3.6 1.4-4.9 0-.2-.2-.3-.4-.4-.6"
            />
            <path
                fill="none"
                stroke={color1}
                strokeWidth="1.5"
                strokeLinecap="round"
                d="M9.2 15.1l-2.5 2.6c-1.4 1.4-3.6 1.4-4.9 0-1.4-1.4-1.4-3.7 0-5.2l3.9-4.1C7.1 7 9.3 7 10.6 8.4c.2.2.3.4.4.6"
            />
        </svg>
    );
};

export default React.memo(Link);
