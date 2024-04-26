import * as React from "react";

const Add: React.FC<{ size?: number; color1?: string; color2?: string; className?: string }> = ({
    size = 19,
    color1 = "#4A4A4A",
    color2 = "#FFF",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 19 19" width={size} height={size}>
        <circle fill={color1} cx="9.5" cy="9.5" r="9.5" />
        <path
            fill={color2}
            d="M15.5 9H10V3.5c0-.3-.2-.5-.5-.5s-.5.2-.5.5V9H3.5c-.3 0-.5.2-.5.5s.2.5.5.5H9v5.5c0 .3.2.5.5.5s.5-.2.5-.5V10h5.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5z"
        />
    </svg>
);

export default React.memo(Add);
