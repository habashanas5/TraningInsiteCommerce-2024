import * as React from "react";

const PageTitle: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <path
                    d="M4 4h16v4H4zm0 6h6v2H4zm0 4h6v2H4zm0 4h6v2H4zm16-8v2h-.001v6H20v2h-8V10h8zm-2.001 8v-6H14v6h3.999z"
                    fill="#4A4A4A"
                />
                <path
                    d="M23 1H1v22h22V1z"
                    stroke="#4A4A4A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
};

export default React.memo(PageTitle);
