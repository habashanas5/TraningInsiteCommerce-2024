import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import TextField, { InputStyle } from "./TextField";
import FormField from "@insite/mobius/FormField";
import DisablerContext from "../utilities/DisablerContext";
import { css } from "styled-components";

describe("TextField", () => {
    let props;
    let mountedWrapper;
    let disablerValue;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <DisablerContext.Provider value={disablerValue}>
                        <TextField {...props} />
                    </DisablerContext.Provider>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    const unmountTextField = () => {
        mountedWrapper = undefined;
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
            textField: {
                defaultProps: {},
            },
        };
        const builder = {
            withCssBgColor(color) {
                theme.textField.defaultProps.css = css`
                    background: ${color};
                `;
                return this;
            },
            withMergeCss(value) {
                theme.textField.defaultProps.mergeCss = value;
                return this;
            },
        };
        return builder;
    };

    beforeEach(() => {
        props = {};
        unmountTextField();
    });

    test("renders the label when prop is provided", () => {
        props = { label: "props.label" };
        const label = wrapper().find(TextField).find(TextField).find("label").getDOMNode();
        expect(label.innerHTML).toBe(props.label);
    });

    test("adds an asterisk to the label when `required` is true, but not disabled", () => {
        const label = () => wrapper().find(TextField).find("label").getDOMNode();

        props = { label: "props.label", required: true, disabled: false };
        expect(label().innerHTML).toBe(`${props.label} *`);

        unmountTextField();

        props = { label: "props.label", required: true, disabled: true };
        expect(label().innerHTML).toBe(props.label);
    });

    test("renders the hint text when provided", () => {
        props = { hint: "props.hint" };
        const hintText = wrapper().find(TextField).find('[id$="-description"] span').getDOMNode().innerHTML;

        expect(hintText).toBe(props.hint);
    });

    describe("is appropriately disabled", () => {
        test("if DisablerContext is true", () => {
            disablerValue = { disable: true };
            expect(wrapper().find("input").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is true", () => {
            props = { disabled: true };
            disablerValue = { disable: false };
            expect(wrapper().find("input").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is false", () => {
            disablerValue = { disable: false };
            expect(wrapper().find("input").prop("disabled")).toBe(false);
        });
    });

    describe("Merge Css", () => {
        test("Does not merge when mergeCss not specified", () => {
            withProps().withCssColor("red");
            withTheme().withCssBgColor("pink");
            expect(wrapper().find(InputStyle)).toHaveStyleRule("color", "red");
            expect(wrapper().find(InputStyle)).toHaveStyleRule("background", undefined);
        });

        test("Merges when component specifies", () => {
            withProps().withMergeCss(true).withCssColor("red");
            withTheme().withCssBgColor("pink");

            expect(wrapper().find(InputStyle)).toHaveStyleRule("color", "red");
            expect(wrapper().find(InputStyle)).toHaveStyleRule("background", "pink");
        });

        test("Merges when theme specifies", () => {
            withProps().withCssColor("red");
            withTheme().withMergeCss(true).withCssBgColor("pink");

            expect(wrapper().find(InputStyle)).toHaveStyleRule("color", "red");
            expect(wrapper().find(InputStyle)).toHaveStyleRule("background", "pink");
        });

        test("Does not merge when component overrides theme", () => {
            withProps().withMergeCss(false).withCssColor("red");
            withTheme().withMergeCss(true).withCssBgColor("pink");

            expect(wrapper().find(InputStyle)).toHaveStyleRule("color", "red");
            expect(wrapper().find(InputStyle)).toHaveStyleRule("background", undefined);
        });
    });
    describe("Check backgroundColor prop", () => {
        test("Background color prop in FormField", () => {
            props = {
                backgroundColor: "green",
            };
            withTheme();

            expect(wrapper().find(FormField).props().backgroundColor).toEqual("green");
        });
    });
});
