import { isValidUrl } from "@insite/shell/Common/IsValidUrl";

describe("isValidUrl", () => {
    const expectIsValid = (name: string, url: string) => {
        test(name, () => {
            const result = isValidUrl(url);
            expect(result).toBe(true);
        });
    };
    const expectIsNotValid = (name: string, url: string) => {
        test(name, () => {
            const result = isValidUrl(url);
            expect(result).toBe(false);
        });
    };

    // while not technically valid, this url works
    expectIsValid(
        "should allow & in the path of external url",
        "https://www.linkedin.com/company/auer-steel-&-heating-supply-company-inc-/",
    );
    expectIsValid(
        "should allow encoded & in the path of external url",
        "https://www.linkedin.com/company/auer-steel-%26-heating-supply-company-inc-/",
    );
    expectIsValid("should allow basic https domain", "https://www.google.com");
    expectIsValid("should allow basic path", "/aboutUs");
    expectIsNotValid("should not allow basic path without starting slash", "company/aboutUs");

    expectIsValid(
        "should allow crazy google link that works in browser (just added * into query string)",
        "https://www.google.com/search?source=hp&ei=MbdSYISVF5G4sQXmiJqQDg&iflsig=AINFCbYAAAAAYFLFQepMywj-24TW3izB6ohpaid7OEpf&q=%7E%60%21%40%23%24%25%5E%26*%28%29_%2B%7C%5B%7B%5D%7D%5C%7C%3B%3A%E2%80%99%E2%80%9D%2C%3C.%3E%2F%3F1234567890&oq=%7E%60%21%40%23%24%25%5E%26*%28%29_%2B%7C%5B%7B%5D%7D%5C%7C%3B%3A%E2%80%99%E2%80%9D%2C%3C.%3E%2F%3F1234567890&gs_lcp=Cgdnd3Mtd2l6EANQpRxYpRxghydoAXAAeACAAYsCiAGLApIBAzItMZgBAKABAqABAaoBB2d3cy13aXqwAQA&sclient=gws-wiz&ved=0ahUKEwjE8bSe4rjvAhURXKwKHWaEBuIQ4dUDCAc&uact=5",
    );

    expectIsValid("should allow mailto links", "mailto:test@test.com");
    expectIsValid("should allow mailto links with additional parameters", "mailto:test@test.com?subject=test");
});
