/* eslint-disable no-undef */
import DynamicDropdown, { Option } from "@insite/mobius/DynamicDropdown/DynamicDropdown";
import { colors } from "@insite/mobius/DynamicDropdown/optionsLists";
import FormField from "@insite/mobius/FormField";
import Icon from "@insite/mobius/Icon";
import Link from "@insite/mobius/Link";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import Typography from "@insite/mobius/Typography";
import DisablerContext from "@insite/mobius/utilities/DisablerContext";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { css } from "styled-components";
import baseTheme from "../globals/baseTheme";

const generateOptions = valsArr => valsArr.map(val => ({ optionText: val }));
const colorOptions = generateOptions(colors);

const validateOptions = (root, options) => {
    const presentValues = {};
    root.find(Option).forEach(option => {
        const value = option.getDOMNode().innerHTML;
        presentValues[value] = true;
    });
    options.forEach(c => {
        expect(presentValues[c]).toBe(true);
    });
};

describe("DynamicDropdown", () => {
    let props;
    let mountedWrapper;
    let mountedRootWrapper;
    let disablerValue;
    let theme = baseTheme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <DisablerContext.Provider value={disablerValue}>
                        <DynamicDropdown {...props} />
                    </DisablerContext.Provider>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };
    // Needed to be able to use setProps
    const rootWrapper = () => {
        if (!mountedRootWrapper) {
            mountedRootWrapper = mount(<DynamicDropdown {...props} theme={theme} />);
        }
        return mountedRootWrapper;
    };

    beforeEach(() => {
        props = { options: colorOptions };
        mountedWrapper = undefined;
        mountedRootWrapper = undefined;
    });

    describe("component rendering", () => {
        test("displays a carat icon", () => {
            const root = wrapper();
            expect(root.find(Icon)).toHaveLength(1);
            expect(root.find(Icon).find("[src='ChevronDown']")).toHaveLength(1);
        });
        test("renders all options as passed", () => {
            const root = wrapper();
            root.find("input").simulate("click");
            validateOptions(root, colors);
        });
        test("renders moreOptions if provided", () => {
            props = { options: colorOptions, moreOption: <Link href="www.hat.com">more hats</Link> };
            const root = wrapper();
            root.find("input").simulate("click");
            expect(root.find(Link)).toHaveLength(1);
        });
        test("renders loading spinner if loading", () => {
            props = { options: colorOptions, isLoading: true };
            const root = wrapper();
            root.find("input").simulate("click");
            expect(root.find(LoadingSpinner)).toHaveLength(1);
        });
        test("is rendered as a `FormField`", () => {
            expect(wrapper().find(FormField)).toHaveLength(1);
        });
    });

    describe("functionality", () => {
        test("renders selected item as passed in initial props", () => {
            const selected = "indigo";
            props = { options: colorOptions, selected };
            const root = wrapper();
            root.find("input").simulate("click");
            const selectedRow = root.find('div[value="indigo"]');
            expect(selectedRow).toHaveLength(1);
            expect(selectedRow.prop("aria-selected")).toBe(true);
            expect(selectedRow).toHaveStyleRule("background", "#275AA8");
            expect(selectedRow).toHaveStyleRule("color", "#FFFFFF");
        });
        test("displays 'no options' result if no options from search", () => {
            const root = wrapper();
            root.find("input").simulate("change", { target: { value: "m" } });
            const noOptions = root.find('div[data-id="no-options"]');
            expect(noOptions).toHaveLength(1);
        });
        test("displayed options change as typed input changes", () => {
            const optionArray = ["red", "orangered", "red-blue", "red-purple", "reddish"];
            props = { options: generateOptions(optionArray) };
            const root = wrapper();
            root.find("input").simulate("change", { target: { value: "red" } });
            validateOptions(root, optionArray);
            root.find("input").simulate("change", { target: { value: "red-" } });
            validateOptions(root, ["red-blue", "red-purple"]);
            root.find("input").simulate("change", { target: { value: "redd" } });
            validateOptions(root, ["reddish"]);
        });
        test("selected option is visible as non-placeholder text", () => {
            const selected = "indigo";
            props = { options: colorOptions, selected };
            const root = wrapper();
            expect(root.find("input").prop("placeholder")).toBe("");
            expect(root.find(Typography).getDOMNode().innerHTML).toBe("indigo");
        });
        describe("is appropriately disabled", () => {
            test("if DisablerContext is true", () => {
                disablerValue = { disable: true };
                props = { options: colorOptions, selected: "indigo" };
                expect(wrapper().find("input").prop("disabled")).toBe(true);
            });
            test("if DisablerContext is false and disabled is true", () => {
                disablerValue = { disable: false };
                props = { options: colorOptions, selected: "indigo", disabled: true };
                expect(wrapper().find("input").prop("disabled")).toBe(true);
            });
            test("if DisablerContext is false and disabled is false", () => {
                disablerValue = { disable: false };
                props = { options: colorOptions, selected: "indigo" };
                expect(wrapper().find("input").prop("disabled")).toBe(false);
            });
        });

        test("Displayed value changes if props change", () => {
            props = { options: colorOptions, selected: "red" };
            const root = rootWrapper();

            expect(root.find("input").prop("placeholder")).toBe("");
            expect(root.find(Typography).getDOMNode().innerHTML).toBe("red");

            root.setProps({ ...props, selected: "blue" });
            expect(root.find(Typography).getDOMNode().innerHTML).toBe("blue");
        });

        describe("Event Handlers", () => {
            test("onSelectionChange is called on selection change", () => {
                const mockOnSelectionChange = jest.fn();

                props = { options: colorOptions, onSelectionChange: mockOnSelectionChange };

                const root = rootWrapper();
                root.find("input").simulate("click");
                root.find('div[value="red"]').simulate("click");

                expect(mockOnSelectionChange.mock.calls.length).toBe(1);
            });
            test("onInputChange is called on input change", () => {
                const mockOnInputChange = jest.fn();

                props = { options: colorOptions, onInputChange: mockOnInputChange };

                const root = rootWrapper();
                root.find("input").simulate("change", { target: { value: "red" } });

                expect(mockOnInputChange.mock.calls.length).toBe(1);
            });
            test("onClose is called on close", () => {
                const mockOnClose = jest.fn();

                props = { options: colorOptions, onClose: mockOnClose };

                const root = rootWrapper();
                root.find("input").simulate("click");
                root.find("input").simulate("click");

                expect(mockOnClose.mock.calls.length).toBe(1);
            });
            test("onOpen is called on open", () => {
                const mockOnOpen = jest.fn();

                props = { options: colorOptions, onOpen: mockOnOpen };

                const root = rootWrapper();
                root.find("input").simulate("click");

                expect(mockOnOpen.mock.calls.length).toBe(1);
            });
        });
    });

    describe("accessibility considerations", () => {
        describe("dom elements", () => {
            test("aria-expanded appropriate to expanded state", () => {
                const root = wrapper();
                expect(root.find('div[role="combobox"]').prop("aria-expanded")).toBe(false);
                root.find("input").simulate("click");
                expect(root.find('div[role="combobox"]').prop("aria-expanded")).toBe(true);
            });
            test("renders an input with role `searchbox`", () => {
                expect(wrapper().find("input").prop("role")).toBe("searchbox");
            });
            test("input wrapped in a `combobox` role", () => {
                expect(wrapper().find('[role="combobox"]').find("input")).toHaveLength(1);
            });
            test("list of options is ul with role `listbox`", () => {
                const root = wrapper();
                root.find("input").simulate("click");
                expect(root.find("ul").prop("role")).toBe("listbox");
            });
        });
        describe("keyboard interaction", () => {
            // Was unable to get the keyboard event to dispatch through the window
            // test("arrow key focuses options", () => {});
            //     test('enter selects item and closes select', () => {
            //     });
            //     describe('implicit selection', () => {
            //         test('if exact match and no selected item, enter selects', () => {
            //         });
            //         test('if exact match and no selected item, tab selects', () => {
            //         });
            //         test('if single non-disabled result and no selected item, tab selects', () => {
            //         });
            //         test('if single non-disabled result and no selected item, enter selects', () => {
            //         });
            //     });
        });
    });

    const withProps = () => {
        const builder = {
            withCssColor(value) {
                const theCss = css`
                    color: ${value};
                `;
                props.cssOverrides = {
                    option: theCss,
                    dropdownWrapper: theCss,
                    list: theCss,
                    moreOption: theCss,
                    noOptions: theCss,
                    selectedText: theCss,
                };
                return this;
            },

            withMergeCss(isMergeCss) {
                props.mergeCss = isMergeCss;
                return this;
            },
        };
        return builder;
    };

    const withTheme = () => {
        theme = {
            dynamicDropdown: {
                defaultProps: {},
            },
        };
        const builder = {
            withCssBgColor(bgColor) {
                const theCss = css`
                    background-color: ${bgColor};
                `;

                theme.dynamicDropdown.defaultProps.cssOverrides = {
                    option: theCss,
                    dropdownWrapper: theCss,
                    list: theCss,
                    moreOption: theCss,
                    noOptions: theCss,
                    selectedText: theCss,
                };

                return this;
            },
            withMergeCss(isMergeCss) {
                theme.dynamicDropdown.defaultProps.mergeCss = isMergeCss;
                return this;
            },
        };
        return builder;
    };

    function expectOptionToHaveStyleRule(property, value) {
        expect(wrapper().find(Option)).toHaveStyleRule(property, value);
    }

    function openOptions() {
        const root = wrapper();
        root.find("input").simulate("click");
    }

    describe("Merge Css", () => {
        test("No merge if not specified", () => {
            withProps().withCssColor("red").withMergeCss(false);
            withTheme().withCssBgColor("violet").withMergeCss(false);

            openOptions();
            expectOptionToHaveStyleRule("color", "red");
            expectOptionToHaveStyleRule("background-color", undefined);
        });

        test("No merge if component does not specify", () => {
            withProps().withCssColor("red").withMergeCss(false);
            withTheme().withCssBgColor("violet").withMergeCss(true);

            openOptions();
            expectOptionToHaveStyleRule("color", "red");
            expectOptionToHaveStyleRule("background-color", undefined);
        });
        test("Merge when theme says so", () => {
            withProps().withCssColor("red");
            withTheme().withCssBgColor("violet").withMergeCss(true);

            openOptions();
            expectOptionToHaveStyleRule("color", "red");
            expectOptionToHaveStyleRule("background-color", "violet");
        });
        test("Merge if component says so", () => {
            withProps().withCssColor("red").withMergeCss(true);
            withTheme().withCssBgColor("violet").withMergeCss(false);

            openOptions();
            expectOptionToHaveStyleRule("color", "red");
            expectOptionToHaveStyleRule("background-color", "violet");
        });
    });
    describe("Background Color Prop", () => {
        test("Background color present in FormField", () => {
            props = {
                options: colorOptions,
                moreOption: <Link href="www.hat.com">more hats</Link>,
                backgroundColor: "green",
            };

            expect(wrapper().find(FormField).props().backgroundColor).toEqual("green");
        });
    });
});
