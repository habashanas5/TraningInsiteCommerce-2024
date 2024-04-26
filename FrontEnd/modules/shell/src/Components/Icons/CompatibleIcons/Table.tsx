import * as React from "react";

const Table: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#4A4A4A" fill="none" fillRule="evenodd">
                <path d="M1.5 6.5h5v5h-5zm0 5h5v5h-5zm0 5h5v5h-5zm5-10h5v5h-5zm0 5h5v5h-5zm0 5h5v5h-5zm5-10h5v5h-5zm0 5h5v5h-5zm0 5h5v5h-5zm5-10h5v5h-5zm0 5h5v5h-5zm0 5h5v5h-5z" />
                <path
                    d="M20.087 2.59H2.913A1.318 1.318 0 001.59 3.914V5.41h19.818V3.913a1.318 1.318 0 00-1.322-1.322z"
                    strokeWidth="1.181"
                    fill="#4A4A4A"
                />
            </g>
        </svg>
    );
};

export default React.memo(Table);
