import "jest-styled-components";
import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Hidden from "./Hidden";

describe("Hidden", () => {
    let props;
    let mountedWrapper;
    const wrapper = mode => {
        if (!mountedWrapper) {
            mountedWrapper = mode(
                <ThemeProvider createChildGlobals={false}>
                    <Hidden {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("renders a div by default", () => {
        const root = wrapper(mount).find(Hidden).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });

    test("renders a paragraph when passed 'as p'", () => {
        props = { as: "p" };
        const root = wrapper(mount).find(Hidden).getDOMNode();
        expect(root instanceof HTMLParagraphElement).toBe(true);
    });

    test("applies appropriate styling for below only", () => {
        props = { below: "md" };
        const root = wrapper(renderer.create).toJSON();
        expect(root).toHaveStyleRule("display", "none", {
            media: "(max-width: 767px)",
        });
    });

    test("applies appropriate styling for above only", () => {
        props = { above: "lg" };
        const root = wrapper(renderer.create).toJSON();
        expect(root).toHaveStyleRule("display", "none", {
            media: "(min-width: 1200px)",
        });
    });

    test("applies appropriate styling for above and below", () => {
        props = { below: "md", above: "lg" };
        const root = wrapper(renderer.create).toJSON();
        expect(root).toHaveStyleRule("display", "none", {
            media: "(max-width: 767px)",
        });
        expect(root).toHaveStyleRule("display", "none", {
            media: "(min-width: 1200px)",
        });
    });
});
