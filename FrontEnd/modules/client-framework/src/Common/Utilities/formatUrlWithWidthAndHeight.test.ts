import formatUrlWithWidthAndHeight from "@insite/client-framework/Common/Utilities/formatUrlWithWidthAndHeight";

const createUrl = (queryParams = "") =>
    `https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg${queryParams}`;

const expectToMatch = ({ result, expected }: { result: string; expected: string }) => {
    expect(result).toMatch(expected);
};

describe("formatUrlWithWidthAndHeight Image url", () => {
    test("Empty url string returns empty string", () => {
        const width = 150;
        const height = 150;
        const expected = "";

        const result = formatUrlWithWidthAndHeight({ url: expected, width, height });

        expectToMatch({ result, expected });
    });

    test("Width is 0 returns unchanged url string", () => {
        const width = 0;
        const height = 150;
        const expected = createUrl("?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260");

        const result = formatUrlWithWidthAndHeight({ url: expected, width, height });

        expectToMatch({ result, expected });
    });

    test("Height is 0 returns unchanged url string", () => {
        const width = 150;
        const height = 150;
        const expected = createUrl("?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260");

        const result = formatUrlWithWidthAndHeight({ url: expected, width, height });

        expectToMatch({ result, expected });
    });

    test("Query strings present, so query strings added with ampersand", () => {
        const width = 150;
        const height = 150;
        const url = createUrl("?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260");
        const expected = `${url}&width=150&height=150`;

        const result = formatUrlWithWidthAndHeight({ url, width, height });

        expectToMatch({ result, expected });
    });

    test("No query strings present, so query strings added with leading question mark", () => {
        const width = 150;
        const height = 150;
        const url = createUrl();
        const expected = `${url}?width=150&height=150`;

        const result = formatUrlWithWidthAndHeight({ url, width, height });

        expectToMatch({ result, expected });
    });
    test("Width already present in query strings", () => {
        const width = 150;
        const height = 150;
        const url = createUrl("?width=250&height=300");
        const expected = createUrl("?width=150&height=150");

        const result = formatUrlWithWidthAndHeight({ url, width, height });

        expectToMatch({ result, expected });
    });
    test("Width already present in query strings with extra params in front", () => {
        const width = 150;
        const height = 150;
        const url = createUrl("?returnUrl=google.com&width=250&height=300");
        const expected = createUrl("?returnUrl=google.com&width=150&height=150");

        const result = formatUrlWithWidthAndHeight({ url, width, height });

        expectToMatch({ result, expected });
    });
    test("Width already present in query strings with extra params in front and in back", () => {
        const width = 150;
        const height = 150;
        const url = createUrl("?returnUrl=google.com&width=250&height=300&cookie=123123asdf");
        const expected = createUrl("?returnUrl=google.com&width=150&height=150&cookie=123123asdf");

        const result = formatUrlWithWidthAndHeight({ url, width, height });

        expectToMatch({ result, expected });
    });
});
