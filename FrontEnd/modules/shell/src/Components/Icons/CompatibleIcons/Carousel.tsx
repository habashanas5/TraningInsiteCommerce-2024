import * as React from "react";

const Carousel: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <path id="a" d="M19.602 6.227h3.92v5.88h-3.92z" />
                <path id="b" d="M0 6.227h3.92v5.88H0z" />
            </defs>
            <g transform="translate(0 3)" fill="none" fillRule="evenodd">
                <rect stroke="#4A4A4A" strokeWidth=".971" x=".486" y=".486" width="23.029" height="17.029" rx=".647" />
                <use fill="#4A4A4A" fillRule="nonzero" href="#a" />
                <path stroke="#FFF" strokeWidth=".653" strokeLinecap="round" d="M21.562 8.187l1.144.98-1.144.98" />
                <use fill="#4A4A4A" fillRule="nonzero" transform="matrix(-1 0 0 1 3.92 0)" href="#b" />
                <path stroke="#FFF" strokeWidth=".653" strokeLinecap="round" d="M2.45 8.187l-1.143.98 1.143.98" />
                <path stroke="#4A4A4A" strokeWidth=".98" d="M15.51 10.49H8.49v3.02h7.02v-3.02z" />
                <path stroke="#4A4A4A" strokeWidth=".98" strokeLinecap="square" d="M7 7.5h10" />
                <path stroke="#4A4A4A" d="M8 5.5h8" />
            </g>
        </svg>
    );
};

export default React.memo(Carousel);
