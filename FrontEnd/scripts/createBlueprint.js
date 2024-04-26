const fse = require("fs-extra");
const path = require("path");

const [, , blueprintName] = process.argv;

if (!blueprintName) {
    console.log(`
Please specify a blueprint name as the first argument when running this script.
e.g. npm run create-blueprint "myBlueprint"
`);
    process.exit(1);
}

const newThemeDirectory = path.resolve(`./modules/blueprints/${blueprintName}`);

if (!fse.existsSync(newThemeDirectory)) {
    fse.mkdirSync(newThemeDirectory);
}

fse.writeJsonSync(
    path.resolve(`./modules/blueprints/${blueprintName}/fence.json`),
    {
        tags: [`${blueprintName}`],
        imports: ["mobius", "client-framework", "content-library", "server-framework"],
    },
    { spaces: 2 },
);

// Writing a new package.json file instead of copying from the example blueprint. The example blueprint may include npm packages
// that partners do not want in their custom theme.
fse.writeJsonSync(path.resolve(`./modules/blueprints/${blueprintName}/package.json`), { private: true }, { spaces: 2 });

fse.copySync(
    path.resolve("./modules/blueprints/example/tsconfig.json"),
    path.resolve(`./modules/blueprints/${blueprintName}/tsconfig.json`),
);

// Copying over an example Start.tsx file that includes
// comments about how to use the Start.tsx file.
fse.copySync(
    path.resolve("./modules/blueprints/example/src/StartExample.tsx"),
    path.resolve(`./modules/blueprints/${blueprintName}/src/Start.tsx`),
);
