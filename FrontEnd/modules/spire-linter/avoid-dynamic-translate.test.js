/* eslint-disable */
const { getRuleTester } = require("./testHelper");
const rule = require("./avoid-dynamic-translate");

getRuleTester().run("avoid-dynamic-translate", rule, {
    valid: [
        getCode("translate('literal');"),
        getCode("translate(booleanCondition ? 'literal1' : 'literal2');"),
        getCode("enum BudgetPeriodType { Monthly = 'Monthly' }; translate(BudgetPeriodType.Monthly);"),
    ],
    invalid: [
        getCode("var fields = {}; translate(fields.label)", [{ messageId: "avoid" }]),
        getCode("var fields = {}; var label = fields.label; translate(label)", [{ messageId: "avoid" }]),
        // we can't determine the type of an import, so this is considered an error
        getCode("import { BudgetPeriodType } from 'BudgetManagementReducer'; translate(BudgetPeriodType.Monthly)", [
            { messageId: "avoid" },
        ]),
        getCode("translate('Hello'); translate('HELLO');", [{ messageId: "unsupportedCasing" }]),
    ],
});

function getCode(code, errors) {
    return {
        code,
        filename: "c:/modules/content-library/src/Widgets/tester.tsx",
        errors,
    };
}
