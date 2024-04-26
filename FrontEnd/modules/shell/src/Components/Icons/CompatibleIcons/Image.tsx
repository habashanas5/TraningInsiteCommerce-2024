import * as React from "react";

const Image: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#4A4A4A" fill="none" fillRule="evenodd">
                <rect strokeWidth="1.5" x=".75" y=".75" width="22.5" height="22.5" rx="1" />
                <circle strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" cx="7.6" cy="7.6" r="1.8" />
                <path strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" d="M22.6 15.4l-6-6L3.4 22.6" />
            </g>
        </svg>
    );
};

export default React.memo(Image);
