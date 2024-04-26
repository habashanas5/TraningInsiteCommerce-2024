#!/usr/bin/env node
/* eslint-disable no-console */
const { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } = require("fs");
const { renderString } = require("template-file"); // https://github.com/gsandf/template-file

// get component type and name from CLI
const [, , componentName] = process.argv;

// parse component name, make lowercase and capitalized versions
const [firstLetter, ...rest] = componentName.split("");
const data = {
    Component: [firstLetter.toUpperCase(), ...rest].join(""),
    component: [firstLetter.toLowerCase(), ...rest].join(""),
};

// define destination folder, quit if it exists
const destinationFolder = `src/${data.Component}`;
if (existsSync(destinationFolder)) {
    console.log(`${destinationFolder} already exists.`);
    process.exit();
}

// get templates from /template folder
const templateRegEx = /\.template$/;
const templateFiles = readdirSync("./template").filter(fileName => templateRegEx.test(fileName));

// load all templates into object
const readFileOptions = { encoding: "utf8" };
const templates = templateFiles.reduce((obj, templateFileName) => {
    let fileName = templateFileName.replace(templateRegEx, "");
    if (fileName.startsWith("Component")) {
        fileName = fileName.replace(/^Component/, data.Component);
    }
    return {
        ...obj,
        [fileName]: readFileSync(`template/${templateFileName}`, readFileOptions),
    };
}, {});

// create destination folder
mkdirSync(destinationFolder);

// render templates and write files
const fileNames = Object.keys(templates);
fileNames.forEach(fileName => {
    const renderedString = renderString(templates[fileName], data);
    const filePath = `${destinationFolder}/${fileName}`;
    writeFileSync(filePath, renderedString, readFileOptions);
    console.log(`${filePath} created.`);
});
