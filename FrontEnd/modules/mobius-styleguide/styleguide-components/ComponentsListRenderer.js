import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import Link from "react-styleguidist/lib/client/rsg-components/Link";
import Styled from "react-styleguidist/lib/client/rsg-components/Styled";
import { getHash } from "react-styleguidist/lib/client/utils/handleHash";

const styles = ({
    color,
    fontFamily,
    fontSize, // space, mq
}) => ({
    list: {
        margin: 0,
    },
    item: {
        color: color.base,
        display: "block",
        fontFamily: fontFamily.base,
        fontSize: fontSize.base,
        fontWeight: 300,
        listStyle: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
        borderRadius: 8,
        "& a": {
            padding: "5px 16px !important",
            display: "inline-block",
            width: "100% !important",
            "&:hover, &:focus, &:active": {
                background: "#e5e5e5",
                cursor: "pointer",
                outline: "0 !important",
            },
        },
    },
    isChild: {
        margin: 0,
        // [mq.small]: {
        //     display: 'inline-block',
        //     margin: [[0, space[1], 0, 0]],
        // },
    },
    heading: {
        color: color.base,
        marginTop: "16px !important",
        fontFamily: fontFamily.base,
        fontWeight: "bold !important",
        padding: "4px 16px !important",
        borderRadius: "8px !important",
    },
    isSelected: {
        fontWeight: "bold",
    },
    link: {
        "&, &:link, &:visited": {
            color: "#4a4a4a",
        },
        "&:hover, &:active": {
            color: color.linkHover,
        },
    },
});

export function ComponentsListRenderer({ classes, items: itemsProp }) {
    const items = itemsProp.filter(item => item.visibleName);

    if (!items.length) {
        return null;
    }

    const windowHash = window.location.pathname + getHash(window.location.hash);
    return (
        <ul className={classes.list}>
            {items.map(({ heading, visibleName, href, content, external }) => {
                const isItemSelected = windowHash === href;
                return (
                    <li
                        className={cx(
                            classes.item,
                            (!content || !content.props.items.length) && classes.isChild,
                            isItemSelected && classes.isSelected,
                        )}
                        key={href}
                    >
                        <Link
                            className={cx(heading && classes.heading, classes.link)}
                            href={href}
                            target={external ? "_blank" : undefined}
                        >
                            {visibleName}
                        </Link>
                        {content}
                    </li>
                );
            })}
        </ul>
    );
}

ComponentsListRenderer.propTypes = {
    items: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
};

export default Styled(styles)(ComponentsListRenderer);
