import * as React from "react";

const X: React.FC<{ size?: number; color1?: string; className?: string }> = ({
    size = 20,
    color1 = "#231f20",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 20 20" width={size} height={size}>
        <path
            d="M19.6 17.6c.6.6.6 1.4 0 2-.3.3-.6.4-1 .4s-.7-.1-1-.4L10 12l-7.6 7.6c-.3.3-.6.4-1 .4s-.7-.1-1-.4c-.6-.6-.6-1.4 0-2L8 10 .4 2.4c-.6-.6-.6-1.4 0-2 .6-.6 1.4-.6 2 0L10 8 17.6.4c.6-.6 1.4-.6 2 0 .6.6.6 1.4 0 2L12 10l7.6 7.6z"
            fill={color1}
        />
    </svg>
);

export default React.memo(X);
