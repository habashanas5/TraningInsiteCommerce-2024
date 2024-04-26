import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Accordion from "../Accordion";
import AccordionSection from "./AccordionSection";
import AccordionSectionHeader from "./AccordionSectionHeader";
import AccordionSectionPanel from "./AccordionSectionPanel";

import { css } from "styled-components";

describe("AccordionSection", () => {
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
            headerProps: {},
            panelProps: {},
        };

        const builder = {
            withBackgroundCss(color) {
                props.headerProps.css = css`
                    background-color: ${color};
                `;
                props.panelProps.css = css`
                    background-color: ${color};
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
                defaultProps: {},
                sectionDefaultProps: {
                    panelProps: {},
                    headerProps: {},
                },
            },
        };
        const builder = {
            withColorCss(color) {
                theme.accordion.sectionDefaultProps.panelProps.css = css`
                    color: ${color};
                `;
                theme.accordion.sectionDefaultProps.headerProps.css = css`
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

    test("renders a dt and dd by default", () => {
        const html = wrapper().find(Accordion).getDOMNode().innerHTML;
        expect(html).toEqual(expect.stringMatching(/^<dt.+dd>$/));
    });
    describe("Merge css functionality", () => {
        test.only("No merge if specified", () => {
            withTheme().withColorCss("blue").withMergeCss(false);
            withProps().withBackgroundCss("black").withMergeCss(false);

            expect(wrapper().find(AccordionSectionHeader)).toHaveStyleRule("color", "blue");
            expect(wrapper().find(AccordionSectionHeader)).toHaveStyleRule("background-color", undefined);

            expect(wrapper().find(AccordionSectionPanel)).toHaveStyleRule("color", "blue");
            expect(wrapper().find(AccordionSectionPanel)).toHaveStyleRule("background-color", undefined);
        });
        test("No merge if component does not specify", () => {
            withTheme().withColorCss("blue").withMergeCss(false);
            withProps().withBackgroundCss("black").withMergeCss(true);

            expect(wrapper().find(AccordionSectionHeader)).toHaveStyleRule("color", "blue");
            expect(wrapper().find(AccordionSectionHeader)).toHaveStyleRule("background-color", undefined);

            expect(wrapper().find(AccordionSectionPanel)).toHaveStyleRule("color", "blue");
            expect(wrapper().find(AccordionSectionPanel)).toHaveStyleRule("background-color", undefined);
        });
        test("Merge when theme says so", () => {
            withTheme().withColorCss("blue");
            withProps().withBackgroundCss("black").withMergeCss(true);

            expect(wrapper().find(AccordionSectionHeader)).toHaveStyleRule("color", "blue");
            expect(wrapper().find(AccordionSectionHeader)).toHaveStyleRule("background-color", "black");

            expect(wrapper().find(AccordionSectionPanel)).toHaveStyleRule("color", "blue");
            expect(wrapper().find(AccordionSectionPanel)).toHaveStyleRule("background-color", "black");
        });
        test("Merge if component says so", () => {
            withTheme().withColorCss("blue").withMergeCss(true);
            withProps().withBackgroundCss("black").withMergeCss(false);

            expect(wrapper().find(AccordionSectionHeader)).toHaveStyleRule("color", "blue");
            expect(wrapper().find(AccordionSectionHeader)).toHaveStyleRule("background-color", "black");

            expect(wrapper().find(AccordionSectionPanel)).toHaveStyleRule("color", "blue");
            expect(wrapper().find(AccordionSectionPanel)).toHaveStyleRule("background-color", "black");
        });
    });
});
