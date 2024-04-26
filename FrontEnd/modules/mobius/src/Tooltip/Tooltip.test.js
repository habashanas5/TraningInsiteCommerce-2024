import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Link from "../Link";
import Tooltip from "./Tooltip";
import Typography from "../Typography";
import Clickable from "../Clickable";
import Icon from "../Icon";
import baseTheme from "../globals/baseTheme";

const themeGenerator = defaultProps => ({
    ...baseTheme,
    tooltip: { defaultProps },
});

describe("Tooltip", () => {
    let props;
    let theme;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Tooltip {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        theme = {};
        mountedWrapper = undefined;
    });

    test("renders a custom triggerComponent if provided", () => {
        const triggerComponent = <Link as="span">trigger</Link>;
        props = { text: "hi", triggerComponent };
        expect(wrapper().find(Link)).toHaveLength(1);
    });

    describe("interactive behavior", () => {
        test("adds tooltip to dom on click", () => {
            const text = "words and more words";
            props = { text };
            const root = wrapper();
            root.find("button").first().simulate("click");
            expect(root.find(Typography).text()).toContain(text);
        });

        test("closes tooltip on click outside", () => {
            const fn = jest.fn();
            const documentEvents = {};
            document.addEventListener = jest.fn((event, callback) => {
                documentEvents[event] = callback;
            });
            const text = "hasty pasty prince";
            props = { text, onClose: fn };
            const root = wrapper();
            expect(root.find(Typography)).toHaveLength(0);
            root.find("button").first().simulate("click");
            expect(root.find(Tooltip).find(Typography).text()).toContain(text);
            documentEvents.mousedown();
            expect(fn).toHaveBeenCalled();
        });

        describe("keyboard", () => {
            test("adds tooltip to dom on enter", () => {
                const text = "words and more words";
                props = { text };
                const root = wrapper();
                root.find("button").first().simulate("keyDown", {
                    keyCode: 13,
                    which: 13,
                    key: "enter",
                });
                expect(root.find(Typography).text()).toContain(text);
            });
            test("closes tooltip on escape", () => {
                const text = "some other words";
                props = { text };
                const root = wrapper();
                root.find("button").first().simulate("keyDown", {
                    keyCode: 13,
                    which: 13,
                    key: "enter",
                });
                expect(root.find(Typography).text()).toContain(text);
                root.find("button").first().simulate("keyDown", {
                    keyCode: 27,
                    which: 27,
                    key: "escape",
                });
                expect(root.find(Typography)).toHaveLength(0);
            });
        });
    });

    describe("appropriately applies theme overrides", () => {
        describe("css overrides", () => {
            test("instance with no theme applies instance", () => {
                props = {
                    text: "hat",
                    cssOverrides: {
                        tooltipWrapper: "background: red;",
                        tooltipBody: "border: 5px solid deeppink;",
                    },
                };
                const root = wrapper();
                root.find("button").first().simulate("click");
                expect(root.find(Tooltip)).toHaveStyleRule("background", "red");
                expect(root.find('[data-id="tooltipBody"]')).toHaveStyleRule("border", "5px solid deeppink");
            });
            test("theme with no instance applies theme", () => {
                props = { text: "hat" };
                theme = themeGenerator({ cssOverrides: { tooltipClickable: "color: blue;" } });
                expect(wrapper().find(Clickable)).toHaveStyleRule("color", "blue");
            });
            test("theme and instance applies instance", () => {
                props = {
                    text: "hat",
                    cssOverrides: {
                        tooltipWrapper: "border: 1px solid green;",
                        tooltipContainer: "color: blue;",
                    },
                };
                theme = themeGenerator({
                    cssOverrides: {
                        tooltipWrapper: "border: 3px dashed red;",
                        tooltipClickable: "display: block;",
                        tooltipContainer: "color: orange;",
                    },
                });
                const root = wrapper();
                root.find("button").first().simulate("click");
                expect(root.find(Tooltip)).toHaveStyleRule("border", "1px solid green");
                expect(root.find(Tooltip)).not.toHaveStyleRule("border", "3px dashed blue");
                expect(root.find(Clickable)).toHaveStyleRule("display", "block");
                expect(root.find('[data-id="tooltipContainer"]')).toHaveStyleRule("color", "blue");
            });
        });
        describe("typographyProps", () => {
            test("instance with no theme applies instance", () => {
                props = { text: "hiya", typographyProps: { weight: 800 } };
                const root = wrapper();
                root.find("button").first().simulate("click");
                expect(root.find(Typography)).toHaveStyleRule("font-weight", "800");
            });
            test("theme with no instance applies theme", () => {
                props = { text: "hiya" };
                theme = themeGenerator({ typographyProps: { italic: true } });
                const root = wrapper();
                root.find("button").first().simulate("click");
                expect(root.find(Typography)).toHaveStyleRule("font-style", "italic");
            });
            test("theme and instance applies instance", () => {
                theme = themeGenerator({ typographyProps: { weight: 500, italic: true } });
                props = { text: "hiya", typographyProps: { weight: 800 } };
                const root = wrapper();
                root.find("button").first().simulate("click");
                expect(root.find(Typography)).toHaveStyleRule("font-weight", "800");
                expect(root.find(Typography)).toHaveStyleRule("font-style", "italic");
                expect(root.find(Typography)).not.toHaveStyleRule("font-weight", "500");
            });
        });
        describe("iconProps", () => {
            test("instance with no theme applies instance", () => {
                props = { text: "human being", iconProps: { color: "#efefef" } };
                setTimeout(() => {
                    expect(wrapper().find(Icon)).toHaveStyleRule("color", "#efefef");
                }, 200);
            });
            test("theme with no instance applies theme", () => {
                props = { text: "human being" };
                theme = themeGenerator({ iconProps: { size: 100 } });
                const root = wrapper();
                setTimeout(() => {
                    expect(root.find(Icon)).toHaveStyleRule("height", "100px");
                    expect(root.find(Icon)).toHaveStyleRule("width", "100px");
                }, 200);
            });
            test("theme and instance applies instance", () => {
                props = { text: "human being", iconProps: { color: "#efefef" } };
                theme = themeGenerator({ iconProps: { size: 100, color: "blue" } });
                const root = wrapper();
                console.log(root.find(Icon).debug());
                setTimeout(() => {
                    expect(root.find(Icon)).toHaveStyleRule("height", "100px");
                    expect(root.find(Icon)).toHaveStyleRule("width", "100px");
                    expect(root.find(Icon)).toHaveStyleRule("color", "#efefef");
                    expect(root.find(Icon)).not.toHaveStyleRule("color", "blue");
                }, 200);
            });
        });
    });
});
