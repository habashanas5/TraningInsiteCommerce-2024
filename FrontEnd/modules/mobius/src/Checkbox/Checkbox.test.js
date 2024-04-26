import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import Icon from "../Icon";
import ThemeProvider from "../ThemeProvider";
import Typography from "../Typography";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
    let props;
    let theme;
    const label = "Label";
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <Checkbox {...props}>{label}</Checkbox>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("disabled prop leads to disabled checkbox", () => {
        props = { disabled: true };
        const root = wrapper();
        expect(root.find("[data-id='checkbox']").first().prop("disabled")).toBe(true);
    });
    describe("renders component", () => {
        test("renders checkbox label", () => {
            const root = wrapper();
            expect(root.find(Typography)).toHaveLength(1);
            expect(root.find(Typography).getDOMNode().innerHTML).toContain(label);
        });
        describe("default variant", () => {
            test("checked state renders a check icon", () => {
                props = { checked: true };
                const root = wrapper();
                expect(root.find(Icon).first().prop("src")).toBe("Check");
                expect(root.find(Icon)).toHaveLength(1);
            });
            test("indeterminate state renders a bar icon", () => {
                props = { checked: "indeterminate" };
                const root = wrapper();
                expect(root.find(Icon).first().prop("src")).toBe("Minus");
                expect(root.find(Icon)).toHaveLength(1);
            });
        });
        describe("toggle variant", () => {
            test("renders check, fillcircle and x icons", () => {
                props = { variant: "toggle" };
                const root = wrapper();
                expect(root.find(Icon)).toHaveLength(3);
                expect(root.find(Icon).first().prop("src")).toBe("Check");
                expect(root.find(Icon).at(1).prop("src")).toBe("FillCircle");
                expect(root.find(Icon).at(2).prop("src")).toBe("X");
            });
            test("indeterminate state + toggle variant renders a standard checkbox", () => {
                props = { variant: "toggle", checked: "indeterminate" };
                const root = wrapper();
                expect(root.find(Icon)).toHaveLength(1);
                expect(root.find(Icon).first().prop("src")).toBe("Minus");
                expect(root.find(Icon)).not.toHaveLength(3);
            });
        });
    });
    describe("accessibility concerns", () => {
        test("label is associated by ID with input", () => {
            const root = wrapper();
            const label = root.find("label");
            const input = root.find(Icon);
            expect(label.prop("id")).toEqual(input.prop("aria-labelledby"));
            expect(input.prop("id")).toEqual(label.prop("htmlFor"));
        });
        test("disabled prop leads to aria-disabled=true", () => {
            props = { disabled: true };
            expect(wrapper().find(Icon).prop("aria-disabled")).toBe(true);
        });
        test("checked true prop leads to aria-checked=true", () => {
            props = { checked: true };
            expect(wrapper().find(Icon).prop("aria-checked")).toBe(true);
        });
        test("checked indeterminate prop leads to aria-checked=mixed", () => {
            props = { checked: "indeterminate" };
            expect(wrapper().find(Icon).prop("aria-checked")).toBe("mixed");
        });
    });
    describe("component styling", () => {
        test("default size variant is applied", () => {
            expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule("min-width", "16px", {
                modifier: "span[role=checkbox]",
            });
        });
        test("small size variant is applied", () => {
            props = { sizeVariant: "small" };
            expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule("min-width", "12px", {
                modifier: "span[role=checkbox]",
            });
        });
        test("left label is applied", () => {
            props = { labelPosition: "left" };
            expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule("margin-left", "10px");
        });
        test("right label is applied", () => {
            props = { labelPosition: "right" };
            expect(wrapper().find("div[data-id='checkbox']")).not.toHaveStyleRule("margin-left", "10px");
        });
        describe("appropriately applies theme overrides", () => {
            describe("iconProps", () => {
                test("instance with no theme applies instance", () => {
                    props = { iconProps: { src: "Phone" } };
                    expect(wrapper().find(Icon).first().prop("src")).toBe("Phone");
                });
                test("theme with no instance applies theme", () => {
                    theme = { checkbox: { defaultProps: { iconProps: { src: "Facebook" } } } };
                    expect(wrapper().find(Icon).first().prop("src")).toBe("Facebook");
                });
                test("theme and instance applies instance", () => {
                    props = { iconProps: { src: "Phone" } };
                    theme = { checkbox: { defaultProps: { iconProps: { src: "Facebook" } } } };
                    expect(wrapper().find(Icon).first().prop("src")).toBe("Phone");
                    expect(wrapper().find(Icon).first().prop("src")).not.toBe("Facebook");
                });
            });
            describe("indeterminateIconProps", () => {
                test("instance with no theme applies instance", () => {
                    props = { indeterminateIconProps: { src: "Eye" }, checked: "indeterminate" };
                    expect(wrapper().find(Icon).first().prop("src")).toBe("Eye");
                });
                test("theme with no instance applies theme", () => {
                    props = { checked: "indeterminate" };
                    theme = { checkbox: { defaultProps: { indeterminateIconProps: { src: "File" } } } };
                    expect(wrapper().find(Icon).first().prop("src")).toBe("File");
                });
                test("theme and instance applies instance", () => {
                    props = { indeterminateIconProps: { src: "Eye" }, checked: "indeterminate" };
                    theme = { checkbox: { defaultProps: { indeterminateIconProps: { src: "File" } } } };
                    expect(wrapper().find(Icon).first().prop("src")).toBe("Eye");
                    expect(wrapper().find(Icon).first().prop("src")).not.toBe("File");
                });
            });
            describe("indeterminateColor", () => {
                test("instance with no theme applies instance", () => {
                    props = { indeterminateColor: "secondary", checked: "indeterminate" };
                    expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule("background", "secondary", {
                        modifier: 'span[role=checkbox][aria-checked="mixed"]:not([aria-disabled="true"])',
                    });
                });
                test("theme with no instance applies theme", () => {
                    props = { checked: "indeterminate" };
                    theme = { checkbox: { defaultProps: { indeterminateColor: "warning" } } };
                    expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule("background", "warning", {
                        modifier: 'span[role=checkbox][aria-checked="mixed"]:not([aria-disabled="true"])',
                    });
                });
                test("theme and instance applies instance", () => {
                    props = { indeterminateColor: "secondary", checked: "indeterminate" };
                    theme = { checkbox: { defaultProps: { indeterminateColor: "warning" } } };
                    expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule("background", "secondary", {
                        modifier: 'span[role=checkbox][aria-checked="mixed"]:not([aria-disabled="true"])',
                    });
                    expect(wrapper().find("div[data-id='checkbox']")).not.toHaveStyleRule("background", "warning", {
                        modifier: 'span[role=checkbox][aria-checked="mixed"]:not([aria-disabled="true"])',
                    });
                });
            });
            describe("color", () => {
                test("instance with no theme applies instance", () => {
                    props = { color: "danger" };
                    expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule("background", "danger", {
                        modifier: 'span[role=checkbox][aria-checked="true"]:not([aria-disabled="true"])',
                    });
                });
                test("theme with no instance applies theme", () => {
                    theme = { checkbox: { defaultProps: { color: "secondary" } } };
                    expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule("background", "secondary", {
                        modifier: 'span[role=checkbox][aria-checked="true"]:not([aria-disabled="true"])',
                    });
                });
                test("theme and instance applies instance", () => {
                    props = { color: "danger" };
                    theme = { checkbox: { defaultProps: { color: "secondary" } } };
                    expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule("background", "danger", {
                        modifier: 'span[role=checkbox][aria-checked="true"]:not([aria-disabled="true"])',
                    });
                    expect(wrapper().find("div[data-id='checkbox']")).not.toHaveStyleRule("background", "secondary", {
                        modifier: 'span[role=checkbox][aria-checked="true"]:not([aria-disabled="true"])',
                    });
                });
            });
            describe("css", () => {
                test("instance with no theme applies instance", () => {
                    props = { css: "border-bottom: 1px solid rebeccapurple;" };
                    expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule(
                        "border-bottom",
                        "1px solid rebeccapurple",
                    );
                });
                test("theme with no instance applies theme", () => {
                    theme = { checkbox: { defaultProps: { css: "border-bottom: 1px dashed red;" } } };
                    expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule(
                        "border-bottom",
                        "1px dashed red",
                    );
                });
                test("theme and instance applies instance", () => {
                    props = { css: "border-bottom: 1px solid rebeccapurple;" };
                    theme = { checkbox: { defaultProps: { css: "border-bottom: 1px dashed red;" } } };
                    expect(wrapper().find("div[data-id='checkbox']")).toHaveStyleRule(
                        "border-bottom",
                        "1px solid rebeccapurple",
                    );
                    expect(wrapper().find("div[data-id='checkbox']")).not.toHaveStyleRule(
                        "border-bottom",
                        "1px dashed red",
                    );
                });
            });
            describe("typographyProps", () => {
                test("instance with no theme applies instance", () => {
                    props = { typographyProps: { size: "23px" } };
                    expect(wrapper().find(Typography).prop("size")).toBe("23px");
                });
                test("theme with no instance applies theme", () => {
                    theme = { checkbox: { defaultProps: { typographyProps: { size: "14px" } } } };
                    expect(wrapper().find(Typography).prop("size")).toBe("14px");
                });
                test("theme and instance applies instance", () => {
                    props = { typographyProps: { size: "23px" } };
                    theme = { checkbox: { defaultProps: { typographyProps: { size: "14px" } } } };
                    expect(wrapper().find(Typography).prop("size")).toBe("23px");
                    expect(wrapper().find(Typography).prop("size")).not.toBe("14px");
                });
            });
        });
    });

    /**
     * Further tests that would ideally be written for this component, but are challenging to implement
     * for this component given that they rely on browser behavior and state updates not easily managed
     * within Enzyme.
     *
     * test('onchange is called when checked and unchecked', () => {});
     * test('checkbox state can be externally controlled', () => {});
     * test('can be checked and unchecked by enter and space key', () => {});
     */
});
