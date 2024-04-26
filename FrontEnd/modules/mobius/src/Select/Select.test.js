/* eslint-disable no-undef */
import Select from "@insite/mobius/Select/Select";
import FormField, { FormFieldStyle } from "@insite/mobius/FormField";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import DisablerContext from "@insite/mobius/utilities/DisablerContext";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { css } from "styled-components";

let props;
let mountedWrapper;
let disablerValue;
let theme;

const children = [
    <option key={0} value={0}>
        Select
    </option>,
    <option key={1} value={1}>
        apple
    </option>,
    <option key={2} value={2}>
        bananas
    </option>,
    <option key={3} value={3}>
        cherries
    </option>,
];

const wrapper = () => {
    if (!mountedWrapper) {
        mountedWrapper = mount(
            <ThemeProvider theme={theme}>
                <DisablerContext.Provider value={disablerValue}>
                    <Select {...props}>{children}</Select>
                </DisablerContext.Provider>
            </ThemeProvider>,
        );
    }
    return mountedWrapper;
};

const unmountSelect = () => {
    mountedWrapper = null;
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
        select: {
            defaultProps: {},
        },
    };
    const builder = {
        withCssBgColor(color) {
            theme.select.defaultProps.css = css`
                background: ${color};
            `;
            return this;
        },
        withMergeCss(value) {
            theme.select.defaultProps.mergeCss = value;
            return this;
        },
    };
    return builder;
};

describe("Select", () => {
    beforeEach(() => {
        props = {};
        mountedWrapper = null;
    });

    test("renders the label when prop is provided", () => {
        props = { label: "props.label" };
        const label = wrapper().find(Select).find("label").getDOMNode();
        expect(label.innerHTML).toBe(props.label);
    });

    test("adds an asterisk to the label when `required` is true, but not disabled", () => {
        const label = () => wrapper().find(Select).find("label").getDOMNode();
        props = { label: "props.label", required: true, disabled: false };
        expect(label().innerHTML).toBe(`${props.label} *`);

        unmountSelect();

        props = { label: "props.label", required: true, disabled: true };
        expect(label().innerHTML).toBe(props.label);
    });

    test("renders the hint text when provided", () => {
        props = { hint: "props.hint" };
        const hintText = wrapper().find(Select).find('[id$="-description"] span').getDOMNode().innerHTML;
        expect(hintText).toBe(props.hint);
    });

    describe("is appropriately disabled", () => {
        test("if DisablerContext is true", () => {
            disablerValue = { disable: true };
            expect(wrapper().find("select").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is true", () => {
            props = { disabled: true };
            disablerValue = { disable: false };
            expect(wrapper().find("select").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is false", () => {
            disablerValue = { disable: false };
            expect(wrapper().find("select").prop("disabled")).toBe(false);
        });
    });

    describe("Merge Css", () => {
        test("Does not merge when mergeCss not specified", () => {
            withProps().withCssColor("red");
            withTheme().withCssBgColor("pink");
            expect(wrapper().find("select")).toHaveStyleRule("color", "red");
            expect(wrapper().find("select")).toHaveStyleRule("background", undefined);
        });

        test("Merges when component specifies", () => {
            withProps().withMergeCss(true).withCssColor("red");
            withTheme().withCssBgColor("pink");

            expect(wrapper().find("select")).toHaveStyleRule("color", "red");
            expect(wrapper().find("select")).toHaveStyleRule("background", "pink");
        });

        test("Merges when theme specifies", () => {
            withProps().withCssColor("red");
            withTheme().withMergeCss(true).withCssBgColor("pink");

            expect(wrapper().find("select")).toHaveStyleRule("color", "red");
            expect(wrapper().find("select")).toHaveStyleRule("background", "pink");
        });

        test("Does not merge when component overrides theme", () => {
            withProps().withMergeCss(false).withCssColor("red");
            withTheme().withMergeCss(true).withCssBgColor("pink");

            expect(wrapper().find("select")).toHaveStyleRule("color", "red");
            expect(wrapper().find("select")).toHaveStyleRule("background", undefined);
        });
    });

    test("No border on formfield by default", () => {
        withTheme();
        props = {};

        expect(wrapper().find(FormFieldStyle)).toHaveStyleRule("border", "0");
    });

    describe("Background Color Prop", () => {
        test("FormFieldStyle prop", () => {
            withTheme();
            props = { backgroundColor: "green" };
            expect(wrapper().find(FormField).props().backgroundColor).toEqual("green");
        });
    });
});
