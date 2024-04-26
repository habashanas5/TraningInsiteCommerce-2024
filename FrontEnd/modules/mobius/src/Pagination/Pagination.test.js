import Button from "@insite/mobius/Button";
import FormField from "@insite/mobius/FormField";
import baseTheme from "@insite/mobius/globals/baseTheme";
import Pagination from "@insite/mobius/Pagination/Pagination";
import Select from "@insite/mobius/Select";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";

const themeGenerator = defaultProps => ({
    ...baseTheme,
    pagination: { defaultProps },
});

const propsBase = {
    resultsPerPage: 10,
    resultsCount: 795,
    currentPage: 1,
    resultsPerPageLabel: "Results per page:",
    resultsPerPageOptions: [10, 20, 50, 100],
    selectProps: {},
    buttonProps: {},
    onChangeResultsPerPage: value => value,
    onChangePage: pageIndex => pageIndex + 1,
    cssOverrides: { linkList: "background: red;" },
};

const selectModifier = "select:not(.react-datetime-picker__inputGroup__input)";

describe("Pagination", () => {
    let props;
    let theme;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Pagination {...props} key="hat" />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        theme = baseTheme;
        props = propsBase;
        mountedWrapper = undefined;
    });

    describe("render html elements", () => {
        describe("pagination list", () => {
            test("a nav by default", () => {
                const root = wrapper().find("nav");
                expect(root).toHaveLength(1);
            });
            test("a ul by default", () => {
                const root = wrapper().find("ul");
                expect(root).toHaveLength(1);
            });
            test("a li children for each possible node", () => {
                const root = wrapper().find("li");
                expect(root).toHaveLength(9);
            });
            test("a Button for each possible node", () => {
                const root = wrapper().find(Button);
                expect(root).toHaveLength(9);
            });
            test("only renders a max number of buttons for the number of pages that exist", () => {
                props = {
                    ...propsBase,
                    resultsPerPage: 100,
                    resultsCount: 98,
                };
                const root = wrapper().find(Button);
                expect(root).toHaveLength(5);
            });
        });
        describe("select", () => {
            test("renders options passed", () => {
                wrapper()
                    .find("option")
                    .forEach((option, i) => {
                        expect(parseInt(option.getDOMNode().innerHTML, 10)).toBe(propsBase.resultsPerPageOptions[i]);
                    });
            });
            test("with default number of results", () => {
                expect(wrapper().find("select").prop("value")).toEqual(10);
            });
            test("custom label text", () => {
                const label = "number of invoices per page";
                props = {
                    ...propsBase,
                    resultsPerPageLabel: label,
                };
                expect(wrapper().find("label").getDOMNode().innerHTML).toEqual(label);
            });
        });
    });

    describe("functionality", () => {
        test("blurring display X per page select calls onChangeRowPerPage", () => {
            const fn = jest.fn();
            props = {
                ...propsBase,
                onChangeResultsPerPage: fn,
            };
            const changeEvent = {
                currentTarget: {
                    value: 10,
                },
            };
            wrapper().find(Select).prop("onChange")(changeEvent);
            expect(fn).toHaveBeenCalledWith(changeEvent, 10);
        });
        test("calls onclick with appropriate argument for each button, or not at all for current page 'button'", () => {
            const fn = jest.fn();
            props = {
                ...propsBase,
                currentPage: 2,
                onChangePage: fn,
            };
            const buttons = wrapper().find(Button);
            buttons.forEach(button => {
                const buttonText = button.text();
                if (buttonText === "First page") {
                    button.simulate("click");
                    expect(fn).toHaveBeenCalledWith(1);
                } else if (buttonText === "Previous page") {
                    button.simulate("click");
                    expect(fn).toHaveBeenCalledWith(1);
                } else if (buttonText === "Page 1") {
                    button.simulate("click");
                    expect(fn).toHaveBeenCalledWith(1);
                } else if (buttonText === "Page 2") {
                    button.simulate("click");
                    expect(fn).not.toHaveBeenCalledWith(2);
                } else if (buttonText === "Page 3") {
                    button.simulate("click");
                    expect(fn).toHaveBeenCalledWith(3);
                } else if (buttonText === "Page 4") {
                    button.simulate("click");
                    expect(fn).toHaveBeenCalledWith(4);
                } else if (buttonText === "Next page") {
                    button.simulate("click");
                    expect(fn).toHaveBeenCalledWith(3);
                } else if (buttonText === "Last page") {
                    button.simulate("click");
                    expect(fn).toHaveBeenCalledWith(80);
                }
            });
        });

        describe("disables buttons that should be disabled", () => {
            test("first and back disabled from page 1", () => {
                const fn = jest.fn();
                props = {
                    ...propsBase,
                    onChangePage: fn,
                };
                const buttons = wrapper().find(Button);
                buttons.forEach(button => {
                    const buttonText = button.text();
                    if (buttonText === "First page") {
                        button.simulate("click");
                        expect(fn).not.toHaveBeenCalledWith(0);
                        expect(button.props().disabled).toBe(true);
                    } else if (buttonText === "Previous page") {
                        button.simulate("click");
                        expect(fn).not.toHaveBeenCalledWith(0);
                        expect(button.props().disabled).toBe(true);
                    }
                });
            });
            test("last and forward disabled from final page", () => {
                const fn = jest.fn();
                props = {
                    ...propsBase,
                    onChangePage: fn,
                    currentPage: 80,
                };
                const buttons = wrapper().find(Button);
                buttons.forEach(button => {
                    const buttonText = button.text();
                    if (buttonText === "Next page") {
                        button.simulate("click");
                        expect(fn).not.toHaveBeenCalledWith(80);
                        expect(button.props().disabled).toBe(true);
                    } else if (buttonText === "Last page") {
                        button.simulate("click");
                        expect(fn).not.toHaveBeenCalledWith(80);
                        expect(button.props().disabled).toBe(true);
                    }
                });
            });
        });
    });

    describe("styling", () => {
        test("buttons display as expected", () => {
            props = {
                ...propsBase,
                resultsPerPage: 100,
                resultsCount: 98,
            };
            const buttons = wrapper().find(Button);
            buttons.forEach(button => {
                const buttonText = button.text();
                if (buttonText === "Current Page") {
                    expect(button).toHaveStyleRule("background", "#275AA8");
                    expect(button).toHaveStyleRule("color", "#FFFFFF");
                }
            });
        });
    });

    describe("appropriately applies theme overrides", () => {
        describe("css overrides", () => {
            test("instance with no theme applies instance", () => {
                props = {
                    ...propsBase,
                    cssOverrides: {
                        linkList: "background: red;",
                    },
                };
                expect(wrapper().find("nav")).toHaveStyleRule("background", "red");
            });
            test("theme with no instance applies theme", () => {
                theme = themeGenerator({ cssOverrides: { pagination: "color: azure;" } });
                expect(wrapper().find(Pagination)).toHaveStyleRule("color", "azure");
            });
            test("theme and instance applies instance", () => {
                props = {
                    ...propsBase,
                    cssOverrides: {
                        pagination: "border: 1px dashed deeppink",
                        linkList: "display: inline-block;",
                    },
                };
                theme = themeGenerator({ cssOverrides: { pagination: "border: 3px solid coral;" } });
                const root = wrapper();
                expect(root.find("nav")).toHaveStyleRule("display", "inline-block");
                expect(root.find(Pagination)).not.toHaveStyleRule("border", "3px solid coral");
                expect(root.find(Pagination)).toHaveStyleRule("border", "1px dashed deeppink");
            });
        });
        describe("buttonProps", () => {
            test("instance with no theme applies instance", () => {
                props = {
                    ...propsBase,
                    buttonProps: {
                        sizeVariant: "large",
                    },
                };
                expect(wrapper().find(Button)).toHaveStyleRule("min-height", "48px");
            });
            test("theme with no instance applies theme", () => {
                theme = themeGenerator({ buttonProps: { shadow: true } });
                expect(wrapper().find(Button)).toHaveStyleRule("box-shadow", baseTheme.shadows[1]);
            });
            test("theme and instance applies instance", () => {
                theme = themeGenerator({ buttonProps: { shape: "pill", sizeVariant: "large" } });
                props = {
                    ...propsBase,
                    buttonProps: {
                        sizeVariant: "medium",
                    },
                };
                const root = wrapper().find(Button);
                expect(root).toHaveStyleRule("min-height", "40px");
                expect(root).not.toHaveStyleRule("min-height", "48px");
                expect(root).toHaveStyleRule("border-radius", "20px");
            });
        });
        describe("selectProps", () => {
            test("instance with no theme applies instance", () => {
                props = {
                    ...propsBase,
                    selectProps: {
                        border: "rectangle",
                    },
                };
                expect(wrapper().find(FormField)).toHaveStyleRule("border", "1px solid #CCCCCC", {
                    modifier: selectModifier,
                });
            });
            test("theme with no instance applies theme", () => {
                theme = themeGenerator({ selectProps: { sizeVariant: "small" } });
                expect(wrapper().find(FormField)).toHaveStyleRule("height", "30px", {
                    modifier: "select",
                });
            });
            test("theme and instance applies instance", () => {
                props = {
                    ...propsBase,
                    selectProps: {
                        border: "rectangle",
                    },
                };
                theme = themeGenerator({ selectProps: { sizeVariant: "small", border: "underline" } });
                const root = wrapper().find(FormField);
                expect(root).toHaveStyleRule("height", "30px", { modifier: "select" });
                expect(root).not.toHaveStyleRule("border-style", "solid", { modifier: selectModifier });
                expect(root).not.toHaveStyleRule("border-width", "0 0 1px 0", { modifier: selectModifier });
                expect(root).not.toHaveStyleRule("border-color", "#CCCCCC", { modifier: selectModifier });
                expect(root).toHaveStyleRule("border", "1px solid #CCCCCC", { modifier: selectModifier });
            });
        });
    });
});
