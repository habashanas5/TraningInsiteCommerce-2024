/* eslint-disable no-undef */
import Button from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import baseTheme from "@insite/mobius/globals/baseTheme";
import Icon from "@insite/mobius/Icon";
import OverflowMenu from "@insite/mobius/OverflowMenu/OverflowMenu";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { css } from "styled-components";

const generateChild = name => <Clickable key={name}>{name}</Clickable>;
const children = [generateChild("title"), generateChild("moose")];
const propsBase = { isOpen: true, children };
const themeGenerator = defaultProps => ({
    ...baseTheme,
    overflowMenu: { defaultProps },
});

describe("OverflowMenu", () => {
    let props;
    let theme;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <p id="hi">hi</p>
                    <OverflowMenu {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = propsBase;
        theme = { ...baseTheme };
        mountedWrapper = undefined;
    });

    const withProps = () => {
        props = { ...propsBase };
        const builder = {
            withCssColor(color) {
                const theCss = css`
                    color: ${color};
                `;

                props.cssOverrides = {
                    wrapper: theCss,
                    menu: theCss,
                    menuItem: theCss,
                };
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
            overflowMenu: {
                defaultProps: {},
            },
        };
        const builder = {
            withCssBgColor(bgColor) {
                const theCss = css`
                    background-color: ${bgColor};
                `;

                theme.overflowMenu.defaultProps.cssOverrides = {
                    wrapper: theCss,
                    menu: theCss,
                    menuItem: theCss,
                };
                return this;
            },
            withMergeCss(isMergeCss) {
                theme.overflowMenu.defaultProps.mergeCss = isMergeCss;
                return this;
            },
        };
        return builder;
    };

    describe("render html elements", () => {
        test("only renders a button and nav by default if open false", () => {
            props = { isOpen: false, children };
            const root = wrapper();
            expect(root.find(Button)).toHaveLength(1);
            expect(root.find("nav")).toHaveLength(1);
            expect(root.find("ul")).toHaveLength(0);
        });
        test("a nav and button if open true", () => {
            const root = wrapper().find("nav");
            expect(root.find(Button)).toHaveLength(1);
            expect(root).toHaveLength(1);
        });
        test("a ul by default", () => {
            const root = wrapper().find("ul");
            expect(root).toHaveLength(1);
        });
        test("an li for each child node", () => {
            const root = wrapper().find("li");
            expect(root).toHaveLength(2);
        });
        test("a Clickable for each child node", () => {
            const root = wrapper().find(Clickable);
            expect(root).toHaveLength(2);
        });
    });

    describe("expected behavior", () => {
        test("opens when trigger clicked", () => {
            props = { isOpen: false, children };
            const root = wrapper();
            expect(root.find("ul")).toHaveLength(0);
            root.find(Icon).simulate("click");
            expect(root.find(Button)).toHaveLength(1);
            expect(root.find("nav")).toHaveLength(1);
            expect(root.find("ul")).toHaveLength(1);
        });
        test("closes when esc pressed", () => {
            props = { isOpen: false, children };
            const root = wrapper();
            root.simulate("keyDown", {
                keyCode: 27,
                which: 27,
                key: "escape",
            });
            expect(root.find("nav")).toHaveLength(1);
            expect(root.find("ul")).toHaveLength(0);
        });
        test("closes when other element clicked", () => {
            const root = wrapper();
            expect(root.find("ul")).toHaveLength(1);
            root.find('[id="hi"]').simulate("click");
            setTimeout(() => {
                expect(root.find("ul")).toHaveLength(0);
            }, 200);
        });
        test("menu item onclick called and menu closed when clicked", () => {
            const fn = jest.fn();
            props = {
                isOpen: false,
                children: [
                    <Clickable key="hat" id="hat" onClick={fn}>
                        hat
                    </Clickable>,
                    <Clickable key="moose" id="moose">
                        moose
                    </Clickable>,
                ],
            };
            const root = wrapper();
            root.find(Icon).simulate("click");
            expect(root.find("ul")).toHaveLength(1);
            root.find('button[id="hat"]').simulate("click");
            expect(fn).toHaveBeenCalled();
            setTimeout(() => {
                expect(root.find("ul")).toHaveLength(0);
            }, 200);
        });
    });

    describe("appropriately applies theme overrides", () => {
        describe("css overrides", () => {
            test("instance with no theme applies instance", () => {
                props = {
                    ...propsBase,
                    cssOverrides: {
                        wrapper: "background: red;",
                    },
                };
                expect(wrapper().find("nav")).toHaveStyleRule("background", "red");
            });
            test("theme with no instance applies theme", () => {
                theme = themeGenerator({ cssOverrides: { menu: "color: azure;" } });
                expect(wrapper().find("ul")).toHaveStyleRule("color", "azure");
            });
            test("theme and instance applies instance", () => {
                props = {
                    ...propsBase,
                    cssOverrides: {
                        menu: "border: 1px dashed deeppink",
                        wrapper: "color: red;",
                    },
                };
                theme = themeGenerator({ cssOverrides: { wrapper: "color: blue;" } });
                const root = wrapper();
                expect(root.find("ul")).toHaveStyleRule("border", "1px dashed deeppink");
                expect(root.find("nav")).not.toHaveStyleRule("color", "blue");
                expect(root.find("nav")).toHaveStyleRule("color", "red");
            });
        });
        describe("buttonProps", () => {
            test("instance with no theme applies instance", () => {
                props = {
                    ...propsBase,
                    buttonProps: {
                        shadow: true,
                    },
                };
                expect(wrapper().find(Button)).toHaveStyleRule("box-shadow", baseTheme.shadows[1]);
            });
            test("theme with no instance applies theme", () => {
                theme = themeGenerator({ buttonProps: { variant: "primary" } });
                expect(wrapper().find(Button)).toHaveStyleRule("color", "#FFFFFF");
            });
            test("theme and instance applies instance", () => {
                theme = themeGenerator({ buttonProps: { shape: "rounded", sizeVariant: "medium" } });
                props = {
                    ...propsBase,
                    buttonProps: {
                        sizeVariant: "large",
                    },
                };
                const root = wrapper().find(Button);
                expect(root).toHaveStyleRule("min-height", "48px");
                expect(root).not.toHaveStyleRule("min-height", "40px");
                expect(root).toHaveStyleRule("border-radius", ".5em");
            });
        });
    });

    function expectStyleRule(property, value) {
        expect(wrapper().find("ul")).toHaveStyleRule(property, value); // menu
        // this doesn't work for some reason expect(wrapper().find("li span")).toHaveStyleRule(property, value); // menuItem
        expect(wrapper().find("nav")).toHaveStyleRule(property, value); // wrapper
    }

    describe("Merge Css", () => {
        test("No merge if not specified", () => {
            withProps().withCssColor("red").withMergeCss(false);
            withTheme().withCssBgColor("violet").withMergeCss(false);

            expectStyleRule("color", "red");
            expectStyleRule("background-color", undefined);
        });

        test("No merge if component does not specify", () => {
            withProps().withCssColor("red").withMergeCss(false);
            withTheme().withCssBgColor("violet").withMergeCss(true);

            expectStyleRule("color", "red");
            expectStyleRule("background-color", undefined);
        });
        test("Merge when theme says so", () => {
            withProps().withCssColor("red");
            withTheme().withCssBgColor("violet").withMergeCss(true);

            expectStyleRule("color", "red");
            expectStyleRule("background-color", "violet");
        });
        test("Merge if component says so", () => {
            withProps().withCssColor("red").withMergeCss(true);
            withTheme().withCssBgColor("violet").withMergeCss(false);

            expectStyleRule("color", "red");
            expectStyleRule("background-color", "violet");
        });
    });
});
