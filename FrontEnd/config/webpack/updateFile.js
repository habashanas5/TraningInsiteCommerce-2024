/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

function updateFile(path, data) {
    if (!fs.existsSync(path) || fs.readFileSync(path, "utf8") !== data) {
        // this may trigger HMR if the file doesn't exist or is being changed.
        fs.writeFileSync(path, data);
    }
}

module.exports = updateFile;
