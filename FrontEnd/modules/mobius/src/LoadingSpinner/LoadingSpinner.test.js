import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import LoadingSpinner, { LoadingSpinnerStyle } from "./LoadingSpinner";
import ThemeProvider from "../ThemeProvider";
import { css } from "styled-components";

describe("LoadingSpinner", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <LoadingSpinner {...props} />
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

    test("renders as an svg by default", () => {
        const root = wrapper().find(LoadingSpinner).getDOMNode();
        expect(root instanceof SVGElement).toBe(true);
    });

    test("Props passed to component", () => {
        props = {
            size: "25",
            color: "tomato",
        };

        const rootProps = wrapper().find(LoadingSpinner).props();
        expect(rootProps.size).toBe("25");
        expect(rootProps.color).toBe("tomato");
    });

    test("Eventual style rules on styled component", () => {
        props = {
            size: "25",
        };

        const rootProps = wrapper().find(LoadingSpinnerStyle);

        expect(rootProps).toHaveStyleRule("width", "25px");
        expect(rootProps).toHaveStyleRule("height", "25px");
    });

    test("CSS", () => {
        props = {
            css: css`
                background: tomato;
            `,
        };
        const root = wrapper().find(LoadingSpinner);
        expect(root).toHaveStyleRule("background", "tomato");
    });
});
