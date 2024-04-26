import parseQueryStringCaseInsensitive from "@insite/client-framework/Common/Utilities/parseQueryStringCaseInsensitive";

describe("get parameters should be parsed ignoring case", () => {
    test("all this should be valid", () => {
        expect(parseQueryStringCaseInsensitive("", {})).toStrictEqual({});
        expect(parseQueryStringCaseInsensitive("?oRdErNuMber=test", { orderNumber: "" }).orderNumber).toBe("test");
        expect(parseQueryStringCaseInsensitive("oRdErNuMber=test", { orderNumber: "" }).orderNumber).toBe("test");
        expect(parseQueryStringCaseInsensitive("?orderNumber=test", { orderNumber: "" }).orderNumber).toBe("test");
        expect(parseQueryStringCaseInsensitive("?ordernumber=test", { ordernumber: "" }).ordernumber).toBe("test");
        expect(parseQueryStringCaseInsensitive("?oRdErNuMber=test", { ordernumber: "" }).ordernumber).toBe("test");
        expect(parseQueryStringCaseInsensitive("?ordernumber=test", { oRdErNuMber: "" }).oRdErNuMber).toBe("test");
    });
});
