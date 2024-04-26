/**
 * Will check a string value for validity as a number.
 *
 * @param input String of value to check.
 */
const isNumeric = (input: string): boolean => {
    const parsedNumber = parseFloat(input);
    return !Number.isNaN(parsedNumber) && Number.isFinite(parsedNumber);
};
export default isNumeric;
