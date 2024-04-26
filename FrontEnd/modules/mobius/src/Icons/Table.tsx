import * as React from "react";

const Grid: React.FC = () => {
    return (
        <svg
            version="1.1"
            id="table"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="7" y1="19" x2="7" y2="1" />
            <line x1="12.8" y1="19" x2="12.8" y2="1" />
            <g>
                <path d="M19,17V3c0-1.1-0.9-2-2-2H3C1.9,1,1,1.9,1,3v14c0,1.1,0.9,2,2,2l14,0C18.1,19,19,18.1,19,17z" />
            </g>
        </svg>
    );
};

export default React.memo(Grid);
