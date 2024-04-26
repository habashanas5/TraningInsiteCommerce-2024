/**
 * Converts multiples of 1/12 to percent. Used to calculate grid column widths.
 * @param {*} width The numerator in n/12ths of the grid.
 */
export default function gridWidth(width: number) {
    // eslint-disable-next-line no-mixed-operators
    return `${Math.round((width * 1e8) / 12) / 1e6}%`;
}
