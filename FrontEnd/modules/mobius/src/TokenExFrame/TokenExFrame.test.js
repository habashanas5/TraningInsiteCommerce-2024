import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import TokenExFrame from "./TokenExFrame";
import CreditCard from "../Icons/CreditCard";
import DisablerContext from "../utilities/DisablerContext";
import FormField from "@insite/mobius/FormField";

describe("TokenExFrame", () => {
    let props = { tokenExIFrameContainer: <iframe /> };
    let mountedWrapper;
    let disablerValue;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DisablerContext.Provider value={disablerValue}>
                        <TokenExFrame {...props} />
                    </DisablerContext.Provider>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("displays an icon when provided", () => {
        props = { iconProps: { src: CreditCard }, tokenExIFrameContainer: <iframe /> };
        expect(wrapper().find(CreditCard)).toHaveLength(1);
    });

    describe("is appropriately disabled", () => {
        test("renders an input when disabled", () => {
            props = { disabled: true, tokenExIFrameContainer: <iframe /> };
            expect(wrapper().find("input")).toHaveLength(1);
        });
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
            // if the input is not disabled, an iframe renders from tokenEx
            expect(wrapper().exists("input")).toBe(false);
        });
    });

    describe("renders a div of the appropriate height", () => {
        test("when small", () => {
            props = { sizeVariant: "small", tokenExIFrameContainer: <iframe /> };
            expect(wrapper().find('[data-id="frame-wrapper"]')).toHaveStyleRule("height", "30px");
        });
        test("when default", () => {
            props = { sizeVariant: "default", tokenExIFrameContainer: <iframe /> };
            expect(wrapper().find('[data-id="frame-wrapper"]')).toHaveStyleRule("height", "40px");
        });
    });
    describe("Background Prop passed to FormField", () => {
        test("Green Prop showing up on FormField", () => {
            props = { iconProps: { src: CreditCard }, tokenExIFrameContainer: <iframe />, backgroundColor: "green" };
            expect(wrapper().find(FormField).props().backgroundColor).toEqual("green");
        });
    });
});
