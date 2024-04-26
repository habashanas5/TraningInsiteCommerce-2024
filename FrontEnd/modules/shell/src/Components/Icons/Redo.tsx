import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const Redo: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A4A4A",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 19, 20);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 19 20"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <g stroke={color1} strokeWidth="2" fill="none" strokeLinecap="round">
                <path d="M12.784 6.195l5.019.027-.025-5.021" />
                <path d="M15.95 15.95c-3.35 3.351-8.86 3.27-12.31-.18C.191 12.323.11 6.81 3.46 3.462c3.35-3.35 8.863-3.27 12.31.18a8.987 8.987 0 011.81 2.576" />
            </g>
        </svg>
    );
};

export const RedoSrc: React.FC = () => {
    return (
        <svg focusable="false" viewBox="0 0 19 20" width="24" height="24">
            <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                <path d="M12.784 6.195l5.019.027-.025-5.021" />
                <path d="M15.95 15.95c-3.35 3.351-8.86 3.27-12.31-.18C.191 12.323.11 6.81 3.46 3.462c3.35-3.35 8.863-3.27 12.31.18a8.987 8.987 0 011.81 2.576" />
            </g>
        </svg>
    );
};

export default React.memo(Redo);
