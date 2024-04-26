import * as React from "react";

const NavigationList: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <g transform="translate(0 3)">
                    <circle fill="#4A4A4A" cx="1.664" cy="1.664" r="1.664" />
                    <circle fill="#4A4A4A" cx="1.664" cy="9.152" r="1.664" />
                    <circle fill="#4A4A4A" cx="1.664" cy="16.664" r="1.664" />
                    <path stroke="#4A4A4A" strokeWidth="2" strokeLinejoin="round" d="M8 2h16" />
                </g>
                <path stroke="#4A4A4A" strokeWidth="2" strokeLinejoin="round" d="M8 12h16M8 19.5h16" />
            </g>
        </svg>
    );
};

export default React.memo(NavigationList);
