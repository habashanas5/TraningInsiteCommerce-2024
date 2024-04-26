import "jest-styled-components";
import React from "react";
import { css } from "styled-components";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Typography from "../Typography";
import Tab from "./Tab";
import baseTheme from "../globals/baseTheme";

const themeGenerator = (themeCss, typographyProps = null) => ({
    ...baseTheme,
    tab: { defaultProps: { css: themeCss, typographyProps } },
});

describe("Tab", () => {
    let props;
    let theme;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme} createGlobalStyle={true}>
                    <Tab headline="hat" tabKey="bloom" {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    describe("differentially applies styles", () => {
        test("selected tab has selected styles", () => {
            props = { selected: true };
            expect(wrapper().find("li")).toHaveStyleRule("border-bottom", "4px solid #363636");
        });
        test("unselected tab does not have selected styles", () => {
            props = { selected: false };
            expect(wrapper().find("li")).toHaveStyleRule("border-bottom", "4px solid transparent");
        });
    });

    describe("appropriately applies theme overrides", () => {
        describe("css overrides", () => {
            test("instance with no theme applies instance", () => {
                props = {
                    css: css`
                        display: flex;
                    `,
                };
                expect(wrapper().find(Tab)).toHaveStyleRule("display", "flex");
            });
            test("theme with no instance applies theme", () => {
                theme = themeGenerator("border: 1px dashed azure;");
                expect(wrapper().find(Tab)).toHaveStyleRule("border", "1px dashed azure");
            });
            test("theme and instance applies instance", () => {
                theme = themeGenerator("border: azure 1px solid; color: blue;");
                props = {
                    css: css`
                        color: purple;
                    `,
                };
                const root = wrapper();
                expect(root.find(Tab)).toHaveStyleRule("color", "purple");
                expect(root.find(Tab)).not.toHaveStyleRule("color", "blue");
                expect(root.find(Tab)).not.toHaveStyleRule("border", "azure 1px solid");
            });
        });
        describe("typographyProps", () => {
            test("instance with no theme applies instance", () => {
                props = { typographyProps: { weight: 800 } };
                expect(wrapper().find(Typography)).toHaveStyleRule("font-weight", "800");
            });
            test("theme with no instance applies theme", () => {
                theme = themeGenerator(null, { italic: true });
                expect(wrapper().find(Typography)).toHaveStyleRule("font-style", "italic");
            });
            test("theme and instance applies instance", () => {
                theme = themeGenerator(null, { weight: 400, italic: true });
                props = { typographyProps: { weight: 800 } };
                const root = wrapper();
                expect(root.find(Typography)).toHaveStyleRule("font-weight", "800");
                expect(root.find(Typography)).not.toHaveStyleRule("font-weight", "400");
                expect(root.find(Typography)).toHaveStyleRule("font-style", "italic");
            });
        });
    });
});
