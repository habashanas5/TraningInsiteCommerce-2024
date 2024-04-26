/* eslint-disable */
const fse = require("fs-extra");
const path = require("path");
const glob = require("glob");

const srcPath = "src";
const buildPath = "build";

async function copy(sourcePath, destinationPath) {
    try {
        await fse.copy(sourcePath, destinationPath, () => {
            console.log(`Copied ${sourcePath} to ${destinationPath}`);
        });
    } catch (err) {
        console.error(err);
    }
}

function copyFromRoot(fileName) {
    const sourcePath = path.resolve(fileName);
    const destinationPath = path.resolve(buildPath, fileName);
    copy(sourcePath, destinationPath);
}

function copyFromSrc(fileName) {
    const folderAndFileName = path.resolve(fileName).split(path.sep).slice(-2).join(path.sep);
    const sourcePath = path.resolve(srcPath, folderAndFileName);
    const destinationPath = path.resolve(buildPath, folderAndFileName);
    copy(sourcePath, destinationPath);
}

function copyTypescriptDefinitions() {
    const tsFiles = glob.sync(`${srcPath}/**/*.d.ts`);
    tsFiles.forEach(copyFromSrc);
}

copyFromRoot("package-lock.json");
copy("CHANGELOG.md", "build/CHANGELOG.md");
copy("npmREADME.md", "build/README.md");
copy("npmpackage.json", "build/package.json");
copyFromSrc("Icon/assets");
copyTypescriptDefinitions();
