import * as React from "react";

const LinkList: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <path
                    d="M16 0a2 2 0 011.995 1.85L18 2v7h-2V2H2v14h7.5v2H2a2 2 0 01-1.995-1.85L0 16V2A2 2 0 011.85.005L2 0h14z"
                    fill="#4A4A4A"
                    fillRule="nonzero"
                />
                <circle fill="#4A4A4A" cx="4.8" cy="5.2" r="1.2" />
                <circle fill="#4A4A4A" cx="4.8" cy="8.8" r="1.2" />
                <circle fill="#4A4A4A" cx="4.8" cy="12.4" r="1.2" />
                <path
                    stroke="#4A4A4A"
                    strokeWidth="1.2"
                    strokeLinecap="square"
                    d="M8.4 5.2H12m-3.6 7.2H12M8.4 8.8H12"
                />
                <path
                    d="M16.2 16.6a3 3 0 004.524.324l1.8-1.8a3 3 0 00-4.242-4.242l-1.032 1.026"
                    stroke="#4A4A4A"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M18.6 15.4a3 3 0 00-4.524-.324l-1.8 1.8a3 3 0 004.242 4.242l1.026-1.026"
                    stroke="#4A4A4A"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
};

export default React.memo(LinkList);
