import * as React from "react";

const Checkbox: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <g transform="translate(0 7)">
                    <rect fill="#4A4A4A" width="10" height="10" rx="2.2" />
                    <path
                        d="M7.139 3.857L4.45 6.695 2.84 4.996a.34.34 0 010-.462.298.298 0 01.438 0L4.45 5.772l2.251-2.376a.298.298 0 01.438 0 .34.34 0 010 .461"
                        fill="#FFF"
                    />
                </g>
                <path stroke="#4A4A4A" strokeWidth="2" strokeLinejoin="round" d="M13 12h11" />
            </g>
        </svg>
    );
};

export default React.memo(Checkbox);
