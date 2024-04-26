import Button from "@insite/mobius/Button/Button";
import baseTheme from "@insite/mobius/globals/baseTheme";
import Icon from "@insite/mobius/Icon";
import CreditCard from "@insite/mobius/Icons/CreditCard";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import Typography from "@insite/mobius/Typography";
import DisablerContext from "@insite/mobius/utilities/DisablerContext";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { css } from "styled-components";

const themeGenerator = newProps => ({
    ...baseTheme,
    button: { ...baseTheme.button, ...newProps },
});

describe("Button", () => {
    let props;
    let buttonText;
    let mountedWrapper;
    let disablerValue;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <DisablerContext.Provider value={disablerValue}>
                        <Button {...props}>{buttonText}</Button>
                    </DisablerContext.Provider>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
        theme = { ...baseTheme };
    });

    test("renders the button text", () => {
        const text = "text";
        buttonText = text;
        const typography = wrapper().find(Typography);
        expect(typography).toHaveLength(1);
        expect(typography.text()).toContain(text);
    });

    describe("renders icon based on props", () => {
        test("provides the correct icon", () => {
            buttonText = "hi there";
            props = { icon: { src: CreditCard, position: "left" } };
            const root = wrapper();
            expect(root.find(Icon)).toHaveLength(1);
            expect(root.find(CreditCard)).toHaveLength(1);
        });

        test("provides the correct styling for the icon", () => {
            buttonText = "hi there";
            props = { icon: { src: CreditCard, position: "left" } };
            const root = wrapper();
            expect(root.find(Icon)).toHaveStyleRule("margin-right", "7px");
        });
    });

    describe("applies variant theme styles based on variant prop", () => {
        test("primary", () => {
            buttonText = "hi there";
            props = { variant: "primary" };
            const button = wrapper().find("button");
            const expectedRules = {
                background: "#275AA8",
                border: "2px solid #275AA8",
                color: "#FFFFFF",
            };
            Object.keys(expectedRules).forEach(k => expect(button).toHaveStyleRule(k, expectedRules[k]));
        });
        test("secondary", () => {
            buttonText = "hi there";
            props = { variant: "secondary" };
            const button = wrapper().find("button");
            const expectedRules = {
                border: "2px solid #6C757D",
                background: "transparent",
                color: "#6C757D",
            };
            Object.keys(expectedRules).forEach(k => expect(button).toHaveStyleRule(k, expectedRules[k]));
        });
    });

    describe("applies styling based on props and variant", () => {
        describe("props with variant", () => {
            test("instance css overrides variant css by default", () => {
                buttonText = "hi there";
                props = {
                    variant: "primary",
                    css: css`
                        font-weight: 500;
                        padding: 5px;
                    `,
                };
                theme = themeGenerator({
                    primary: {
                        css: css`
                            border-radius: 2px;
                            font-weight: 700;
                        `,
                    },
                });
                const root = wrapper().find("button");
                expect(root).not.toHaveStyleRule("border-radius", "2px");
                expect(root).toHaveStyleRule("padding", "5px");
                expect(root).toHaveStyleRule("font-weight", "500");
            });
            test("instance css overrides variant css when instance mergeCss is false, even if variant mergeCss is true", () => {
                buttonText = "hi there";
                props = {
                    variant: "primary",
                    css: css`
                        font-weight: 500;
                        padding: 5px;
                    `,
                    mergeCss: false,
                };
                theme = themeGenerator({
                    primary: {
                        css: css`
                            border-radius: 2px;
                            font-weight: 700;
                        `,
                        mergeCss: true,
                    },
                });
                const root = wrapper().find("button");
                expect(root).not.toHaveStyleRule("border-radius", "2px");
                expect(root).toHaveStyleRule("padding", "5px");
                expect(root).toHaveStyleRule("font-weight", "500");
            });
            test("merges instance and variant css when mergeCss is true", () => {
                buttonText = "hi there";
                props = {
                    css: css`
                        font-weight: 500;
                        padding: 5px;
                    `,
                    mergeCss: true,
                };
                theme = themeGenerator({
                    primary: {
                        css: css`
                            border-radius: 2px;
                            font-weight: 700;
                        `,
                    },
                });
                const root = wrapper().find("button");
                console.log(root);
                expect(root).toHaveStyleRule("border-radius", "2px");
                expect(root).toHaveStyleRule("padding", "5px");
                expect(root).toHaveStyleRule("font-weight", "500");
            });
        });
    });

    describe("applies shapes theme styles based on variant prop", () => {
        test("rectangle", () => {
            buttonText = "hi there";
            props = { shape: "rectangle", sizeVariant: "medium" };
            const button = wrapper().find("button");
            expect(button).not.toHaveStyleRule("border-radius", ".5em");
            expect(button).not.toHaveStyleRule("border-radius", "20px");
        });
        test("rounded", () => {
            buttonText = "hi there";
            props = { shape: "rounded" };
            const button = wrapper().find("button");
            expect(button).toHaveStyleRule("border-radius", ".5em");
        });
        test("pill", () => {
            buttonText = "hi there";
            props = { shape: "pill", sizeVariant: "small" };
            const button = wrapper().find("button");
            expect(button).toHaveStyleRule("border-radius", "15px");
        });
    });

    describe("is appropriately disabled", () => {
        test("if DisablerContext is true", () => {
            buttonText = "hi there";
            disablerValue = { disable: true };
            expect(wrapper().find("button").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is true", () => {
            buttonText = "hi there";
            props = { disabled: true };
            disablerValue = { disable: false };
            expect(wrapper().find("button").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is false", () => {
            buttonText = "hi there";
            disablerValue = { disable: false };
            expect(wrapper().find("button").prop("disabled")).toBe(false);
        });
    });
});

describe("Multiple Buttons", () => {
    let button1Props;
    let button2Props;
    let mountedWrapper;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Button id="button1" {...button1Props}>
                        Button 1
                    </Button>
                    <Button id="button2" {...button2Props}>
                        Button 2
                    </Button>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        button1Props = {};
        button2Props = {};
        mountedWrapper = undefined;
        theme = { ...baseTheme };
    });

    describe("applies styling based on props and variant", () => {
        describe("props with variant", () => {
            test("merges prop and variant css when variant mergeCss is true", () => {
                button1Props = {
                    variant: "primary",
                    css: css`
                        color: purple;
                    `,
                };
                button2Props = {
                    variant: "primary",
                    css: css`
                        color: cyan;
                    `,
                };
                theme = themeGenerator({
                    primary: {
                        css: css`
                            border-radius: 2px;
                        `,
                        mergeCss: true,
                    },
                });
                const button1 = wrapper().find("#button1");
                const button2 = wrapper().find("#button2");
                expect(button1).toHaveStyleRule("border-radius", "2px");
                expect(button1).toHaveStyleRule("color", "purple");
                expect(button2).toHaveStyleRule("border-radius", "2px");
                expect(button2).toHaveStyleRule("color", "cyan");
            });
        });
    });
});
