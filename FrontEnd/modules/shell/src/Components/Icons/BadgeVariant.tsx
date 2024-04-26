import * as React from "react";

const BadgeVariant: React.FC<{ size?: number; color1?: string; color2?: string; className?: string }> = ({
    size = 16,
    color1 = "#4A4A4A",
    color2 = "#FFF",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 16 16" width={size} height={size}>
        <path fill={color1} d="M12 0H4C1.8 0 0 1.8 0 4v8c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4z" />
        <path fill={color2} d="M9.8 4.2h1.8L8.9 12H7.2L4.5 4.2h1.8l1.8 5.9 1.7-5.9z" />
    </svg>
);

export default React.memo(BadgeVariant);
