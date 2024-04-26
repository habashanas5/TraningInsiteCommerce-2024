/* eslint-disable */
const fse = require("fs-extra");
const path = require("path");
const camelCase = require("lodash/camelCase");
const upperFirst = require("lodash/upperFirst");

const sourcePath = "./Optimized";
const destinationPath = "../../modules/shell/src/Components/Icons";

const { execSync } = require("child_process");
if (fse.existsSync("Optimized")) {
    execSync(`rmdir /Q/S Optimized`);
}
execSync(`svgo -f ./Assets ${sourcePath} --pretty --multipass`);

const foundFiles = [];

function reactifyIcon(fileName) {
    if (fileName.indexOf(".svg") < 0) {
        return;
    }

    const newFileName = upperFirst(camelCase(path.parse(fileName).name)).replace("Icon", "");
    foundFiles.push(newFileName + ".tsx");

    fse.readFile(path.resolve(sourcePath, fileName), "utf8", (err, data) => {
        if (err) throw err;

        let newData = data
            .substr(data.indexOf("<svg"))
            .replace(/ xmlns="([a-zA-Z0-9\-\_:/\.]+\s*)+"/gim, "")
            .replace("<!-- Generator: Sketch 56.3 (81716) - https://sketch.com -->", "")
            .replace(/enable-background:([a-zA-Z0-9 #.]+);/g, "")
            .replace(/ class="([a-zA-Z0-9 #.-]+)"/g, "")
            .replace(/ style=""/gim, "")
            .replace("<svg", '<svg className={className} focusable="false"');
        const viewBoxRegex = /(viewBox="0 0 ([0-9.]+) ([0-9.]+)")/gim;
        const viewBoxMatch = viewBoxRegex.exec(newData);
        let width = 20;
        let height = 20;
        let isSquare = false;
        if (viewBoxMatch != null) {
            width = viewBoxMatch[2];
            height = viewBoxMatch[3];

            if (width === height) {
                isSquare = true;
            }

            newData = newData.replace(
                viewBoxMatch[0],
                viewBoxMatch[0] +
                    ` width={${isSquare ? "size" : "calculatedWidth"}} height={${
                        isSquare ? "size" : "calculatedHeight"
                    }}`,
            );
        }

        if (!isSquare) {
            newData = newData
                .replace(/\n/gim, "\n    ")
                .replace(/\r\n    $/, "")
                .replace(/\n    $/, "");
        }

        const kebabCaseProps = newData.match(/\w+-\w+(=|:)/gim);
        if (kebabCaseProps) {
            kebabCaseProps.forEach(prop => {
                newData = newData.replace(prop, `${camelCase(prop)}=`);
            });
        }

        let nextIndex = 1;
        const colors = {};

        const fillAndStrokeRegex = /((stroke)|(fill))="([a-zA-Z0-9#]+)"/gim;
        let match = fillAndStrokeRegex.exec(newData);
        while (match !== null) {
            const fullAttribute = match[0];
            const attributeName = match[1];
            const color = match[4];
            if (color === "none") {
                match = fillAndStrokeRegex.exec(newData);
                continue;
            }
            if (!colors[color]) {
                colors[color] = "color" + nextIndex;
                nextIndex++;
            }
            newData = newData.replace(fullAttribute, `${attributeName}={${colors[color]}}`);

            match = fillAndStrokeRegex.exec(newData);
        }

        let colorsType = "";
        let colorsParameter = "";
        for (const color in colors) {
            colorsType += `, ${colors[color]}?: string`;
            colorsParameter += `, ${colors[color]} = '${color}'`;
        }

        const widthType = "width?: number, height?: number";
        const sizeType = "size?: number";

        const widthParameters = `width = undefined, height = undefined`;
        const sizeParameters = `size = ${width}`;

        const output = [];
        output.push(`import * as React from 'react';`);
        if (!isSquare) {
            output.push(`import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';`);
        }

        output.push("");
        output.push(
            `const ${newFileName}: React.FC<{ ${
                isSquare ? sizeType : widthType
            }${colorsType}, className?: string }> = ({ ${
                isSquare ? sizeParameters : widthParameters
            }${colorsParameter}, className }) => ${isSquare ? "(" : "{"}`,
        );
        if (!isSquare) {
            output.push(
                `    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, ${width}, ${height});`,
            );
            output.push(`    return ${newData};`);
            output.push("};");
        } else {
            output.push(`${newData});`);
        }

        output.push("");
        output.push(`export default React.memo(${newFileName});`);
        output.push("");

        fse.writeFile(path.resolve(destinationPath, `${newFileName}.tsx`), output.join(require("os").EOL), err => {
            if (err) throw err;
        });
    });
}

const files = fse.readdirSync(path.resolve(sourcePath));

files.forEach(reactifyIcon);

const tsxFiles = fse.readdirSync(path.resolve(destinationPath));
tsxFiles.forEach(fileName => {
    if (fileName.indexOf(".tsx") > 0 && foundFiles.indexOf(fileName) < 0) {
        fse.unlinkSync(destinationPath + "/" + fileName);
    }
});
