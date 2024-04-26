import "babel-polyfill";
import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Link, { StyledIcon, StyledTypography, StyledClickable } from "./Link";

describe("Link", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Link {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("Renders a span by default", () => {
        const root = wrapper().find(Link).getDOMNode();
        expect(root instanceof HTMLSpanElement).toBe(true);
    });

    test("Props passed to component", () => {
        props = {
            color: "primary",
            hoverMode: "darken",
            icon: {
                iconProps: {
                    position: "left",
                    color: "tomato",
                },
            },
        };

        const root = wrapper().find(Link);

        const styledIcon = wrapper().find(StyledIcon);
        const styledTypography = wrapper().find(StyledTypography);
        const styledClickable = wrapper().find(StyledClickable);

        expect(root.props().color).toBe("primary");
        expect(root.props().hoverMode).toBe("darken");

        expect(styledClickable.props().iconColor).toBe("tomato");
        expect(styledTypography.props().hoverMode).toBe("darken");
        expect(styledIcon.props().position).toEqual("left");
    });
});
