/* eslint-disable no-undef */
import baseTheme from "@insite/mobius/globals/baseTheme";
import Popover from "@insite/mobius/Popover/Popover";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { css } from "styled-components";

describe("Popover", () => {
    let props;
    let mountedWrapper;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            const input = <input />;

            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    {input}
                    <Popover contentBodyProps={{}} {...props} popoverTrigger={input}>
                        Test
                    </Popover>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        theme = { ...baseTheme };
        props = undefined;
        mountedWrapper = undefined;
    });

    const withProps = () => {
        props = {};
        const builder = {
            withCssColor(color) {
                props.css = css`
                    color: ${color};
                `;
                return this;
            },

            withIsOpen(value) {
                props.isOpen = value;
                return this;
            },
        };
        return builder;
    };

    test("renders with passed css", () => {
        withProps().withCssColor("red").withIsOpen(true);

        expect(wrapper().find("ul")).toHaveStyleRule("color", "red");
    });

    test("isn't visible if not isOpen", () => {
        expect(wrapper().find("ul")).toHaveLength(0);
    });

    test("is visible if isOpen", () => {
        withProps().withIsOpen(true);
        expect(wrapper().find("ul")).toHaveLength(1);
    });

    test("Props passed to component", () => {
        withProps().withIsOpen(true);

        props.contentBodyProps = {
            _height: "400px",
        };

        expect(wrapper().find("ul")).toHaveStyleRule("padding", "0");
        expect(wrapper().find("ul")).toHaveStyleRule("max-height", "400px");
    });
    test("Props passed to component", () => {
        withProps().withIsOpen(true);
        props._height = "400px";

        expect(wrapper().find("ul")).toHaveStyleRule("max-height", "400px");
    });
});
