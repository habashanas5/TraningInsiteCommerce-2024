/* eslint-disable */
const { getRuleTester } = require("./testHelper");
const rule = require("./export-styles");

getRuleTester().run("export-styles", rule, {
    valid: [getCode("export const testerStyles: TesterStyles = {};")],
    invalid: [
        getCode("const testerStyles: TesterStyles = {};", [{ messageId: "exportStyles" }]),
        getCode("", [{ messageId: "exportStyles" }]),
    ],
});

function getCode(code, errors) {
    return {
        code: code + " export default {};", // required to trigger the final check of the rule
        filename: "c:/modules/content-library/src/Widgets/tester.tsx",
        errors,
    };
}
