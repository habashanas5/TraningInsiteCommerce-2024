import { newGuid, splitCamelCase } from "@insite/client-framework/Common/StringHelpers";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { getThePageDefinitions, getTheWidgetDefinitions } from "@insite/client-framework/Components/ContentItemStore";
import logger from "@insite/client-framework/Logger";
import { ContentItemDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import FieldDefinition from "@insite/client-framework/Types/FieldDefinition";
import { HasType, LoadedPageDefinition, LoadedWidgetDefinition } from "@insite/shell/DefinitionTypes";
import sortBy from "lodash/sortBy";
// eslint-disable-next-line spire/fenced-imports
import spireRoutes from "../../../config/spire_routes.json";

const systemUris = new Set<string>([
    ...spireRoutes.commerce_routes.map(v => v.toLowerCase()),
    ...spireRoutes.spire_system_uris.map(v => v.toLowerCase()),
]);

let loadedDefinitions = false;
const widgetDefinitionsByType: Dictionary<LoadedWidgetDefinition> = {};
const widgetDefinitions: LoadedWidgetDefinition[] = [];
const pageDefinitionsByType: Dictionary<LoadedPageDefinition> = {};
const pageDefinitions: LoadedPageDefinition[] = [];

export function getWidgetDefinitions(): LoadedWidgetDefinition[] {
    if (!loadedDefinitions) {
        loadDefinitions();
    }

    return widgetDefinitions;
}

export function getWidgetDefinition(type: string, overrideLoadedDefintions = false): LoadedWidgetDefinition {
    if (!loadedDefinitions || overrideLoadedDefintions) {
        loadDefinitions();
    }

    return widgetDefinitionsByType[type];
}

export function getPageDefinitions(): LoadedPageDefinition[] {
    if (!loadedDefinitions) {
        loadDefinitions();
    }

    return pageDefinitions;
}

export function getPageDefinition(type: string): LoadedPageDefinition {
    if (!loadedDefinitions) {
        loadDefinitions();
    }

    return pageDefinitionsByType[type];
}

function loadDefinitions() {
    const widgets = getTheWidgetDefinitions();

    for (const type in widgets) {
        widgetDefinitionsByType[type] = {
            ...widgets[type],
            type,
        };

        cleanup(widgetDefinitionsByType[type]);

        widgetDefinitions.push(widgetDefinitionsByType[type]);
    }

    const pages = getThePageDefinitions();

    for (const type in pages) {
        pageDefinitionsByType[type] = {
            ...pages[type],
            type,
        };

        cleanupPageDefinition(pageDefinitionsByType[type]);
        cleanup(pageDefinitionsByType[type]);

        pageDefinitions.push(pageDefinitionsByType[type]);
    }

    loadedDefinitions = true;
}

function cleanupField(fieldDefinition: FieldDefinition) {
    if (typeof fieldDefinition.name === "undefined") {
        logger.warn(`A field definition without a name was found. ${JSON.stringify(fieldDefinition)}`);
        fieldDefinition.name = newGuid();
    }

    if (typeof fieldDefinition.displayName === "undefined") {
        fieldDefinition.displayName = splitCamelCase(fieldDefinition.name);
    }
    if (typeof fieldDefinition.tab === "undefined") {
        fieldDefinition.tab = {
            displayName: "Basic",
            sortOrder: 0,
            dataTestSelector: "editPage_basicTab",
        };
    }
    if (typeof fieldDefinition.sortOrder === "undefined") {
        fieldDefinition.sortOrder = 999999;
    }

    const childFieldDefinitions = (fieldDefinition as any)["fieldDefinitions"];
    if (typeof childFieldDefinitions !== "undefined") {
        for (const childFieldDefinition of childFieldDefinitions) {
            cleanupField(childFieldDefinition);
        }
    }
}

function cleanup(definition: ContentItemDefinition & HasType) {
    if (typeof definition.displayName === "undefined") {
        const type = definition.type;
        const displayName = type.lastIndexOf("/") >= 0 ? type.substr(type.lastIndexOf("/") + 1) : type;
        definition.displayName = splitCamelCase(displayName);
    }

    if (!definition.fieldDefinitions) {
        definition.fieldDefinitions = [];
    }

    for (const fieldDefinition of definition.fieldDefinitions) {
        cleanupField(fieldDefinition);
    }

    definition.fieldDefinitions = sortBy(definition.fieldDefinitions, [(o: FieldDefinition) => o.sortOrder]);
}

function cleanupPageDefinition(pageDefinition: LoadedPageDefinition) {
    let { fieldDefinitions } = pageDefinition;
    if (!fieldDefinitions) {
        fieldDefinitions = pageDefinition.fieldDefinitions = [];
    }

    if (pageDefinition.hasEditableTitle) {
        fieldDefinitions.push({
            name: "title",
            displayName: "SEO Title",
            editorTemplate: "TextField",
            defaultValue: "New Page",
            fieldType: "Translatable",
            isRequired: true,
            sortOrder: 0,
        });
    }

    fieldDefinitions.push({
        name: "variantName",
        displayName: "Variant Name",
        editorTemplate: "TextField",
        defaultValue: "",
        fieldType: "General",
        isRequired: true,
        sortOrder: 0,
    });

    fieldDefinitions.push({
        name: "layoutPage",
        displayName: "Layout Page",
        editorTemplate: "TextField",
        defaultValue: "",
        isEnabled: () => false,
        fieldType: "General",
        sortOrder: 0,
    });

    if (pageDefinition.hasEditableUrlSegment && pageDefinition.type !== "HomePage") {
        fieldDefinitions.push({
            name: "urlSegment",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "Translatable",
            tooltip: "URL path component identifying this page.",
            isRequired: true,
            sortOrder: 100,
            regularExpression: new RegExp("^[0-9a-zA-Z_\\-]+$"),
            validate: value => (systemUris.has(value?.toLowerCase()) && "Field has reserved system value") || null,
        });
    }
    if (pageDefinition.hasEditableUrlSegment && pageDefinition.type === "HomePage") {
        fieldDefinitions.push({
            name: "urlSegment",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "Translatable",
            tooltip: "URL path component identifying this page.",
            isRequired: false,
            sortOrder: 100,
            regularExpression: new RegExp("^[0-9a-zA-Z_\\-]*$"),
        });
    }

    fieldDefinitions.push({
        name: "horizontalRule",
        editorTemplate: "HorizontalRule",
        defaultValue: "",
        fieldType: "General",
        sortOrder: 9998,
    });

    fieldDefinitions.push({
        name: "tags",
        editorTemplate: "TagsField",
        defaultValue: [],
        fieldType: "General",
        sortOrder: 9999,
    });

    fieldDefinitions.push({
        name: "hideBreadcrumbs",
        editorTemplate: "CheckboxField",
        displayName: "Hide Breadcrumbs",
        defaultValue: false,
        fieldType: "General",
        sortOrder: 10000,
    });
}
