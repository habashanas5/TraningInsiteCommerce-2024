import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const ViewPreviousAsset: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A4A4A",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 20, 20);
    return (
        <svg focusable="false" className={className} width="26" height="16">
            <g stroke={color1} strokeWidth="2" fill="none" fillRule="evenodd">
                <path d="M12.977 1c-6.883 0-11.8 7.006-11.8 7.006s4.917 7.007 11.8 7.007c6.884 0 11.8-7.007 11.8-7.007S19.861 1 12.977 1z" />
                <path d="M12.977 3.811a4 4 0 100 8 4 4 0 100-8z" />
                <path d="M11.591 7.012a1.601 1.601 0 001.386 2.398" strokeLinecap="round" />
            </g>
        </svg>
    );
};

export default React.memo(ViewPreviousAsset);
