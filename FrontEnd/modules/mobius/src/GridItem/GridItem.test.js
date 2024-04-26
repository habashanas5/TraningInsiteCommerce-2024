import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import GridContainer from "../GridContainer";
import GridItem from "./GridItem";

import { css } from "styled-components";

describe("GridItem", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <GridContainer>
                        <GridItem {...props} />
                    </GridContainer>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("renders as a div by default", () => {
        const root = wrapper().find(GridItem).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });

    test("Gap and width prop", () => {
        props = {
            gap: "4px",
            width: 8,
        };
        const root = wrapper().find(GridItem);

        expect(root.props().gap).toEqual("4px");
        expect(root.props().width).toEqual(8);
    });

    test("CSS prop", () => {
        props = {
            css: css`
                background: tomato;
            `,
        };
        const root = wrapper().find(GridItem);

        expect(root).toHaveStyleRule("background", "tomato");
    });
});
