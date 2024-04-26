import * as React from "react";

const Row: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M21 10H3a1 1 0 010-2h18a1 1 0 110 2m0 6H3a1 1 0 110-2h18a1 1 0 110 2"
                fill="#4A4A4A"
                fillRule="evenodd"
            />
        </svg>
    );
};

export default React.memo(Row);
