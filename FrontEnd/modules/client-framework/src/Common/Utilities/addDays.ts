export default function addDays(date: Date, numberOfDays: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + numberOfDays);
    return result;
}
