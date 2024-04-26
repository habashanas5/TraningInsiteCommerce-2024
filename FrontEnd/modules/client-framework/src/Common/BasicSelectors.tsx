import LazyImage from "@insite/mobius/LazyImage";
import Link from "@insite/mobius/Link";
import ListItem, { OrderedList, UnorderedList } from "@insite/mobius/Lists";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { domToReact, HTMLReactParserOptions } from "html-react-parser";
import * as React from "react";

export const parserOptions: HTMLReactParserOptions = {
    replace: node => {
        const { name, children, attribs = { style: "" }, ...rest } = node;
        const { style, class: className, ...otherAttribs } = attribs;

        otherAttribs.className = className;

        if (name && ["h1", "h2", "h3", "h4", "h5", "h6", "body", "p", "legend"].includes(name) && children) {
            return (
                <Typography css={style as any} {...otherAttribs} variant={name as TypographyProps["variant"]}>
                    {children && domToReact(children, parserOptions)}
                </Typography>
            );
        }
        if (name === "ul") {
            return (
                <UnorderedList css={style as any} {...otherAttribs}>
                    {children && domToReact(children, parserOptions)}
                </UnorderedList>
            );
        }
        if (name === "ol") {
            return (
                <OrderedList css={style as any} {...otherAttribs}>
                    {children && domToReact(children, parserOptions)}
                </OrderedList>
            );
        }
        if (name === "li") {
            return (
                <ListItem css={style as any} {...otherAttribs}>
                    {children && domToReact(children, parserOptions)}
                </ListItem>
            );
        }
        if (name === "img") {
            return <LazyImage as="span" css={style as any} {...otherAttribs} />;
        }
        if (name === "a") {
            return (
                <Link css={style as any} id={otherAttribs.name} {...otherAttribs}>
                    {children && domToReact(children, parserOptions)}
                </Link>
            );
        }
    },
};

export function getFocalPointStyles(
    focalPoint:
        | "topLeft"
        | "topCenter"
        | "topRight"
        | "centerLeft"
        | "center"
        | "centerRight"
        | "bottomLeft"
        | "bottomCenter"
        | "bottomRight",
) {
    let focalPointStyles;
    switch (focalPoint) {
        case "topLeft":
            focalPointStyles = "background-position: left top;";
            break;
        case "topCenter":
            focalPointStyles = "background-position: center top;";
            break;
        case "topRight":
            focalPointStyles = "background-position: right top;";
            break;
        case "centerLeft":
            focalPointStyles = "background-position: left center;";
            break;
        case "center":
            focalPointStyles = "background-position: center center;";
            break;
        case "centerRight":
            focalPointStyles = "background-position: right center;";
            break;
        case "bottomLeft":
            focalPointStyles = "background-position: left bottom;";
            break;
        case "bottomCenter":
            focalPointStyles = "background-position: center bottom;";
            break;
        case "bottomRight":
            focalPointStyles = "background-position: right bottom;";
            break;
    }

    return focalPointStyles;
}
