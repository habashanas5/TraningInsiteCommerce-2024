import "babel-polyfill";
import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Icon from "./Icon";
import Activity from "../Icons/Activity";
import baseTheme from "../globals/baseTheme";
import { css } from "styled-components";

describe("Icon", () => {
    let props;
    let mountedWrapper;
    let theme = {};
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Icon {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    const withProps = () => {
        props = {
            src: "Trash",
        };
        const builder = {
            withCssColor(color) {
                props.css = css`
                    color: ${color};
                `;
                return this;
            },

            withMergeCss(isMergeCss) {
                props.mergeCss = isMergeCss;
                return this;
            },
        };
        return builder;
    };

    const withTheme = () => {
        theme = {
            ...baseTheme,
        };
        const builder = {
            withCssBgColor(bgColor) {
                theme.icon.defaultProps.css = css`
                    background-color: ${bgColor};
                `;
                return this;
            },
            withMergeCss(isMergeCss) {
                theme.icon.defaultProps.mergeCss = isMergeCss;
                return this;
            },
        };
        return builder;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("returns null if src is falsey", () => {
        const root = wrapper().find(Icon).getDOMNode();
        expect(root).toBeNull();
    });

    test("returns a span if a component is passed into src", () => {
        props = { src: Activity };
        const root = wrapper().find(Icon).getDOMNode();
        expect(root instanceof HTMLSpanElement).toBe(true);
    });

    test("returns a span if a url is passed into src", () => {
        props = { src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" };
        const root = wrapper().find(Icon).getDOMNode();
        expect(root instanceof HTMLSpanElement).toBe(true);
    });

    describe("Merge Css", () => {
        test("No merge if not specified", () => {
            withProps().withCssColor("red").withMergeCss(false);
            withTheme().withCssBgColor("violet").withMergeCss(false);

            expect(wrapper().find(Icon)).toHaveStyleRule("color", "red");
            expect(wrapper().find(Icon)).toHaveStyleRule("background-color", undefined);
        });

        test("No merge if component does not specify", () => {
            withProps().withCssColor("red").withMergeCss(false);
            withTheme().withCssBgColor("violet").withMergeCss(true);

            expect(wrapper().find(Icon)).toHaveStyleRule("color", "red");
            expect(wrapper().find(Icon)).toHaveStyleRule("background-color", undefined);
        });
        test("Merge when theme says so", () => {
            withProps().withCssColor("red");
            withTheme().withCssBgColor("violet").withMergeCss(true);

            expect(wrapper().find(Icon)).toHaveStyleRule("color", "red");
            expect(wrapper().find(Icon)).toHaveStyleRule("background-color", "violet");
        });
        test("Merge if component says so", () => {
            withProps().withCssColor("red").withMergeCss(true);
            withTheme().withCssBgColor("violet").withMergeCss(false);

            expect(wrapper().find(Icon)).toHaveStyleRule("color", "red");
            expect(wrapper().find(Icon)).toHaveStyleRule("background-color", "violet");
        });
    });
});
