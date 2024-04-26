import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import LayoutTable from "./LayoutTable";
import ThemeProvider from "../ThemeProvider";

describe("LayoutTable", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <LayoutTable {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = { cellsPerGroup: 0, numberOfGroups: 0 };
        mountedWrapper = undefined;
    });

    test("renders as a div by default", () => {
        const root = wrapper().find(LayoutTable).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });

    test("Props passed to component", () => {
        const root = wrapper().find(LayoutTable);
        expect(root.props().cellsPerGroup).toBe(0);
        expect(root.props().numberOfGroups).toBe(0);
    });
});
