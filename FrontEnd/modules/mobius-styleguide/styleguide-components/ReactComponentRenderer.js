import React from "react";
import get from "lodash/get";
import PropTypes from "prop-types";
import GlobalStyles from "../../mobius/src/GlobalStyle";
import Pathline from "react-styleguidist/lib/client/rsg-components/Pathline";
import Styled from "react-styleguidist/lib/client/rsg-components/Styled";

const styles = ({ /* color,  fontSize, */ space }) => ({
    root: {
        marginBottom: space[6],
    },
    header: {
        // marginBottom: space[3],
    },
    tabs: {
        marginBottom: space[3],
    },
    tabButtons: {
        marginBottom: space[1],
    },
    tabBody: {
        overflowX: "auto",
        maxWidth: "100%",
        WebkitOverflowScrolling: "touch",
    },
    docs: {
        fontSize: 23,
        fontWeight: 300,
        width: "70%",
    },
});

export function ReactComponentRenderer({
    classes,
    name,
    heading,
    pathLine,
    description,
    docs,
    examples,
    tabButtons,
    tabBody,
}) {
    const isSingleExample =
        get(examples, "props.examples.length") === 1 && get(examples, "props.examples[0].type") === "code";
    return (
        <div className={classes.root} id={`${name}-container`}>
            {isSingleExample && <GlobalStyles />}
            <header className={classes.header}>
                {heading}
                {pathLine && <Pathline>{pathLine}</Pathline>}
            </header>
            {(description || docs) && (
                <div className={classes.docs}>
                    {description}
                    {docs}
                </div>
            )}
            {tabButtons && (
                <div className={classes.tabs}>
                    <div className={classes.tabButtons}>{tabButtons}</div>
                    <div className={classes.tabBody}>{tabBody}</div>
                </div>
            )}
            {examples}
        </div>
    );
}

ReactComponentRenderer.propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    heading: PropTypes.node.isRequired,
    filepath: PropTypes.string,
    pathLine: PropTypes.string,
    tabButtons: PropTypes.node,
    tabBody: PropTypes.node,
    description: PropTypes.node,
    docs: PropTypes.node,
    examples: PropTypes.node,
    isolated: PropTypes.bool,
};

export default Styled(styles)(ReactComponentRenderer);
