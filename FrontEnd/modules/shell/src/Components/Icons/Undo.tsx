import * as React from "react";

const Undo: React.FC<{ size?: number; color1?: string; className?: string }> = ({
    size = 20,
    color1 = "#4A4A4A",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 20 20" width={size} height={size}>
        <g stroke={color1} strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M6.235 6.195l-5.019.027.025-5.021" />
            <path d="M3.63 15.95c3.35 3.351 8.861 3.27 12.31-.18 3.449-3.448 3.53-8.96.18-12.309-3.35-3.35-8.862-3.27-12.31.18A8.987 8.987 0 002 6.216" />
        </g>
    </svg>
);

export const UndoSrc: React.FC = () => {
    return (
        <svg focusable="false" viewBox="0 0 20 20" width="24" height="24">
            <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                <path d="M6.235 6.195l-5.019.027.025-5.021" />
                <path d="M3.63 15.95c3.35 3.351 8.861 3.27 12.31-.18 3.449-3.448 3.53-8.96.18-12.309-3.35-3.35-8.862-3.27-12.31.18A8.987 8.987 0 002 6.216" />
            </g>
        </svg>
    );
};

export default React.memo(Undo);
