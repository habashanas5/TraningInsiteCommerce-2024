import { object } from "prop-types";
import React from "react";
import Styled from "react-styleguidist/lib/client/rsg-components/Styled";

const styles = () => ({
    logo: {
        lineHeight: 0,
    },
});

const Logo = ({ classes }) => (
    <div className={classes.logo}>
        <svg width="64" height="32" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#202020" strokeWidth="4" fill="none" fillRule="evenodd" strokeLinecap="round">
                <path d="M48.006 2.023c7.732 0 14 6.27 14 14 0 7.731-6.268 14-14 14M16 30.023c-7.732 0-14-6.268-14-14 0-7.73 6.268-14 14-14M16 30.023c16 0 16.011-28 32.006-28M37.121 24.025C39.894 27.515 43.241 30 48.006 30M16 2c4.789 0 8.146 2.509 10.927 6.024" />
            </g>
        </svg>
    </div>
);

Logo.propTypes = {
    classes: object,
};

export default Styled(styles)(Logo);
