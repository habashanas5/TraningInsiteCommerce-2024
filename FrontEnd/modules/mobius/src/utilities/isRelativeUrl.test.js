/**
 * @jest-environment node
 */
import isRelativeUrl from "@insite/mobius/utilities/isRelativeUrl";

describe("isRelativeUrl", () => {
    test("returns true when the URL is relative", () => {
        expect(isRelativeUrl("/myfolder/test.txt")).toBe(true);
        expect(isRelativeUrl("test")).toBe(true);
        expect(isRelativeUrl("/hatWearing/monster")).toBe(true);
        expect(isRelativeUrl("/signIn")).toBe(true);
        expect(isRelativeUrl("/signIn.html")).toBe(true);
    });

    test("returns false when the URL is absolute", () => {
        expect(isRelativeUrl("http://example.com")).toBe(false);
        expect(isRelativeUrl("HTTP://EXAMPLE.COM")).toBe(false);
        expect(isRelativeUrl("https://www.exmaple.com")).toBe(false);
        expect(isRelativeUrl("ftp://example.com/file.txt")).toBe(false);
        expect(isRelativeUrl("//cdn.example.com/lib.js")).toBe(false);
        expect(isRelativeUrl("mailto:test@test.com")).toBe(false);
        expect(isRelativeUrl("mailto:test@test.com?subject=test")).toBe(false);
    });
});
