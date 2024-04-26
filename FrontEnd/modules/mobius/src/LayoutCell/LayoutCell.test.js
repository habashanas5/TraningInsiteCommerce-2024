import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import LayoutCell from "./LayoutCell";

import { css } from "styled-components";

describe("LayoutCell", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <LayoutCell />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("Renders", () => {
        expect(wrapper().find(LayoutCell)).toHaveLength(1);
    });
});
