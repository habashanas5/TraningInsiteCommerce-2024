import { newGuid } from "@insite/client-framework/Common/StringHelpers";
import { Dictionary } from "@insite/client-framework/Common/Types";
import logger from "@insite/client-framework/Logger";
import { BasicLanguageModel } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getContextualId } from "@insite/client-framework/Store/Data/Pages/PrepareFields";
import FieldDefinition from "@insite/client-framework/Types/FieldDefinition";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { getPageDefinition, getWidgetDefinition } from "@insite/shell/DefinitionLoader";

export function setupPageModel(
    pageModel: PageModel,
    name: string,
    urlSegment: string,
    parentNodeId: string,
    sortOrder: number,
    language: BasicLanguageModel,
    personaId: string,
    defaultPersonaId: string,
    websiteId: string,
    isVariant: boolean,
    nodeId?: string,
    pageId?: string,
) {
    if (!pageModel.fields) {
        pageModel.fields = {};
    }
    if (isVariant) {
        pageModel.variantName = name;
    } else {
        pageModel.name = name;
    }
    pageModel.sortOrder = sortOrder;
    pageModel.websiteId = websiteId;
    pageModel.parentId = parentNodeId;

    // clean up any properties that we don't want at the root level anymore
    delete (pageModel as any)["url"];
    delete (pageModel as any)["title"];

    const guidMap: Dictionary<string> = {};
    guidMap[pageModel.id] = pageId ?? newGuid();

    for (const widget of pageModel.widgets) {
        guidMap[widget.id] = newGuid();
    }

    pageModel.id = guidMap[pageModel.id];
    if (!isVariant) {
        pageModel.nodeId = nodeId ?? newGuid();
    }

    const contextualId = getContextualId(
        language.id,
        "Desktop",
        language.hasPersonaSpecificContent ? personaId : defaultPersonaId,
    );

    if (!isVariant) {
        setFieldsToExistingValuesWithProperContext(pageModel, language.id, contextualId);
    }

    const pageDefinition = getPageDefinition(pageModel.type);
    if (!pageDefinition) {
        throw new Error(`There was no PageDefinition found for the type ${pageModel.type}`);
    }
    setDefaultFieldValues(pageModel, pageDefinition.fieldDefinitions, language.id, contextualId);

    for (const widget of pageModel.widgets) {
        widget.id = guidMap[widget.id];
        widget.parentId = guidMap[widget.parentId];

        setFieldsToExistingValuesWithProperContext(widget, language.id, contextualId);

        const widgetDefinition = getWidgetDefinition(widget.type);
        if (!widgetDefinition) {
            if (!IS_PRODUCTION) {
                throw new Error(`There was no WidgetDefinition found for the type ${widget.type}`);
            } else {
                logger.warn(`There was no WidgetDefinition found for the type ${widget.type}`);
            }
        }
        setDefaultFieldValues(widget, widgetDefinition.fieldDefinitions, language.id, contextualId);
    }

    if (isVariant) {
        return;
    }

    // I believe this is here because generic content pages all use a creator that has a generic title, and when someone creates a page the title should get auto set to match the name they enter
    if (pageDefinition.hasEditableTitle) {
        pageModel.translatableFields["title"][language.id] = name;
    }
    if (pageDefinition.hasEditableUrlSegment) {
        pageModel.translatableFields["urlSegment"][language.id] = urlSegment;
    }
}

export function initializeFields(item: WidgetProps | PageModel) {
    if (!item.fields) {
        item.fields = {};
    }
    if (!item.translatableFields) {
        item.translatableFields = {};
    }
    if (!item.contextualFields) {
        item.contextualFields = {};
    }
    if (!item.generalFields) {
        item.generalFields = {};
    }
}

function setFieldsToExistingValuesWithProperContext(
    item: WidgetProps | PageModel,
    currentLanguageId: string,
    contextualId: string,
) {
    initializeFields(item);

    const { translatableFields, contextualFields } = item;

    function doWork(theFields: Dictionary<Dictionary<string>>, key: string) {
        for (const field in theFields) {
            const currentValues = theFields[field];
            const firstValue = currentValues[Object.keys(currentValues)[0]];
            theFields[field] = {};
            theFields[field][key] = firstValue;
        }
    }

    doWork(translatableFields, currentLanguageId);

    doWork(contextualFields, contextualId);
}

export function setDefaultFieldValues(
    item: WidgetProps | PageModel,
    fieldDefinitions: FieldDefinition[] | undefined,
    currentLanguageId: string,
    contextualId: string,
) {
    initializeFields(item);
    const { fields, translatableFields, contextualFields, generalFields } = item;

    if (!fieldDefinitions) {
        return;
    }

    for (const fieldDefinition of fieldDefinitions) {
        const { name, fieldType } = fieldDefinition;
        if (typeof fields[name] === "undefined") {
            fields[name] = fieldDefinition.defaultValue;
        }

        if (fieldType === "Translatable" && typeof translatableFields[name] === "undefined") {
            translatableFields[name] = {};
            translatableFields[name][currentLanguageId] = fields[name];
        } else if (fieldType === "Contextual" && typeof contextualFields[name] === "undefined") {
            contextualFields[name] = {};
            contextualFields[name][contextualId] = fields[name];
        } else if (fieldType === "General" && typeof generalFields[name] === "undefined") {
            generalFields[name] = fields[name];
        }
    }
}
