import * as React from "react";

const BadgeExperiement: React.FC<{ size?: number; color1?: string; color2?: string; className?: string }> = ({
    size = 16,
    color1 = "#78BC21",
    color2 = "#FFF",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 16 16" width={size} height={size}>
        <path fill={color1} d="M12 0H4C1.8 0 0 1.8 0 4v8c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4z" />
        <path fill={color2} d="M10.2 8.6H7.1v2.1h3.6V12H5.5V4.2h5.2v1.3H7.1v1.9h3.1v1.2z" />
    </svg>
);

export default React.memo(BadgeExperiement);
