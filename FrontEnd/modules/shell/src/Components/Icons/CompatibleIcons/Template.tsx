import * as React from "react";

const Template: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(2 1)" fill="none" fillRule="evenodd">
                <path stroke="#4A4A4A" strokeWidth="1.455" d="M9.942 19.643H0V0h8.73l5.82 5.82v4.366" />
                <path stroke="#4A4A4A" strokeWidth="1.455" d="M8.73 0v5.82h5.82" />
                <path
                    fill="#4A4A4A"
                    d="M2.183 4.365h4.365V5.82H2.183zm0 3.638h9.458v1.455H2.183zm0 3.637h8.003v1.455H2.183zm0 3.638h6.548v1.455H2.183z"
                />
                <circle
                    stroke="#4A4A4A"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    cx="14.732"
                    cy="16.187"
                    r="6.002"
                />
                <path
                    stroke="#4A4A4A"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.732 13.786v4.802m-2.401-2.401h4.802"
                />
            </g>
        </svg>
    );
};

export default React.memo(Template);
