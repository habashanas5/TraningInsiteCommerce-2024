export default function calculateDimensions(
    suppliedWidth: number | undefined,
    suppliedHeight: number | undefined,
    definedWidth: number,
    definedHeight: number,
) {
    let calculatedWidth = definedWidth;
    let calculatedHeight = definedHeight;
    const widthUndefined = typeof suppliedWidth === "undefined";
    const heightUndefined = typeof suppliedHeight === "undefined";
    if (widthUndefined && !heightUndefined) {
        calculatedWidth = (definedWidth / definedHeight) * suppliedHeight!;
        calculatedHeight = suppliedHeight!;
    } else if (heightUndefined && !widthUndefined) {
        calculatedHeight = (definedHeight / definedWidth) * suppliedWidth!;
        calculatedWidth = suppliedWidth!;
    }

    return {
        calculatedWidth,
        calculatedHeight,
    };
}
