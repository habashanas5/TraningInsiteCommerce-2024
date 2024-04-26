import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import LoadingOverlay, { LoadingOverlayStyle } from "./LoadingOverlay";
import ThemeProvider from "../ThemeProvider";

import { css } from "styled-components";

describe("LoadingOverlay", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <LoadingOverlay {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {
            /* prop: undefined */
        };
        mountedWrapper = undefined;
    });

    test("renders as a div by default", () => {
        const root = wrapper().find(LoadingOverlay).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });

    test("Props passing into component", () => {
        props = {
            loading: false,
        };
        const root = wrapper().find(LoadingOverlay);
        expect(root.props().loading).toBeFalsy();
    });

    test("CSS prop being applied", () => {
        props = {
            css: css`
                background: tomato;
            `,
        };

        const styledLoadingOverlay = wrapper().find(LoadingOverlayStyle);

        expect(styledLoadingOverlay).toHaveStyleRule("background", "tomato");
    });
});
