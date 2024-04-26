/**
 * @jest-environment node
 */
import combineTypographyProps from "./combineTypographyProps";

describe("combineTypographyProps", () => {
    test("returns only defaultProps", () => {
        const defaultProps = { color: "blue", italic: true };
        const typographyProps = combineTypographyProps({
            theme: {},
            defaultProps,
        });
        expect(typographyProps).toEqual(defaultProps);
    });
    test("returns only passedProps", () => {
        const passedProps = { color: "maroon", weight: 500 };
        const typographyProps = combineTypographyProps({ theme: {}, passedProps });
        expect(typographyProps).toEqual(passedProps);
    });
    test("combines defaultProps and passedProps with no variant", () => {
        const passedProps = { color: "maroon", weight: 500 };
        const defaultProps = { ellipsis: true, weight: 800 };
        const typographyProps = combineTypographyProps({ theme: {}, passedProps, defaultProps });
        expect(typographyProps).toEqual({
            ...defaultProps,
            ...passedProps,
        });
    });
    test("combines defaultProps and passedProps with passed variant", () => {
        const passedProps = { color: "maroon", ellipsis: true, variant: "label" };
        const defaultProps = { weight: 400, size: 18 };
        const typographyProps = combineTypographyProps({
            theme: { typography: { label: { size: 43, color: "azure" } } },
            passedProps,
            defaultProps,
        });
        expect(typographyProps).toEqual({
            size: 43, // passed variant `h3` which contains size 18 overrides default prop size 43
            color: "maroon", // passed prop 'color maroon' overrides variant attribute color azure.
            weight: 400, // default prop 400 is applied as it is not overridden
            ellipsis: true, // passed prop ellipsis true is applied as it is not overriden
        });
    });
    test("combines defaultProps and passedProps with default variant", () => {
        const passedProps = { color: "maroon", weight: 500 };
        const defaultProps = {
            weight: 400,
            variant: "h2",
            size: 18,
            ellipsis: true,
        };
        const typographyProps = combineTypographyProps({
            theme: { typography: { h2: { size: 43, color: "rebeccapurple", underline: true } } },
            passedProps,
            defaultProps,
        });
        expect(typographyProps).toEqual({
            color: "maroon", // passedProps overrides typography variant attribute `color: rebeccapurple`
            size: 18, // defaultprops overrides typography variant attribute `size 43`
            weight: 500, // passedprops overrides defaultprops `weight 400`
            ellipsis: true, // defaultprops still apply if not overridden
            underline: true, // variant props apply if not overriden
        });
    });
    test("combines defaultProps and passedProps with both variants", () => {
        const passedProps = { variant: "label" };
        const defaultProps = { variant: "h2" };
        const typographyProps = combineTypographyProps({
            theme: { typography: { h2: { size: 43, color: "rebeccapurple", weight: 300 }, label: { color: "azure" } } },
            passedProps,
            defaultProps,
        });
        expect(typographyProps).toEqual({
            color: "azure",
        });
    });
});
