import * as React from "react";

const Search: React.FC<{ size?: number; color1?: string; className?: string }> = ({
    size = 19.1,
    color1 = "#9B9B9B",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 19.1 19.1" width={size} height={size}>
        <path
            fill={color1}
            d="M18.8 17.4l-6.2-6.2C13.5 10 14 8.6 14 7c0-3.9-3.1-7-7-7S0 3.1 0 7s3.1 7 7 7c1.6 0 3-.5 4.2-1.4l6.2 6.2c.2.2.4.3.7.3.6 0 1-.4 1-1 0-.3-.1-.5-.3-.7zM7 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
        />
    </svg>
);

export default React.memo(Search);
