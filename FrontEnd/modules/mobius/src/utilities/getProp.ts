/* eslint-disable no-console */
import baseTheme from "@insite/mobius/globals/baseTheme";
import get from "@insite/mobius/utilities/get";

const isUndefined = (val: unknown) => val === undefined;

/**
 * Use in styled-components template strings to pull values from props.
 * @param {string} path The path to extract from the object. If path starts with "theme" and returns undefined, getProp tries to get the value from the baseTheme.
 * @param {*} defaultValue A value to return if the path is undefined.
 * @return {function} A function that accepts component props and attempts to access the value at the path defined in outer function argument.
 */
export default function getProp<T>(path = "", defaultValue?: T) {
    return (props: any) => {
        const [pathRoot, ...restOfPath] = path.split(".");
        const valueFromProps = get(props, path);
        if (pathRoot === "theme" && !valueFromProps && !defaultValue) {
            const valueFromBaseTheme = get(baseTheme, restOfPath);
            return valueFromBaseTheme;
        }
        return valueFromProps || defaultValue;
    };
}
