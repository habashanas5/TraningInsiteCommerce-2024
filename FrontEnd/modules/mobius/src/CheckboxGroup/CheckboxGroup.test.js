import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import CheckboxGroup from "./CheckboxGroup";
import baseTheme from "../globals/baseTheme";
import Typography from "../Typography";

import { css } from "styled-components";

describe("CheckboxGroup", () => {
    let props;
    let mountedWrapper;
    let theme = baseTheme;

    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <CheckboxGroup {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    const withProps = () => {
        props = {};
        const builder = {
            withBackgroundCss(backgroundColor) {
                props.css = css`
                    background-color: ${backgroundColor};
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
        theme = {
            ...baseTheme,
            checkbox: {
                groupDefaultProps: {},
            },
        };
        const builder = {
            withColorCss(color) {
                theme.checkbox.groupDefaultProps.css = css`
                    color: ${color};
                `;
                return this;
            },
            withMergeCss(isMerge) {
                theme.checkbox.groupDefaultProps.mergeCss = isMerge;
                return this;
            },
        };

        return builder;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("Renders a fieldset by default", () => {
        const root = wrapper().find(CheckboxGroup).getDOMNode();
        expect(root instanceof HTMLFieldSetElement).toBe(true);
    });

    describe("Merge CSS", () => {
        test("No merge if not specified", () => {
            withProps().withBackgroundCss("blue").withMergeCss(false);
            withTheme().withColorCss("black").withMergeCss(false);

            expect(wrapper().find(CheckboxGroup)).toHaveStyleRule("background-color", "blue");
            expect(wrapper().find(CheckboxGroup)).toHaveStyleRule("color", undefined);
        });
        test("No merge if component does not specify", () => {
            withProps().withBackgroundCss("blue").withMergeCss(false);
            withTheme().withColorCss("black").withMergeCss(true);

            expect(wrapper().find(CheckboxGroup)).toHaveStyleRule("background-color", "blue");
            expect(wrapper().find(CheckboxGroup)).toHaveStyleRule("color", undefined);
        });
        test("Merge when theme says so", () => {
            withProps().withBackgroundCss("blue");
            withTheme().withColorCss("black").withMergeCss(true);

            expect(wrapper().find(CheckboxGroup)).toHaveStyleRule("background-color", "blue");
            expect(wrapper().find(CheckboxGroup)).toHaveStyleRule("color", "black");
        });
        test("Merge if component says so", () => {
            withProps().withBackgroundCss("blue").withMergeCss(true);
            withTheme().withColorCss("black").withMergeCss(false);

            expect(wrapper().find(CheckboxGroup)).toHaveStyleRule("background-color", "blue");
            expect(wrapper().find(CheckboxGroup)).toHaveStyleRule("color", "black");
        });
    });

    describe("Label element", () => {
        test("Label text", () => {
            // Was originally looking for the id. However, that was returning three nodes, which shouldn't happen for an id attribute
            // However, I need to check what is seen in the DOM, rather than what is output by debug() in this test environment
            props.label = "Label text";
            expect(wrapper().find("legend").text()).toEqual("Label text");
        });

        test("No label, no render", () => {
            props.label = null;
            expect(wrapper().find("legend")).toEqual({});
        });

        test("Label Size", () => {
            props.label = "Label Text";
            expect(wrapper().find(Typography).at(0).props().size).toEqual(15);
        });
    });

    describe("Error element", () => {
        test("Error text", () => {
            props.error = 0;
            expect(wrapper().find(Typography).at(1).text()).toEqual("0");
        });

        test("No error, no render", () => {
            props.error = null;
            expect(wrapper().find(Typography).at(1)).toEqual({});
        });
        test("No error, no render", () => {
            props.error = "Error text";
            expect(wrapper().find(Typography).at(1).props().size).toEqual(15);
        });
    });

    describe("Label props", () => {
        test("Check label props on outermost element", () => {
            props.uid = "unique-id";
            expect(wrapper().find({ "aria-labelledby": "unique-id" })).toBeTruthy();
        });
    });
});
