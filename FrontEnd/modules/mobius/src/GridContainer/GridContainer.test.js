import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import GridContainer, { GridOffset, GridWrapper } from "./GridContainer";
import baseTheme from "../globals/baseTheme";
import GridItem from "../GridItem";

import { css } from "styled-components";

describe("GridContainer", () => {
    let props;
    let mountedWrapper;
    let theme;
    let mountedWrapperWithChildren;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <GridContainer {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };
    const wrapperWithChildren = () => {
        if (!mountedWrapperWithChildren) {
            mountedWrapperWithChildren = mount(
                <ThemeProvider>
                    <GridContainer {...props}>
                        <GridItem width={12}>Test Grid Item</GridItem>
                    </GridContainer>
                </ThemeProvider>,
            );
        }
        return mountedWrapperWithChildren;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
        theme = baseTheme;
        mountedWrapperWithChildren = undefined;
    });

    test("returns null if `children` is undefined or empty", () => {
        const root = wrapper().find(GridContainer).getDOMNode();
        expect(root).toBeNull();
    });

    test("renders as a div by default", () => {
        props = { children: <div /> };
        const root = wrapper().find(GridContainer).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });

    test("Css prop goes to both container elements", () => {
        props = {
            css: css`
                background: tomato;
            `,
            offsetCss: css`
                background: red;
            `,
            children: <div />,
        };
        const gridContainerElement = wrapper().find(GridWrapper);
        const gridOffsetElement = wrapper().find(GridOffset);
        expect(gridContainerElement).toHaveStyleRule("background", "tomato");
        expect(gridOffsetElement).toHaveStyleRule("background", "red");
    });

    test("Grid container gap prop", () => {
        props.gap = "40px";
        const root = wrapper().find(GridContainer);
        expect(root.props().gap).toEqual("40px");
    });

    test("CSS prop", () => {
        props.css = css`
            background: tomato;
        `;
        const root = wrapperWithChildren().find(GridWrapper);

        expect(root).toHaveStyleRule("background", "tomato");
    });
});
