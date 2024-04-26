export default function convertToNumberIfString(value: number | string) {
    return typeof value === "string" ? parseInt(value, 10) : value;
}
