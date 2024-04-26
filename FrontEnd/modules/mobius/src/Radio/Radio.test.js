import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import RadioGroupContext from "../RadioGroup/RadioGroupContext";
import Radio from "./Radio";
import baseTheme from "../globals/baseTheme";
import Typography from "../Typography";

import { css } from "styled-components";

describe("Radio", () => {
    let props;
    let mountedWrapper;
    let theme = baseTheme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <RadioGroupContext.Provider
                        value={{
                            name: "hat",
                            value: "moose",
                            sizeVariant: "small",
                            onChange: () => "hat",
                        }}
                    >
                        <Radio name="moose" value="moose" {...props} />
                    </RadioGroupContext.Provider>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    const withProps = () => {
        props = {};
        const builder = {
            withCssBackground(color) {
                props.css = css`
                    background-color: ${color};
                `;
                return this;
            },
            withMergeCss(isMerge) {
                props.mergeCss = isMerge;
                return this;
            },
        };
        return builder;
    };

    const withTheme = () => {
        theme = { ...baseTheme };
        const builder = {
            withCssColor(color) {
                theme.radio.defaultProps.css = css`
                    color: ${color};
                `;
                return this;
            },
            withMergeCss(isMerge) {
                theme.radio.defaultProps.mergeCss = isMerge;
                return this;
            },
        };
        return builder;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("renders a div by default", () => {
        const root = wrapper().find(Radio).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });

    describe("Css check", () => {
        test("No merge if not specified", () => {
            withProps().withCssBackground("tomato").withMergeCss(false);
            withTheme().withCssColor("green").withMergeCss(false);

            const root = wrapper().find(Radio);

            expect(root).toHaveStyleRule("background-color", "tomato");
            expect(root).toHaveStyleRule("color", undefined);
        });

        test("No merge if component does not specify", () => {
            withProps().withCssBackground("tomato").withMergeCss(false);
            withTheme().withCssColor("green").withMergeCss(true);

            const root = wrapper().find(Radio);

            expect(root).toHaveStyleRule("background-color", "tomato");
            expect(root).toHaveStyleRule("color", undefined);
        });
        test("Merge when theme says so", () => {
            withProps().withCssBackground("tomato");
            withTheme().withCssColor("green").withMergeCss(true);

            const root = wrapper().find(Radio);

            expect(root).toHaveStyleRule("background-color", "tomato");
            expect(root).toHaveStyleRule("color", "green");
        });
        test("Merge if component says so", () => {
            withProps().withCssBackground("tomato").withMergeCss(true);
            withTheme().withCssColor("green").withMergeCss(false);

            const root = wrapper().find(Radio);

            expect(root).toHaveStyleRule("background-color", "tomato");
            expect(root).toHaveStyleRule("color", "green");
        });
    });

    test("Text inside typography", () => {
        props = {
            children: "Test text",
        };
        const typographyComponent = wrapper().find(Typography);

        expect(typographyComponent.text()).toBe("Test text");
    });

    test("Value of input", () => {
        props = {
            value: "Test Input Value",
        };

        const inputComponent = wrapper().find("input");

        expect(inputComponent.props().value).toBe("Test Input Value");
    });
});
