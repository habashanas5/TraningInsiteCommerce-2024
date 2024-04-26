import * as React from "react";

const ChevronsUpDown: React.FC = () => {
    return (
        <svg
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="17 8 12 3 7 8"></polyline>
            <polyline points="7 16 12 21 17 16"></polyline>
        </svg>
    );
};

export default React.memo(ChevronsUpDown);
