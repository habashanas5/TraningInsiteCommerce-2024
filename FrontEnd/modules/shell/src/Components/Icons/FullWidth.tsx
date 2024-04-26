import * as React from "react";

const FullWidth: React.FC<{ size?: number; color1?: string; className?: string }> = ({
    size = 20,
    color1 = "#020202",
    className,
}) => (
    <svg className={className} focusable="false" viewBox="0 0 20 20" width={size} height={size}>
        <path d="M2 4h16v13c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V4zm15-4H3C1.3 0 0 1.3 0 3v14c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z" />
        <path
            fill={color1}
            d="M15.9 5.6c-.1-.2-.3-.4-.5-.5-.1-.1-.3-.1-.4-.1H9c-.6 0-1 .4-1 1s.4 1 1 1h3.6l-1.3 1.3-4 4L6 13.6V10c0-.6-.4-1-1-1s-1 .4-1 1v6c0 .1 0 .3.1.4.1.2.3.4.5.5.1.1.3.1.4.1h6c.6 0 1-.4 1-1s-.4-1-1-1H7.4l1.3-1.3 4-4L14 8.4V12c0 .6.4 1 1 1s1-.4 1-1V6c0-.1 0-.3-.1-.4z"
        />
    </svg>
);

export default React.memo(FullWidth);
