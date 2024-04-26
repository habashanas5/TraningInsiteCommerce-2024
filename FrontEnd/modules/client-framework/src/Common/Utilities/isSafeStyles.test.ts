import { extractStylesToArray, isSafe } from "@insite/client-framework/Common/Utilities/isSafeStyles";

describe("isSafe regex check", () => {
    test("character in front of colon is false", () => {
        const listOfFalseChars = ["=", "*", "%", "$", "!", "@", "#", "^", "&", "()", "<>", "/"];
        const createExampleStyle = (char: string) => `height${char}100%;color:red;`;
        const stylesStr = listOfFalseChars.map(createExampleStyle).join("");
        const boolVal = isSafe(stylesStr);
        expect(boolVal).toBe(false);
    });

    test("character behind colon is false", () => {
        const listOfFalseChars = ["=", "*", "$", "!", "@", "#", "^", "&", "<>", "/", "()100"];
        const createExampleStyle = (char: string) => `height:${char};color:red;`;
        const stylesStr = listOfFalseChars.map(createExampleStyle).join("");
        const boolVal = isSafe(stylesStr);
        expect(boolVal).toBe(false);
    });

    test("Styles that should return true", () => {
        const styles = "transform: scale(3.0);background:rgba(0,0,0,0);tranform: translate(30px, 20px);";
        const boolVal = isSafe(styles);

        expect(boolVal).toBe(true);
    });
});

describe("Extract style attribute to array", () => {
    test("Pulling styles from style attribute", () => {
        const html = `
            <div style="height:100%;color:red;">
                <p>Hello</p>
            </div>
        `;

        expect(extractStylesToArray(html)?.length).toBe(1);
    });

    test("Pulling styles from style attribute", () => {
        const html = `
            <div style="height:100%;color:red;">
                <p style="tranform: scale(1);"><span style="background:green;">Hello</span></p>
            </div>
        `;
        expect(extractStylesToArray(html)?.length).toBe(3);
    });

    test("Pulling styles from empty string", () => {
        const html = ``;
        expect(extractStylesToArray(html)?.length).toBe(0);
    });

    test("Pulling styles from html with no styles", () => {
        const html = `
            <div>
                <p><span>Hello</span></p>
            </div>
        `;
        expect(extractStylesToArray(html)?.length).toBe(0);
    });
});
