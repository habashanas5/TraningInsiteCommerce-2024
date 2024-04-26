export default function uniqueId() {
    return Date.now().toString(36).slice(4) + Math.random().toString(36).slice(2);
}
