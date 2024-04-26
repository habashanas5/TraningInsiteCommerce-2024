import * as React from "react";

const FormField: React.FC = () => {
    return (
        <svg focusable="false" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#4A4A4A" fill="none" fillRule="evenodd" strokeLinecap="round">
                <path d="M23.5 6.5H.5v10h23v-10z" />
                <path
                    d="M16 3a1.97 1.97 0 011.969 1.969v13.45A1.97 1.97 0 0116 20.388m1.968-1.97a1.97 1.97 0 001.97 1.97m0-17.388a1.97 1.97 0 00-1.97 1.969"
                    strokeWidth="1.512"
                />
            </g>
        </svg>
    );
};

export default React.memo(FormField);
