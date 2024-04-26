import * as React from "react";

const SplitScreen: React.FC<{ size?: number; color1?: string; className?: string }> = ({
    size = 20,
    color1 = "#020202",
    className,
}) => (
    <svg className={className} focusable="false" viewBox="0 0 20 20" width={size} height={size}>
        <path
            fill={color1}
            d="M9 4v14H3c-.6 0-1-.4-1-1V4h7zm9 0v13c0 .6-.4 1-1 1h-6V4h7zm-1-4H3C1.3 0 0 1.3 0 3v14c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z"
        />
    </svg>
);

export default React.memo(SplitScreen);
