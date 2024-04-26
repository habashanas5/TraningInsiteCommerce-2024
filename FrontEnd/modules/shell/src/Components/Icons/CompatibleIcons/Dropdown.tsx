import * as React from "react";

const Dropdown: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <path d="M23.5 8.98H.5v7h23v-7z" stroke="#4A4A4A" strokeLinecap="round" />
                <path fill="#4A4A4A" d="M17 9h7v7h-7z" />
                <path
                    stroke="#FFF"
                    strokeWidth=".64"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 12l1.92 1.92L22.84 12"
                />
            </g>
        </svg>
    );
};

export default React.memo(Dropdown);
