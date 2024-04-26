import addPhoneLinkTargetAttr, {
    returnMatchFromRegex,
} from "@insite/client-framework/Common/Utilities/addPhoneLinkTargetAttr";

const generateHtml = (numberOfPhoneLinks: number, targetAttr = "") => {
    const lines = [
        `<p style="text-align: center;"><strong><span style="font-size: 24px;"><a className="link-tag" alt="link" aria-label="link" href="tel:1231231234" ${targetAttr} >here</a>Shop by Category</span></strong></p>`,
        `<a style='background:green;" href="https://google.com">Say hi</a><a href="tel:612-123-3434  " ${targetAttr} >Hey</a><p>Paragraph</p>`,
        `<a class="link" href="tel:234-234-2334" ${targetAttr} style="background:violet;">Say hi</a><a href="https://somesite.com" style="background:blue;">Here</a><p>asdfasdfasdf</p>`,
    ];

    const returnVal = [];
    for (let i = 0; i < numberOfPhoneLinks; i++) {
        returnVal.push(lines[i]);
    }

    return returnVal.join("");
};

describe("Should return match array", () => {
    test("One anchor tag", () => {
        const numberOfLines = 1;
        const model = generateHtml(numberOfLines);

        const result = returnMatchFromRegex(model)?.length;

        expect(result).toEqual(1);
    });

    test("Two anchor tags", () => {
        const numberOfLines = 2;
        const model = generateHtml(numberOfLines);

        const result = returnMatchFromRegex(model)?.length;

        expect(result).toEqual(2);
    });
});

describe("Text replacement", () => {
    test("Replace one anchor tag", () => {
        const numberOfLines = 1;
        const targetAttribute = ' target="_blank"';
        const model = generateHtml(numberOfLines);

        const result = addPhoneLinkTargetAttr(model);

        const expectedVal = generateHtml(numberOfLines, targetAttribute);

        expect(result).toMatch(expectedVal);
    });

    test("Replace two anchor tags", () => {
        const numberOfLines = 2;
        const targetAttribute = ' target="_blank"';
        const model = generateHtml(numberOfLines);

        const result = addPhoneLinkTargetAttr(model);

        const expectedVal = generateHtml(numberOfLines, targetAttribute);

        expect(result).toMatch(expectedVal);
    });

    test("Replace three anchor tags", () => {
        const numberOfLines = 3;
        const targetAttribute = ' target="_blank"';
        const model = generateHtml(numberOfLines);

        const result = addPhoneLinkTargetAttr(model);

        const expectedVal = generateHtml(numberOfLines, targetAttribute);

        expect(result).toMatch(expectedVal);
    });
});
describe("No text replacement", () => {
    test("Do not replace one anchor tag", () => {
        const numberOfLines = 1;
        const targetAttribute = '  target="_blank"';
        const model = generateHtml(numberOfLines, targetAttribute);

        const result = addPhoneLinkTargetAttr(model);

        expect(result).toMatch(model);
    });

    test("Do not replace two anchor tags", () => {
        const numberOfLines = 2;
        const targetAttribute = 'target="_blank" style="background:green;"';
        const model = generateHtml(numberOfLines, targetAttribute);

        const result = addPhoneLinkTargetAttr(model);

        expect(result).toMatch(model);
    });

    test("Do not replace three anchor tags", () => {
        const numberOfLines = 3;
        const targetAttribute = 'target="_blank"';
        const model = generateHtml(numberOfLines, targetAttribute);

        const result = addPhoneLinkTargetAttr(model);

        expect(result).toMatch(model);
    });
});
