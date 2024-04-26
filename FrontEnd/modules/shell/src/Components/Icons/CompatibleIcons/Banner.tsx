import * as React from "react";

const Banner: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0 3)" stroke="#4A4A4A" fill="none" fillRule="evenodd">
                <rect strokeWidth=".971" x=".486" y=".486" width="23.029" height="17.029" rx=".647" />
                <path strokeWidth=".971" d="M16.514 10.486H8.486v4.028h8.028v-4.028z" />
                <path strokeWidth=".98" strokeLinecap="square" d="M7 7.5h10" />
                <path d="M8 5.5h8" />
                <path strokeLinecap="square" d="M11 12.5h3" />
            </g>
        </svg>
    );
};

export default React.memo(Banner);
