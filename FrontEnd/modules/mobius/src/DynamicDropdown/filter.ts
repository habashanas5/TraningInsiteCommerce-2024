import { OptionObject } from "@insite/mobius/DynamicDropdown/DynamicDropdown";

const stringify = (option: OptionObject) => `${option.searchString || ""} ${option.optionText}`;
const trimString = (str: string) => str.replace(/^\s+|\s+$/g, "");

/**
 * Provides a function to access the styling in the theme and props.
 * @param {object} option An object describing the option.
 * @param {string} option.optionText The value of the menu item.
 * @param {string} [option.searchString] Any additional string data to be searched by the dynamic dropdown.
 * @param {string} rawInput The string being searched for within the option.
 * @return {boolean} Whether the option includes the rawInput.
 */
const filter = (option: OptionObject, rawInput: string) => {
    const input = trimString(rawInput).toLowerCase();
    const candidate = trimString(stringify(option)).toLowerCase();
    return candidate.indexOf(input) > -1;
};

export default filter;
