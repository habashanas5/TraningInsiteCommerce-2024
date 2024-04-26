/* eslint-disable */
const fse = require("fs-extra");
const path = require("path");
const camelCase = require("lodash/camelCase");
const upperFirst = require("lodash/upperFirst");

const root = "../src/Icon/assets";

const kebabCaseRegex = /\w+-\w+=/gim;
const classNameRegex = /\sclass="([a-zA-Z0-9\-\_]+\s*)+"/gim;

function reactifyIcon(fileName) {
    const newFileName = upperFirst(camelCase(path.parse(fileName).name));

    fse.readFile(path.resolve(root, fileName), "utf8", (err, data) => {
        if (err) throw err;

        // remove className
        let newData = data.replace(classNameRegex, "");

        const kebabCaseProps = newData.match(kebabCaseRegex);
        if (kebabCaseProps) {
            kebabCaseProps.forEach(prop => {
                newData = newData.replace(prop, `${camelCase(prop)}=`);
            });
        }

        const output = `import * as React from 'react';\r\n\r\nconst ${newFileName}: React.FC = () => {\r\n    return ${newData};\r\n};\r\n\r\nexport default ${newFileName};\r\n`;
        fse.writeFile(path.resolve("../src/Icons", `${newFileName}.tsx`), output, err => {
            if (err) throw err;

            console.log(`Created ${newFileName}.tsx`);
        });
    });
}

const files = fse.readdirSync(path.resolve(root));

files.forEach(reactifyIcon);
