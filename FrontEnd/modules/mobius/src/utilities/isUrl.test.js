/**
 * @jest-environment node
 */
import isUrl from "./isUrl";

describe("isUrl", () => {
    test("returns false when the URL is relative", () => {
        expect(isUrl("/myfolder/test.txt")).toBe(false);
        expect(isUrl("test")).toBe(false);
        expect(isUrl("/hatWearing/monster")).toBe(false);
        expect(isUrl("/signIn")).toBe(false);
        expect(isUrl("/signIn.html")).toBe(false);
    });

    test("returns false for arbitrary strings", () => {
        expect(isUrl("lucy is a beautiful dog")).toBe(false);
        expect(isUrl("test")).toBe(false);
        expect(isUrl("KindnessIsGood")).toBe(false);
        expect(isUrl("This is a sentence / and whatever. It contains: Arbitrary punctuation?")).toBe(false);
    });

    test("returns true when the URL is absolute", () => {
        expect(isUrl("http://example.com")).toBe(true);
        expect(isUrl("HTTP://EXAMPLE.COM")).toBe(true);
        expect(isUrl("https://www.exmaple.com")).toBe(true);
        expect(isUrl("ftp://example.com/file.txt")).toBe(true);
        expect(isUrl("//cdn.example.com/lib.js")).toBe(true);
    });
});
