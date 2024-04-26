/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");
const updateFile = require("./updateFile");

function doWork(isDevBuild, blueprint) {
    updateFile(
        path.resolve(__dirname, "../../modules/server-framework/Entry.ts"),
        `/* eslint-disable */
import "@insite/server-framework/Winston";
import "@insite/client-framework/LoadComponents";
import "../${blueprint}/src/Start";

export * from "./src/StartServer";
`,
    );

    const shellBlueprint = blueprint.replace("blueprints", "blueprints-shell");
    const shellBlueprintExists = fs.existsSync(
        path.resolve(__dirname, `../../modules/${shellBlueprint}/src/Start.tsx`),
    );
    const shellBlueprintImport = shellBlueprintExists ? `\nimport "../${shellBlueprint}/src/Start";` : "";

    updateFile(
        path.resolve(__dirname, "../../modules/shell/Entry.ts"),
        `/* eslint-disable */${shellBlueprintImport}
import "@insite/shell/LoadComponents";
import "../${blueprint}/src/Start";
import "@insite/shell/ClientApp";
`,
    );

    updateFile(
        path.resolve(__dirname, "../../modules/client-framework/Entry.ts"),
        `/* eslint-disable */
import "@insite/client-framework/LoadComponents";
import "../${blueprint}/src/Start";
import "@insite/client-framework/ClientApp";
`,
    );
}

module.exports = doWork;
