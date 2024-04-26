import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const Trash: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A4A4A",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 13.6, 15.6);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 13.6 15.6"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill={color1}
                d="M13.1 1.9H9.7v-.5c0-.8-.6-1.5-1.4-1.5H5.2c-.7.2-1.3.8-1.3 1.5v.5H.5c-.3 0-.5.2-.5.5s.2.5.5.5h.8L2 14c.1 1 .8 1.6 1.7 1.6h6.2c.9 0 1.5-.6 1.7-1.7l.7-11h.8c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm-8.2-.5c0-.3.3-.5.4-.5h3c.2 0 .4.2.4.5v.5H4.9v-.5zm5.7 12.4c-.1.5-.3.8-.7.8H3.7c-.4 0-.6-.3-.7-.7l-.7-11h9l-.7 10.9z"
            />
            <path
                fill={color1}
                d="M8.7 13.7c.3 0 .5-.2.5-.5l.5-8.8c0-.3-.2-.5-.5-.5-.2 0-.5.2-.5.5l-.5 8.8c0 .2.2.5.5.5zm-1.9 0c.3 0 .5-.2.5-.5V4.4c0-.3-.2-.5-.5-.5s-.5.2-.5.5v8.8c0 .3.2.5.5.5zm-1.9 0c.3 0 .5-.2.5-.5l-.5-8.8c0-.3-.2-.5-.5-.5s-.5.2-.5.5l.5 8.8c0 .3.2.5.5.5z"
            />
        </svg>
    );
};

export default React.memo(Trash);
