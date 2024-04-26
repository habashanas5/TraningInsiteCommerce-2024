import React from "react";
import PropTypes from "prop-types";
import Styled from "react-styleguidist/lib/client/rsg-components/Styled";

const styles = ({
    space,
    color,
    fontFamily,
    fontSize, // , borderRadius
}) => ({
    root: {
        fontFamily: fontFamily.base,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
    },
    search: {
        padding: space[2],
        background: "#ebebeb",
        width: "100%",
        height: "96px",
    },
    input: {
        display: "block",
        width: "100%",
        height: "36px",
        lineHeight: "36px",
        color: color.base,
        backgroundColor: color.baseBackground,
        fontFamily: fontFamily.base,
        fontSize: fontSize.base,
        borderRadius: 18,
        padding: "0 16px",
        transition: "all ease-in-out .1s",
        "&:focus": {
            isolate: false,
            borderColor: color.link,
            boxShadow: [[0, 0, 0, 2, color.focus]],
            outline: 0,
        },
        "&::placeholder": {
            isolate: false,
            fontFamily: fontFamily.base,
            fontSize: fontSize.base,
            color: color.light,
        },
    },
    nav: {
        padding: [[0, space[2], space[2]]],
        flexGrow: 1,
        overflowY: "auto",
    },
});

export function TableOfContentsRenderer({ classes, children, searchTerm, onSearchTermChange }) {
    return (
        <>
            <div className={classes.root}>
                <nav className={classes.nav}>{children}</nav>
                <div className={classes.search}>
                    <input
                        value={searchTerm}
                        className={classes.input}
                        placeholder="Search"
                        aria-label="Search"
                        onChange={event => onSearchTermChange(event.target.value)}
                    />
                </div>
            </div>
        </>
    );
}

TableOfContentsRenderer.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    searchTerm: PropTypes.string.isRequired,
    onSearchTermChange: PropTypes.func.isRequired,
};

export default Styled(styles)(TableOfContentsRenderer);
