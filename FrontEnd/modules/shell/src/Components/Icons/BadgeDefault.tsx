import * as React from "react";

const BadgeDefault: React.FC<{ size?: number; color1?: string; color2?: string; className?: string }> = ({
    size = 16,
    color1 = "#4A4A4A",
    color2 = "#FFF",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 16 16" width={size} height={size}>
        <path fill={color1} d="M4 0h8c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V4c0-2.2 1.8-4 4-4z" />
        <path
            fill={color2}
            d="M7 4.1H5v8h2c.9.1 4.7 0 4.7-4s-3.8-4-4.7-4zm0 6.5v-5s3.1-.4 3.1 2.5c0 2.8-3.1 2.5-3.1 2.5z"
        />
    </svg>
);

export default React.memo(BadgeDefault);
