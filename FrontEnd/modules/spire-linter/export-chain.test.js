/* eslint-disable */
const { getRuleTester } = require("./testHelper");
const rule = require("./export-chain");

getRuleTester().run("export-chain", rule, {
    valid: [getCode("export const chain = [];")],
    invalid: [
        getCode("const chain = [];", [{ messageId: "exportChain" }]),
        getCode("", [{ messageId: "exportChain" }]),
    ],
});

function getCode(code, errors) {
    return {
        code: code + " export default {};", // required to trigger the final check of the rule
        filename: "c:/modules/client-framework/Handlers/tester.ts",
        errors,
    };
}
