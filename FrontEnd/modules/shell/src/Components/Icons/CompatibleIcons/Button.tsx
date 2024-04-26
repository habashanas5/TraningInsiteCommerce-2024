import * as React from "react";

const Button: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0 6)" stroke="#4A4A4A" fill="none" fillRule="evenodd">
                <rect strokeWidth=".971" x=".486" y=".486" width="23.029" height="11.029" rx=".647" />
                <path strokeWidth="1.333" strokeLinecap="square" d="M5 6.5h14" />
            </g>
        </svg>
    );
};

export default React.memo(Button);
