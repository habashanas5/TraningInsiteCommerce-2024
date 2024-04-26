import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import Breadcrumbs from "./Breadcrumbs";
import ThemeProvider from "../ThemeProvider";

describe("Breadcrumbs", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Breadcrumbs {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("returns null if `links` is undefined", () => {
        props = { links: undefined };
        const root = wrapper().find(Breadcrumbs).getDOMNode();
        expect(root).toBeNull();
    });

    test("returns null if `links` is an empty array", () => {
        props = { links: [] };
        const root = wrapper().find(Breadcrumbs).getDOMNode();
        expect(root).toBeNull();
    });

    test("returns null if `links` map yields an array of nulls", () => {
        props = { links: [{ children: null }] };
        const root = wrapper().find(Breadcrumbs).getDOMNode();
        expect(root).toBeNull();
    });

    test("renders as a nav by default", () => {
        props = { links: [{ children: "first" }] };
        const root = wrapper().find(Breadcrumbs).getDOMNode();
        expect(root.outerHTML).toEqual(expect.stringMatching(/^<nav\s/));
    });
});
