import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const CompareVersion: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A4A4A",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 26, 16);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 26 16"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill="none"
                stroke={color1}
                strokeWidth="2"
                d="M13 1C6.1 1 1.2 8 1.2 8s4.9 7 11.8 7 11.8-7 11.8-7S19.9 1 13 1z"
            />
            <path
                fill="none"
                stroke={color1}
                strokeWidth="2"
                d="M13 3.8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"
            />
            <path
                fill="none"
                stroke={color1}
                strokeWidth="2"
                strokeLinecap="round"
                d="M11.6 7c-.1.2-.2.5-.2.8 0 .9.7 1.6 1.6 1.6"
            />
        </svg>
    );
};

export default React.memo(CompareVersion);
