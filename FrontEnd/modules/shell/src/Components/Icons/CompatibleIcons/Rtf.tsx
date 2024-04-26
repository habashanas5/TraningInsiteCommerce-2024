import * as React from "react";

const Rtf: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#4A4A4A" fill="none" fillRule="evenodd">
                <path strokeWidth="1.5" d="M3 7.547V5h11.52v2.547M8.5 5v14" />
                <path strokeWidth="1.6" d="M19 3v18" />
                <path strokeWidth="1.5" d="M5 19h7" />
            </g>
        </svg>
    );
};

export default React.memo(Rtf);
