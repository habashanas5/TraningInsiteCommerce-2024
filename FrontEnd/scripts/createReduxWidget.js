const path = require("path");
const fs = require("fs");

let widgetGroupAndName = "";

process.argv.forEach((value, index) => {
    if (index === 2) {
        widgetGroupAndName = value;
    }
});

if (widgetGroupAndName === "") {
    console.log("Please specify a widget Group/Name. For example OrderHistory/SearchButtons");
    process.exit(1);
}

if (widgetGroupAndName.split("/").length !== 2) {
    console.log("Please specify a widget Group/Name. For example OrderHistory/SearchButtons");
    process.exit(1);
}

const fullPath = path.join(__dirname, "../modules/content-library/src/Widgets", `${widgetGroupAndName}.tsx`);
console.log(`Creating file at ${fullPath}`);

let fullFile =
    "import * as React from 'react';\n" +
    "import { WidgetGroups } from '@insite/client-framework/Types/WidgetGroups';\n" +
    "import { WidgetModule } from '@insite/client-framework/Types/WidgetModule';\n" +
    "import { WidgetProps } from '@insite/client-framework/Types/WidgetProps';\n" +
    "import { connect, ResolveThunks } from 'react-redux';\n" +
    "import ApplicationState from '@insite/client-framework/Store/ApplicationState';\n" +
    "\n" +
    "interface OwnProps extends WidgetProps {\n" +
    "}\n" +
    "\n" +
    "const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({\n" +
    "});\n" +
    "\n" +
    "const mapDispatchToProps = {\n" +
    "};\n" +
    "\n" +
    "type Props = ReturnType<typeof mapStateToProps> & OwnProps & ResolveThunks<typeof mapDispatchToProps>;\n" +
    "\n" +
    "const EXAMPLEWIDGET: React.FC<Props> = props => {\n" +
    "    return <div>Yay</div>;\n" +
    "}\n" +
    "\n" +
    "const exampleWidget: WidgetModule = {\n" +
    "    component: connect(mapStateToProps, mapDispatchToProps)(EXAMPLEWIDGET),\n" +
    "    definition: {\n" +
    "        group: WidgetGroups.widgetGroup,\n" +
    "        fieldDefinitions: [\n" +
    "        ],\n" +
    "    },\n" +
    "};\n" +
    "\n" +
    "export default exampleWidget;\n";

const widgetName = widgetGroupAndName.split("/")[1];
const camelCaseWidgetName = widgetName.substr(0, 1).toLowerCase() + widgetName.substr(1);
const widgetGroup = widgetGroupAndName.split("/")[0];
const camelCaseWidgetGroup = widgetGroup.substr(0, 1).toLowerCase() + widgetGroup.substr(1);
fullFile = fullFile.replace(/EXAMPLEWIDGET/g, widgetName);
fullFile = fullFile.replace(/WIDGETGROUP/g, widgetGroup);
fullFile = fullFile.replace(/widgetGroup/g, camelCaseWidgetGroup);
fullFile = fullFile.replace(/exampleWidget/g, camelCaseWidgetName);

const folderPath = path.join(__dirname, "../modules/content-library/src/Widgets", widgetGroup);
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

fs.writeFile(fullPath, fullFile, error => {
    if (error) {
        console.log(error);
        process.exit(1);
    }
});
