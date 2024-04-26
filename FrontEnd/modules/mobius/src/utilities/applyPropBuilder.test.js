/**
 * @jest-environment node
 */
import applyPropBuilder from "./applyPropBuilder";

const propsGenerator = ({ instanceProp = undefined, componentProp = undefined, categoryProp = undefined }) => ({
    border: instanceProp,
    theme: {
        textField: { defaultProps: { border: componentProp } },
        formField: { defaultProps: { border: categoryProp } },
    },
});

describe("applyPropBuilder", () => {
    test("returns two functions", () => {
        const { applyProp, spreadProps } = applyPropBuilder({}, { component: "textField", category: "formField" });
        expect(applyProp).toBeInstanceOf(Function);
        expect(spreadProps).toBeInstanceOf(Function);
    });

    describe("applyProp", () => {
        describe("returns instance prop if present", () => {
            test("and no inferior props", () => {
                const props = propsGenerator({ instanceProp: "underline" });
                const { applyProp } = applyPropBuilder(props, { component: "textField", category: "formField" });
                expect(applyProp("border")).toEqual("underline");
            });

            test("with inferior prop provided", () => {
                const props = propsGenerator({
                    instanceProp: "rounded",
                    categoryProp: "underline",
                    componentProp: "rectangle",
                });
                const { applyProp } = applyPropBuilder(props, { component: "textField", category: "formField" });
                expect(applyProp("border")).toEqual("rounded");
            });
        });

        describe("returns theme component default prop if present", () => {
            test("and no superior or inferior props", () => {
                const props = propsGenerator({ componentProp: "rectangle" });
                const { applyProp } = applyPropBuilder(props, { component: "textField", category: "formField" });
                expect(applyProp("border")).toEqual("rectangle");
            });

            test("and inferior prop provided", () => {
                const props = propsGenerator({ componentProp: "rounded", categoryProp: "underline" });
                const { applyProp } = applyPropBuilder(props, { component: "textField", category: "formField" });
                expect(applyProp("border", "rectangle")).toEqual("rounded");
            });
        });

        test("returns theme category default prop if present with no superior props", () => {
            const props = propsGenerator({ categoryProp: "rectangle" });
            const { applyProp } = applyPropBuilder(props, { component: "textField", category: "formField" });
            expect(applyProp("border", "underline")).toEqual("rectangle");
        });

        test("returns theme category group prop if propkey provided", () => {
            const props = {
                theme: {
                    checkbox: { defaultProps: {}, groupDefaultProps: {} },
                    fieldset: {
                        defaultProps: {},
                        groupDefaultProps: {
                            sizeVariant: "default",
                        },
                    },
                },
            };
            const { applyProp } = applyPropBuilder(props, {
                component: "checkbox",
                category: "fieldset",
                propKey: "groupDefaultProps",
            });
            expect(applyProp("sizeVariant")).toEqual("default");
        });

        test("returns fallback if passed and no superior prop", () => {
            const props = propsGenerator({ categoryProp: "rectangle" });
            const { applyProp } = applyPropBuilder(props, { component: "textField", category: "formField" });
            expect(applyProp("sizeVariant", "small")).toEqual("small");
        });

        test("returns undefined if no superior prop and no default", () => {
            const props = propsGenerator({ categoryProp: "rectangle" });
            const { applyProp } = applyPropBuilder(props, { component: "textField", category: "formField" });
            expect(applyProp("sizeVariant")).toEqual(undefined);
        });
    });

    describe("spreadProp", () => {
        test("returns an empty object if no relevant objects in props", () => {
            const props = {};
            const { spreadProps } = applyPropBuilder(props, { component: "select", category: "formField" });
            expect(spreadProps("errorProps")).toEqual({});
        });

        test("provided values in instance prop override cateory and component props", () => {
            const props = {
                errorProps: { color: "blue", weight: 600 },
                theme: {
                    select: { defaultProps: { errorProps: { color: "red" } } },
                    formField: { defaultProps: { errorProps: { weight: 400 } } },
                },
            };
            const { spreadProps } = applyPropBuilder(props, { component: "select", category: "formField" });
            expect(spreadProps("errorProps")).toEqual({ color: "blue", weight: 600 });
        });

        test("expected object key value pairs are present", () => {
            const props = {
                typographyProps: { color: "grey", underline: false },
                theme: {
                    radio: { defaultProps: { typographyProps: { color: "red", ellipsis: true } } },
                    fieldSet: { defaultProps: { typographyProps: { ellipsis: false, size: 14, underline: true } } },
                },
            };
            const { spreadProps } = applyPropBuilder(props, { component: "radio", category: "fieldSet" });
            expect(spreadProps("typographyProps")).toEqual({
                color: "grey",
                ellipsis: true,
                size: 14,
                underline: false,
            });
        });
    });
});
