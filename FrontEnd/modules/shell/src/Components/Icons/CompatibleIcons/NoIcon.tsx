import * as React from "react";

const NoIcon: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd" strokeLinejoin="round" stroke="#4A4A4A">
                <g strokeWidth="2">
                    <path d="M23 1H1v22h22V1z" strokeLinecap="round" />
                    <path strokeLinecap="square" d="M1 6h22" />
                </g>
                <path
                    d="M10 12.356a2.029 2.029 0 013.942.676c0 1.352-2.028 2.028-2.028 2.028m.054 2.705h.007"
                    strokeLinecap="round"
                    strokeWidth="1.352"
                />
            </g>
        </svg>
    );
};

export default React.memo(NoIcon);
