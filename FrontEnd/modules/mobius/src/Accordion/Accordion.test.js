import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Accordion, { AccordionStyle } from "./Accordion";
import AccordionSection from "../AccordionSection";
import { css } from "styled-components";

describe("Accordion", () => {
    let props;
    let sectionProps;
    let mountedWrapper;
    let theme = {};
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Accordion {...props}>
                        <AccordionSection {...sectionProps} />
                    </Accordion>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    const withProps = () => {
        props = {
            css: "",
        };
        const builder = {
            withBackgroundCss(color) {
                props.css = css`
                    background: ${color};
                `;
                return this;
            },
            withMergeCss(isMerge) {
                props.mergeCss = isMerge;
                return this;
            },
        };
        return builder;
    };

    const withTheme = () => {
        theme = {
            accordion: {
                defaultProps: {
                    css: "",
                    mergeCss: false,
                },
            },
        };
        const builder = {
            withColorCss(color) {
                theme.accordion.defaultProps.css = css`
                    color: ${color};
                `;
                return this;
            },

            withMergeCss(isMerge) {
                theme.accordion.defaultProps.mergeCss = isMerge;
                return this;
            },
        };

        return builder;
    };

    beforeEach(() => {
        props = { headingLevel: 1 };
        sectionProps = { title: "title" };
        mountedWrapper = undefined;
    });

    test("renders as a dl by default", () => {
        const root = wrapper().find(Accordion).getDOMNode();
        expect(root).toBeInstanceOf(HTMLDListElement);
    });
    test("Header prop of 1", () => {
        expect(wrapper().find(Accordion).props().headingLevel).toEqual(1);
    });

    test("AccordionStyle component styles", () => {
        const accordionStyleComponent = wrapper().find(AccordionStyle);
        expect(accordionStyleComponent).toHaveStyleRule("margin", "0");
    });

    describe("mergeCss functionality", () => {
        test("No merge if not specified", () => {
            withProps().withBackgroundCss("blue").withMergeCss(false);
            withTheme().withColorCss("black").withMergeCss(false);

            const root = wrapper().find(Accordion);
            expect(root).toHaveStyleRule("background", "blue");
            expect(root).toHaveStyleRule("color", undefined);
        });

        test("No merge if component does not specify", () => {
            withProps().withBackgroundCss("blue").withMergeCss(false);
            withTheme().withColorCss("black").withMergeCss(true);

            const root = wrapper().find(Accordion);
            expect(root).toHaveStyleRule("background", "blue");
            expect(root).toHaveStyleRule("color", undefined);
        });

        test("merge when theme says so", () => {
            withProps().withBackgroundCss("blue");
            withTheme().withColorCss("black").withMergeCss(true);

            const root = wrapper().find(Accordion);
            expect(root).toHaveStyleRule("background", "blue");
            expect(root).toHaveStyleRule("color", "black");
        });

        test("Merge if component says so", () => {
            withProps().withBackgroundCss("blue").withMergeCss(true);
            withTheme().withColorCss("black").withMergeCss(false);

            const root = wrapper().find(Accordion);
            expect(root).toHaveStyleRule("background", "blue");
            expect(root).toHaveStyleRule("color", "black");
        });
    });
});
