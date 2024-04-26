import * as React from "react";

const Functional: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#4A4A4A" fill="none" fillRule="evenodd">
                <path d="M23 1H1v22h22V1z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <g strokeLinecap="round" strokeWidth="1.485">
                    <path d="M14.336 18.374a4.379 4.379 0 01-5.216-.768 4.486 4.486 0 01-1.037-4.647m2.056-2.424a4.38 4.38 0 015.216.77 4.488 4.488 0 011.037 4.646" />
                    <path d="M14.91 14.454l1.782 1.8 1.781-1.8m-8.908 0l-1.782-1.8L6 14.455" />
                </g>
                <path strokeWidth="2" strokeLinecap="square" strokeLinejoin="round" d="M1 6h22" />
            </g>
        </svg>
    );
};

export default React.memo(Functional);
