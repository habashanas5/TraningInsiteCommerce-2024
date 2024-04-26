import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import FormField, { FormInputWrapper } from "./FormField";

describe("FormField", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <FormField {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = { inputId: 4, descriptionId: 18, formInput: <input /> };
        mountedWrapper = undefined;
    });

    describe("label", () => {
        test("renders when prop is provided", () => {
            props = {
                label: "props.label",
                inputId: 4,
                descriptionId: 18,
                formInput: <input />,
            };
            const label = wrapper().find(FormField).find("label").getDOMNode();
            expect(label.innerHTML).toBe(props.label);
        });
        test("small styles applied", () => {
            props = {
                label: "props.label",
                inputId: 4,
                descriptionId: 18,
                sizeVariant: "small",
                formInput: <input />,
            };
            const label = wrapper().find(FormField).find("label");
            expect(label).toHaveStyleRule("font-size", "13px");
            expect(label).toHaveStyleRule("font-weight", "600");
        });
        test("default styles applied", () => {
            props = {
                label: "props.label",
                inputId: 4,
                descriptionId: 18,
                sizeVariant: "default",
                formInput: <input />,
            };
            const label = wrapper().find(FormField).find("label");
            expect(label).toHaveStyleRule("font-size", "15px");
            expect(label).toHaveStyleRule("font-weight", "600");
        });
    });

    describe("required adds an asterisk to the label", () => {
        test("when not disabled", () => {
            const label = () => wrapper().find(FormField).find("label").getDOMNode();
            props = {
                label: "props.label",
                required: true,
                disabled: false,
                inputId: 4,
                descriptionId: 18,
                formInput: <input />,
            };
            expect(label().innerHTML).toBe(`${props.label} *`);
        });

        test("but not when disabled", () => {
            const label = () => wrapper().find(FormField).find("label").getDOMNode();
            props = {
                label: "props.label",
                required: true,
                disabled: true,
                inputId: 4,
                descriptionId: 18,
                formInput: <input />,
            };
            expect(label().innerHTML).toBe(props.label);
        });
    });

    test("renders the hint text when provided", () => {
        props = {
            hint: "props.hint",
            inputId: 4,
            descriptionId: "18-description",
            formInput: <input />,
        };
        const hintText = wrapper().find(FormField).find('[id$="18-description"] span');
        expect(hintText.getDOMNode().innerHTML).toBe(props.hint);
        expect(hintText).toHaveStyleRule("color", "#2D3435");
        expect(hintText).toHaveStyleRule("font-size", "15px");
    });

    test("renders error text when provided", () => {
        props = {
            error: "props.error",
            inputId: 4,
            descriptionId: "18-description",
            formInput: <input />,
        };
        const hintText = wrapper().find(FormField).find('[id$="18-description"] span');
        expect(hintText.getDOMNode().innerHTML).toBe(props.error);
        expect(hintText).toHaveStyleRule("color", "#E64E25");
        expect(hintText).toHaveStyleRule("font-size", "15px");
    });

    describe("backgroundColor props on formfield", () => {
        test("backgroundColor green", () => {
            props = {
                error: "props.error",
                inputId: 4,
                descriptionId: "18-description",
                formInput: <input />,
                backgroundColor: "green",
            };

            const FormFieldComponent = wrapper().find(FormField);
            expect(FormFieldComponent.props().backgroundColor).toEqual("green");
        });
        test("backgroundColor green style", () => {
            props = {
                error: "props.error",
                inputId: 4,
                descriptionId: "18-description",
                formInput: <input />,
                backgroundColor: "green",
            };

            expect(wrapper().find(FormInputWrapper).props()._backgroundColor).toEqual("green");
        });
    });
});
