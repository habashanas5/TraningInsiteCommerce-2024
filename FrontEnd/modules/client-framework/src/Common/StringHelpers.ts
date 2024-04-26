export function newGuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        // eslint-disable-next-line no-bitwise
        const r = (Math.random() * 16) | 0;
        // eslint-disable-next-line no-mixed-operators, no-bitwise
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const emptyGuid = "00000000-0000-0000-0000-000000000000";

export function splitCamelCase(value: string) {
    return value
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, o => o.toUpperCase())
        .trim();
}
