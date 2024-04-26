import * as React from "react";

const BadgeOriginal: React.FC<{ size?: number; color1?: string; color2?: string; className?: string }> = ({
    size = 16,
    color1 = "#78BC21",
    color2 = "#FFF",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 16 16" width={size} height={size}>
        <path fill={color1} d="M4 0h8c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V4c0-2.2 1.8-4 4-4z" />
        <path
            fill={color2}
            d="M8 4C6.1 4 4.5 5.8 4.5 8s1.6 4 3.5 4 3.5-1.8 3.5-4S9.9 4 8 4zm0 6.5c-1.1 0-2-1.1-2-2.5s.9-2.5 2-2.5 2 1.1 2 2.5-.9 2.5-2 2.5z"
        />
    </svg>
);

export default React.memo(BadgeOriginal);
