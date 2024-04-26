export const convertToContentAdminEndpoint = <Arguments extends Array<unknown>, Result>(
    fn: (endpoint: string, ...args: Arguments) => Result,
    segment: string,
) => {
    return (endpoint: string, ...args: Arguments): Result => fn(`/api/internal/${segment}/${endpoint}`, ...args);
};
