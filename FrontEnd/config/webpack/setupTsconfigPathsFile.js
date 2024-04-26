/* eslint-disable @typescript-eslint/no-var-requires */
const updateFile = require("./updateFile");
const path = require("path");
const fs = require("fs");

const getDirectories = source =>
    fs
        .readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

const filePath = path.resolve(__dirname, "../../tsconfig.paths.json");

let contents = `{
    "compilerOptions": {
        "paths": {
            "@insite/client-framework/*": ["client-framework/src/*"],
            "@insite/content-library/*": ["content-library/src/*"],
            "@insite/server-framework/*": ["server-framework/src/*"],
            "@insite/shell/*": ["shell/src/*"],
            "@insite/shell-public/*": ["shell-public/src/*"],
            "@insite/mobius/*": ["mobius/src/*"]`;

const blueprintsPath = path.resolve(__dirname, "../../modules/blueprints");
if (fs.existsSync(blueprintsPath)) {
    const directories = getDirectories(blueprintsPath);
    for (const directory of directories) {
        contents += `,
            "@${directory}/*": ["blueprints/${directory}/src/*"]`;
    }
}

const blueprintsShellPath = path.resolve(__dirname, "../../modules/blueprints-shell");
if (fs.existsSync(blueprintsShellPath)) {
    const directories = getDirectories(blueprintsShellPath);
    for (const directory of directories) {
        contents += `,
            "@${directory}-shell/*": ["blueprints-shell/${directory}/src/*"]`;
    }
}

contents += `
        }
    }
}
`;
updateFile(filePath, contents);
