/* eslint-disable */
const { getRuleTester } = require("./testHelper");
const rule = require("./restrict-lodash-import");

getRuleTester().run("restrict-lodash-import", rule, {
    valid: [getCode("import 'lodash/sortBy';")],
    invalid: [getCode("import 'lodash';", [{ messageId: "usePartialLodashImport" }])],
});

function getCode(code, errors) {
    const result = {
        code,
        errors: errors,
    };

    return result;
}
