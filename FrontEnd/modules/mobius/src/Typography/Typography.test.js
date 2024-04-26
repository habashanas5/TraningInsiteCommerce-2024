import baseTheme from "@insite/mobius/globals/baseTheme";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import Typography from "@insite/mobius/Typography/Typography";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { css } from "styled-components";

const themeGenerator = newProps => ({
    ...baseTheme,
    typography: { ...baseTheme.typography, ...newProps },
});

describe("Typography", () => {
    let props;
    let mountedWrapper;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Typography {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    describe("renders appropriate HTML elements", () => {
        test("renders as a span by default", () => {
            const root = wrapper().find(Typography).getDOMNode();
            expect(root instanceof HTMLSpanElement).toBe(true);
        });
        test("renders as a p with variant", () => {
            props = { variant: "p" };
            const root = wrapper().find(Typography).getDOMNode();
            expect(root instanceof HTMLParagraphElement).toBe(true);
        });
        test("renders as a heading with variant", () => {
            props = { variant: "h1" };
            const root = wrapper().find(Typography).getDOMNode();
            expect(root instanceof HTMLHeadingElement).toBe(true);
        });
        test("renders as 'as' prop regardless of variant", () => {
            props = { variant: "h1", as: "li" };
            const root = wrapper().find(Typography).getDOMNode();
            expect(root instanceof HTMLLIElement).toBe(true);
            expect(root instanceof HTMLHeadingElement).toBe(false);
        });
    });

    test("ellipsis styling is applied", () => {
        props = { ellipsis: true };
        const root = wrapper().find(Typography);
        expect(root).toHaveStyleRule("overflow", "hidden");
        expect(root).toHaveStyleRule("text-overflow", "ellipsis");
        expect(root).toHaveStyleRule("white-space", "nowrap");
    });

    describe("applies styling based on props and variant", () => {
        describe("variant without props", () => {
            test("h1", () => {
                props = { variant: "h1" };
                theme = themeGenerator({ h1: { size: "23px" } });
                expect(wrapper().find(Typography)).toHaveStyleRule("font-size", "23px");
            });
            test("h3", () => {
                props = { variant: "h3" };
                theme = themeGenerator({ h3: { lineHeight: "42px", underline: true } });
                const root = wrapper().find(Typography);
                expect(root).toHaveStyleRule("line-height", "42px");
                expect(root).toHaveStyleRule("text-decoration", "underline");
            });
            test("h6", () => {
                props = { variant: "h6" };
                theme = themeGenerator({
                    h6: {
                        fontFamily: "fantasy,comic-sans",
                        css: css`
                            margin-bottom: 15px;
                            display: block;
                        `,
                    },
                });
                const root = wrapper().find(Typography);
                expect(root).toHaveStyleRule("font-family", "fantasy,comic-sans");
                expect(root).toHaveStyleRule("margin-bottom", "15px");
                expect(root).toHaveStyleRule("display", "block");
            });
        });
        describe("props wihtout variant", () => {
            test("lineHeight", () => {
                props = { lineHeight: "1.2" };
                expect(wrapper().find(Typography)).toHaveStyleRule("line-height", "1.2");
            });
            test("size", () => {
                props = { size: 43 };
                expect(wrapper().find(Typography)).toHaveStyleRule("font-size", "43px");
            });
            test("underline", () => {
                props = { underline: true };
                expect(wrapper().find(Typography)).toHaveStyleRule("text-decoration", "underline");
            });
            test("fontFamily", () => {
                props = { fontFamily: "monospace,Times" };
                expect(wrapper().find(Typography)).toHaveStyleRule("font-family", "monospace,Times");
            });
            test("css", () => {
                props = {
                    css: css`
                        margin-top: 0.5em;
                        display: inline-block;
                    `,
                };
                const root = wrapper().find(Typography);
                expect(root).toHaveStyleRule("margin-top", "0.5em");
                expect(root).toHaveStyleRule("display", "inline-block");
            });
        });
        describe("props with variant", () => {
            test("h2 with color", () => {
                props = { variant: "h2", color: "rebeccapurple", fontFamily: "serif" };
                theme = themeGenerator({ h2: { color: "azure", size: "1.4rem" } });
                const root = wrapper().find(Typography);
                expect(root).toHaveStyleRule("font-size", "1.4rem");
                expect(root).not.toHaveStyleRule("color", "azure");
                expect(root).toHaveStyleRule("color", "rebeccapurple");
                expect(root).toHaveStyleRule("font-family", "serif");
            });
            test("h4 with italic", () => {
                props = { variant: "h4", italic: true, lineHeight: "1.2" };
                theme = themeGenerator({ h4: { color: "azure", italic: false } });
                const root = wrapper().find(Typography);
                expect(root).toHaveStyleRule("color", "azure");
                expect(root).toHaveStyleRule("line-height", "1.2");
                expect(root).toHaveStyleRule("font-style", "italic");
            });
            test("h5 with weight and transform", () => {
                props = { variant: "h5", weight: 500, transform: "uppercase" };
                theme = themeGenerator({ h5: { weight: "800", size: 33, transform: "capitalize" } });
                const root = wrapper().find(Typography);
                expect(root).toHaveStyleRule("font-weight", "500");
                expect(root).not.toHaveStyleRule("font-weight", "800");
                expect(root).toHaveStyleRule("text-transform", "uppercase");
                expect(root).not.toHaveStyleRule("text-transform", "capitalize");
                expect(root).toHaveStyleRule("font-size", "33px");
            });
            test("merges instance and variant css by default", () => {
                props = {
                    variant: "p",
                    css: css`
                        font-size: 24px;
                    `,
                };
                theme = themeGenerator({
                    p: {
                        css: css`
                            color: blue;
                        `,
                    },
                });
                const root = wrapper().find(Typography);
                expect(root).toHaveStyleRule("color", "blue");
                expect(root).toHaveStyleRule("font-size", "24px");
            });
            test("instance css overrides variant css when mergeCss is false", () => {
                props = {
                    variant: "p",
                    css: css`
                        font-size: 24px;
                    `,
                    // This one is a bit odd. By default, Typography already
                    // merges the prop and variant css and in the proper cascading
                    // order. You need to explicitly pass false to make the
                    // css prop act like an override.
                    mergeCss: false,
                };
                theme = themeGenerator({
                    p: {
                        css: css`
                            color: blue;
                        `,
                    },
                });
                const root = wrapper().find(Typography);
                expect(root).not.toHaveStyleRule("color", "blue");
                expect(root).toHaveStyleRule("font-size", "24px");
            });
            test("instance css overrides variant css when mergeCss is false, even if variant mergeCss is true", () => {
                props = {
                    variant: "p",
                    css: css`
                        font-size: 24px;
                    `,
                    mergeCss: false,
                };
                theme = themeGenerator({
                    p: {
                        css: css`
                            color: blue;
                        `,
                        mergeCss: true,
                    },
                });
                const root = wrapper().find(Typography);
                expect(root).not.toHaveStyleRule("color", "blue");
                expect(root).toHaveStyleRule("font-size", "24px");
            });
        });
    });
});

describe("Multiple Typographys", () => {
    let typography1Props;
    let typography2Props;
    let mountedWrapper;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Typography id="typography1" {...typography1Props} />
                    <Typography id="typography2" {...typography2Props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        typography1Props = {};
        typography2Props = {};
        mountedWrapper = undefined;
    });

    describe("applies styling based on props and variant", () => {
        describe("props with variant", () => {
            test("merges instance and variant css for all instances when variant mergeCss is true", () => {
                typography1Props = {
                    variant: "p",
                    css: css`
                        font-size: 24px;
                    `,
                };
                typography2Props = {
                    variant: "p",
                    css: css`
                        font-size: 13px;
                    `,
                };
                theme = themeGenerator({
                    p: {
                        css: css`
                            color: blue;
                        `,
                        mergeCss: true,
                    },
                });
                const typography1 = wrapper().find("#typography1");
                const typography2 = wrapper().find("#typography2");
                expect(typography1).toHaveStyleRule("font-size", "24px");
                expect(typography1).toHaveStyleRule("color", "blue");
                expect(typography2).toHaveStyleRule("font-size", "13px");
                expect(typography2).toHaveStyleRule("color", "blue");
            });
        });
    });
});
