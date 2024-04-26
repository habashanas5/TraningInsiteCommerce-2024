import * as React from "react";

const Edit: React.FC<{ size?: number; color1?: string; className?: string }> = ({
    size = 17.3,
    color1 = "#9B9B9B",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 17.3 17.3" width={size} height={size}>
        <path
            fill={color1}
            d="M16.3 1C15-.3 13.3-.4 12.2.7L1.3 11.6 0 17.3 5.7 16 16.5 5.1c1.2-1.1 1-2.8-.2-4.1zm-.8.8c.5.6 1 1.5.5 2.2l-2.7-2.7c.7-.5 1.6 0 2.2.5zm-.3 3.1l-.5.5L12 2.6l.5-.5 2.7 2.8zM2 13.6l1.7 1.7-2.2.5.5-2.2zM5.1 15l-2.8-2.7v-.1l8.8-8.8 2.8 2.8L5.1 15z"
        />
    </svg>
);

export default React.memo(Edit);
