/* eslint-disable no-console */
import resolveColor from "@insite/mobius/utilities/resolveColor";

/**
 * Use in styled-components template strings to pull color values from the theme.
 * @param {string} path The path to extract from `theme.color`.
 * @return {function} A function that accepts component props and attempts to access the color defined in the function argument.
 */
export default function getColor(path = "") {
    return (props: any) => resolveColor(path, props.theme);
}
