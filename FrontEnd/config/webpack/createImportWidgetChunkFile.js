const fs = require("fs");
const appRoot = require("app-root-path");

console.log("Creating Widget Import Chunk File");

let contents = `export default function importWidgetChunk(type: string) {
    switch (type) {\n`;

const skippedDirectories = ["Common", "Basic", "Header", "Footer"];

const writeNewFile = () => {
    const directories = fs.readdirSync(`${appRoot}/modules/content-library/src/Widgets/`);

    for (let i = 0; i < directories.length; i++) {
        const dir = directories[i];

        if (skippedDirectories.includes(dir)) {
            continue;
        }

        const files = fs.readdirSync(`${appRoot}/modules/content-library/src/Widgets/${dir}`);
        for (let j = 0; j < files.length; j++) {
            const file = files[j].replace(".tsx", "").replace(".ts", "");
            const switchImportString = `        case "${dir}/${file}":
            return import(
                /* webpackChunkName: "${dir.toLowerCase()}Chunk" */ "@insite/content-library/Widgets/${dir}/${file}"
            );\n`;
            addFileContents(switchImportString);
        }
    }

    addFileContents(`        default:
            // Async Component will use the MissingComponent
            return null;
    }
}
`);

    fs.writeFileSync(`${appRoot}/modules/client-framework/src/Components/importWidgetChunk.tsx`, contents, "utf-8");
    console.log("Writing Widget Chunk File");
};

const addFileContents = addition => {
    contents += addition;
};

module.exports = writeNewFile;
