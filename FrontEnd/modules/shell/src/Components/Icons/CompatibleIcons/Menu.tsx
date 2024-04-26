import * as React from "react";

const Menu: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2 12.222h20M2 5.556h20M2 18.889h20"
                stroke="#4A4A4A"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default React.memo(Menu);
