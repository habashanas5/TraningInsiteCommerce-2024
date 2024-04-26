import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import baseTheme from "../globals/baseTheme";
import ThemeProvider from "../ThemeProvider";
import Tag from "./Tag";
import Icon from "../Icon";
import Button from "../Button";
import { css } from "styled-components";

describe("Tag", () => {
    let props;
    let theme = baseTheme;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Tag {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    const withProps = () => {
        props = {};
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
            ...theme,
            tag: {
                defaultProps: {},
            },
        };
        const builder = {
            withCssBgColor(color) {
                theme.tag.defaultProps.css = css`
                    background-color: ${color};
                `;
                return this;
            },
            withMergeCss(isMergeCss) {
                theme.tag.defaultProps.mergeCss = isMergeCss;
                return this;
            },
        };

        return builder;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = null;
    });

    test("text is displayed", () => {
        const innerText = "Hello everyone";
        props = {
            children: innerText,
        };
        expect(wrapper().find(Tag).getDOMNode().innerHTML).toContain(innerText);
    });

    test("does not display an x when deletable=false", () => {
        props = {
            children: "hi",
            deletable: false,
        };
        expect(wrapper().find(Icon)).toHaveLength(0);
    });

    describe("behavior", () => {
        test("onDelete called when x is clicked", () => {
            const fn = jest.fn();
            props = {
                children: "hi",
                onDelete: fn,
            };
            const root = wrapper();
            root.find(Button).simulate("click");
            expect(fn).toHaveBeenCalled();
        });

        test("onDelete not called when x is clicked if disabled", () => {
            const fn = jest.fn();
            props = {
                children: "hi",
                onDelete: fn,
                disabled: true,
            };
            const root = wrapper();
            root.find(Icon).simulate("click");
            expect(fn).not.toHaveBeenCalled();
        });
    });
    describe("Merge Css", () => {
        test("No Css Merge when not specified", () => {
            withProps().withCssColor("red");
            withTheme().withCssBgColor("red");

            expect(wrapper().find(Tag)).toHaveStyleRule("color", "red");
            expect(wrapper().find(Tag)).toHaveStyleRule("background-color", undefined);
        });
        test("Merges Css when component specifies", () => {
            withProps().withCssColor("red").withMergeCss(true);
            withTheme().withCssBgColor("red");

            expect(wrapper().find(Tag)).toHaveStyleRule("color", "red");
            expect(wrapper().find(Tag)).toHaveStyleRule("background-color", "red");
        });
        test("Merges Css when theme specifies", () => {
            withProps().withCssColor("red");
            withTheme().withCssBgColor("red").withMergeCss(true);

            expect(wrapper().find(Tag)).toHaveStyleRule("color", "red");
            expect(wrapper().find(Tag)).toHaveStyleRule("background-color", "red");
        });
        test("Does not merge Css when component specifies", () => {
            withProps().withCssColor("red").withMergeCss(false);
            withTheme().withCssBgColor("red").withMergeCss(true);

            expect(wrapper().find(Tag)).toHaveStyleRule("color", "red");
            expect(wrapper().find(Tag)).toHaveStyleRule("background-color", undefined);
        });
    });
});
