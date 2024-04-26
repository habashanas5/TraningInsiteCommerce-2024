import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const OverflowCopyPage: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#9B9B9B",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 21, 18);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 21 18"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill={color1}
                d="M14.9 6.3V4.8c0-.3-.2-.5-.5-.5s-.5.2-.5.5v1.5H6.3v11.2h14.4V6.3h-5.8zm4.8 10.2H7.3V7.3h12.4v9.2z"
            />
            <path
                fill={color1}
                d="M17 11.5h-3v-3h-1v3h-3v1h3v3h1v-3h3zm-11.4-.8h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5-.2.5-.5s-.3-.5-.5-.5zm-4 0l-.1-.9c0-.3-.2-.5-.5-.5s-.5.2-.5.5v1.9h1.1c.3 0 .5-.2.5-.5s-.3-.5-.5-.5zM1 8.3c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5s-.5.2-.5.5v2c0 .3.2.5.5.5zm0-4c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5s-.5.2-.5.5v2c0 .3.2.5.5.5zM4.7 1c0-.3-.2-.5-.5-.5h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5-.2.5-.5zM8.2.5h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5-.2.5-.5S8.5.5 8.2.5zm4 0h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm2.2 0h-.2c-.3 0-.5.2-.5.5 0 .2.1.3.2.4v1.3c0 .3.2.5.5.5s.5-.2.5-.5V.5h-.5z"
            />
        </svg>
    );
};

export default React.memo(OverflowCopyPage);
