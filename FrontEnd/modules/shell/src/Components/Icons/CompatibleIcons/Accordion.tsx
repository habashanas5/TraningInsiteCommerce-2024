import * as React from "react";

const Accordion: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <path id="a" d="M0 0h24v4H0z" />
                <path id="b" d="M0 6h24v4H0z" />
                <path id="c" d="M0 16h24v4H0z" />
            </defs>
            <g transform="translate(0 2)" fill="none" fillRule="evenodd">
                <use fill="#4A4A4A" fillRule="nonzero" href="#a" />
                <use fill="#4A4A4A" fillRule="nonzero" href="#b" />
                <use fill="#4A4A4A" fillRule="nonzero" href="#c" />
                <path stroke="#4A4A4A" d="M.5 9.5h23v4H.5z" />
            </g>
        </svg>
    );
};

export default React.memo(Accordion);
