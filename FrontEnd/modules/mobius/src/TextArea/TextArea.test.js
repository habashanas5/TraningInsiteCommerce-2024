import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import TextArea from "./TextArea";
import DisablerContext from "../utilities/DisablerContext";
import { TextAreaStyle } from "./TextArea";
import { css } from "styled-components";

describe("TextArea", () => {
    let props;
    let mountedWrapper;
    let disablerValue;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <DisablerContext.Provider value={disablerValue}>
                        <TextArea {...props} />
                    </DisablerContext.Provider>
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
            withMergeCss(value) {
                props.mergeCss = value;
                return this;
            },
        };
        return builder;
    };

    const withTheme = () => {
        theme = {
            textArea: {
                defaultProps: {},
            },
        };
        const builder = {
            withCssBgColor(color) {
                theme.textArea.defaultProps.css = css`
                    background: ${color};
                `;
                return this;
            },
            withMergeCss(value) {
                theme.textArea.defaultProps.mergeCss = value;
                return this;
            },
        };
        return builder;
    };

    beforeEach(() => {
        props = {};
        theme = {};
        mountedWrapper = undefined;
    });

    test("render a textarea", () => {
        expect(wrapper().find("textarea")).toHaveLength(1);
    });

    describe("is appropriately disabled", () => {
        test("if DisablerContext is true", () => {
            disablerValue = { disable: true };
            expect(wrapper().find("textarea").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is true", () => {
            props = { disabled: true };
            disablerValue = { disable: false };
            expect(wrapper().find("textarea").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is false", () => {
            disablerValue = { disable: false };
            expect(wrapper().find("textarea").prop("disabled")).toBe(false);
        });
    });
    describe("Merge Css", () => {
        test("Does not merge when mergeCss not specified", () => {
            withProps().withCssColor("red");
            withTheme().withCssBgColor("pink");
            expect(wrapper().find(TextAreaStyle)).toHaveStyleRule("color", "red");
            expect(wrapper().find(TextAreaStyle)).toHaveStyleRule("background", undefined);
        });

        test("Merges when component specifies", () => {
            withProps().withMergeCss(true).withCssColor("red");
            withTheme().withCssBgColor("pink");

            expect(wrapper().find(TextAreaStyle)).toHaveStyleRule("color", "red");
            expect(wrapper().find(TextAreaStyle)).toHaveStyleRule("background", "pink");
        });

        test("Merges when theme specifies", () => {
            withProps().withCssColor("red");
            withTheme().withMergeCss(true).withCssBgColor("pink");

            expect(wrapper().find(TextAreaStyle)).toHaveStyleRule("color", "red");
            expect(wrapper().find(TextAreaStyle)).toHaveStyleRule("background", "pink");
        });

        test("Does not merge when component overrides theme", () => {
            withProps().withMergeCss(false).withCssColor("red");
            withTheme().withMergeCss(true).withCssBgColor("pink");

            expect(wrapper().find(TextAreaStyle)).toHaveStyleRule("color", "red");
            expect(wrapper().find(TextAreaStyle)).toHaveStyleRule("background", undefined);
        });
    });
});
