import { WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import * as React from "react";

const TabbedPropertiesWidget: React.FC = () => <div>Dummy Content</div>;

const tab1 = {
    displayName: "SortOrder1",
    sortOrder: 1,
};
const tabB = {
    displayName: "TabA",
    sortOrder: 2,
};
const tabZ = {
    displayName: "TabZ",
    sortOrder: 2,
};

const definition: WidgetDefinition = {
    group: "Testing",
    displayName: "Tabs",
    fieldDefinitions: [
        {
            name: "tab1a",
            displayName: "Tab1a",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
            tab: tab1,
        },
        {
            name: "tab2aaaas",
            displayName: "Tab2a",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
            tab: tabB,
        },
        {
            name: "tab3a",
            displayName: "Tab3a",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
            tab: tabZ,
        },
        {
            name: "tab1b",
            displayName: "Tab1b",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
            tab: tab1,
        },
        {
            name: "tab2b",
            displayName: "Tab2b",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
            tab: tabB,
        },
    ],
};

const widgetModule: WidgetModule = {
    component: TabbedPropertiesWidget,
    definition,
};

export default widgetModule;
