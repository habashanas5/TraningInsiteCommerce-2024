import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import VisuallyHidden from "./VisuallyHidden";
import Typography from "../Typography";

describe("VisuallyHidden", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <VisuallyHidden {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    describe("returns null if `children` is", () => {
        test("undefined", () => {
            const root = wrapper().find(VisuallyHidden).getDOMNode();
            expect(root).toBeNull();
        });
        test("empty", () => {
            props.children = [];
            const root = wrapper().find(VisuallyHidden).getDOMNode();
            expect(root).toBeNull();
        });
    });

    test("returns typography children in hidden component if passed", () => {
        const text = "hat";
        props.children = <Typography>{text}</Typography>;
        const typography = wrapper().find(Typography);
        expect(typography).toHaveLength(1);
        expect(typography.text()).toContain(text);
    });
});
