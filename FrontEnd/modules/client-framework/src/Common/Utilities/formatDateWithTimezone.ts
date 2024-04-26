/**
 * This will format the passed in Date with the current browser timezone.
 *
 * Expected Format: 2020-04-17T00:00:00+03:00
 *
 * @param date The date to format with Timezone.
 */
const formatDateWithTimezone = function (date: Date) {
    const timezone = -date.getTimezoneOffset(); // Timezones are inverse of the wanted format, so reverse symbol.
    const timezoneSymbol = timezone >= 0 ? "+" : "-";
    const padNumber = function (num: number) {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? "0" : "") + norm;
    };
    return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${
        // Since month starts a 0 index, add one to get month as "number"
        padNumber(date.getDate())
    }T${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(
        date.getSeconds(),
    )}${timezoneSymbol}${padNumber(timezone / 60)}:${padNumber(timezone % 60)}`;
};

export default formatDateWithTimezone;
