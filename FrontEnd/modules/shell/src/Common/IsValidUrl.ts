export function isValidUrl(value: string) {
    // validation of urls is hard because browsers/servers let all kinds of "invalid" stuff work
    // also validation of a url doesn't actually mean the url is going to get to where the user wants it to
    // so let's just keep this simple, and let the user validate what they put in actually gets where they want it to go
    // https:// or http:// or / or mailto:
    const simpleValidation = /^((https?:\/\/)|\/|(mailto:))/gi;

    return simpleValidation.test(value);
}
