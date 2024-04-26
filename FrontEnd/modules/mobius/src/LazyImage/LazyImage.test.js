import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import LazyImage from "./LazyImage";
import ThemeProvider from "../ThemeProvider/index";

describe("LazyImage", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <LazyImage {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("renders null by default", () => {
        const root = wrapper().find(LazyImage).getDOMNode();
        expect(root).toBe(null);
    });

    test("renders a div when a src is passed in", () => {
        props = { src: "not-empty" };
        const root = wrapper().find(LazyImage).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });

    test("renders props src on first mount", () => {
        const expected = "filled-src";
        props = { src: expected };
        const root = wrapper().find("img");

        expect(root.props().src).toBe(expected);
    });
});
