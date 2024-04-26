/* eslint-disable */
const path = require("path");
const fs = require("fs");

const newVersion = JSON.parse(fs.readFileSync(path.resolve(__dirname, "New.json")));
const originalVersion = JSON.parse(fs.readFileSync(path.resolve(__dirname, "Original.json")));

const addStuff = (widgets, parentId, indent) => {
    let result = "";
    for (const widget of widgets) {
        if (widget.parentId === parentId) {
            result += indent + widget.zone + "-" + widget.type + "\n";
            result += addStuff(widgets, widget.id, indent + "    ");
        }
    }

    return result;
};

// this is a start to a tool for comparing page templates. It could possibly use jest to compare the result, so the person running it doesn't have to copy the output into another tool
// it could also write out the results to disk.
const newTree = newVersion.type + "\n" + addStuff(newVersion.widgets, newVersion.id, "    ");
console.log("New");
console.log(newTree);
console.log();
console.log();
const originalTree = originalVersion.type + "\n" + addStuff(originalVersion.widgets, originalVersion.id, "    ");
console.log("Original");
console.log(originalTree);
console.log();
console.log();

const widgetsInNew = [];
for (const widget of newVersion.widgets) {
    if (!widgetsInNew.includes(widget.type)) {
        widgetsInNew.push(widget.type);
    }
}

const widgetsLogged = [];
for (const widget of originalVersion.widgets) {
    if (!widgetsInNew.includes(widget.type) && !widgetsLogged.includes(widget.type)) {
        widgetsLogged.push(widget.type);
        console.log(widget.type);
    }
}
