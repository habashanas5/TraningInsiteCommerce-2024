import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Page, { PageStyle } from "./Page";
import Button from "../Button";
import { css } from "styled-components";

describe("Page", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Page {...props}>
                        <Button>Test Button</Button>
                    </Page>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("renders a main by default", () => {
        const root = wrapper().find(Page).getDOMNode();
        expect(root instanceof HTMLElement).toBe(true);
    });

    test("Default Props", () => {
        const root = wrapper().find(Page);

        expect(root.props().background).toBe("common.background");
        expect(root.props().padding).toBe(15);
        expect(root.props().fullWidth).toEqual(expect.arrayContaining([false, false, false, false, false]));
    });

    test("Props passed to component", () => {
        props = {
            background: "tomato",
        };
        const root = wrapper().find(Page);

        expect(root).toHaveStyleRule("background", "tomato");
    });

    test("CSS Prop", () => {
        props = {
            css: css`
                color: tomato;
            `,
        };

        const root = wrapper().find(Page);
        expect(root).toHaveStyleRule("color", "tomato");
    });

    test("themeMod property on Page Component", () => {
        props = {
            themeMod: {
                button: {
                    primary: {
                        buttonType: "outline",
                    },
                },
            },
        };

        const root = wrapper().find(Page);
        expect(root.props().themeMod.button.primary.buttonType).toBe("outline");
    });

    test("button styles inside Page Component", () => {
        props = {
            themeMod: {
                button: {
                    primary: {
                        css: css`
                            background: #fff;
                        `,
                    },
                },
            },
        };
        const buttonComponent = wrapper().find(Button);
        expect(buttonComponent).toHaveStyleRule("background", "#fff");
    });
});
