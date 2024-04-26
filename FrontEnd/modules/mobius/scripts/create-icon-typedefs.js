/* eslint-disable */
const fse = require("fs-extra");
const path = require("path");

const root = "../src/Icons";

const template = iconName => `import * as React from 'react';

export default function ${iconName}(): React.FunctionComponent<{}>;
`;

function createIconTypedef(fileName) {
    const iconName = path.parse(fileName).name;
    const output = template(iconName);
    const newFileName = `${iconName}.d.ts`;

    fse.writeFile(path.resolve(root, newFileName), output, err => {
        if (err) throw err;
        console.log(`Created ${newFileName}`);
    });
}

const files = fse.readdirSync(path.resolve(root));

files.forEach(createIconTypedef);
