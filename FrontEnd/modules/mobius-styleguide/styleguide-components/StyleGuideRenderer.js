import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import Markdown from "react-styleguidist/lib/client/rsg-components/Markdown";
import Styled from "react-styleguidist/lib/client/rsg-components/Styled";
import Ribbon from "react-styleguidist/lib/client/rsg-components/Ribbon";
import Version from "react-styleguidist/lib/client/rsg-components/Version";
import Logo from "./Logo";

const styles = ({ color, fontFamily, fontSize, sidebarWidth, mq, space, maxWidth }) => ({
    root: {
        minHeight: "100vh",
        backgroundColor: color.baseBackground,
    },
    hasSidebar: {
        paddingLeft: sidebarWidth,
        [mq.small]: {
            paddingLeft: 0,
        },
    },
    content: {
        maxWidth,
        padding: [[space[2], space[4]]],
        margin: [[0, "auto"]],
        [mq.small]: {
            padding: space[2],
        },
        display: "block",
    },
    sidebar: {
        backgroundColor: color.sidebarBackground,
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: sidebarWidth,
        height: "100%",
        WebkitOverflowScrolling: "touch",
        display: "flex",
        flexDirection: "column",
        [mq.small]: {
            position: "static",
            width: "auto",
            borderWidth: [[1, 0, 0, 0]],
            paddingBottom: space[0],
        },
    },
    logo: {
        padding: [[space[5], space[4], space[3]]],
        flexGrow: 0,
        flexShrink: 1,
        height: "120px",
    },
    footer: {
        display: "block",
        color: color.light,
        fontFamily: fontFamily.base,
        fontSize: fontSize.small,
    },
});

export function StyleGuideRenderer({ classes, title, version, homepageUrl, children, toc, hasSidebar }) {
    return (
        <div className={cx(classes.root, hasSidebar && classes.hasSidebar)}>
            <main className={classes.content}>
                {children}
                <footer className={classes.Footer}>
                    <Markdown text={`Created with [React Styleguidist](${homepageUrl})`} />
                </footer>
            </main>
            {hasSidebar && (
                <div className={classes.sidebar}>
                    <div className={classes.logo}>
                        <Logo>{title}</Logo>
                        {version && <Version>{version}</Version>}
                    </div>
                    {toc}
                </div>
            )}
            <Ribbon />
        </div>
    );
}

StyleGuideRenderer.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    version: PropTypes.string,
    homepageUrl: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    toc: PropTypes.node.isRequired,
    hasSidebar: PropTypes.bool,
};

export default Styled(styles)(StyleGuideRenderer);
