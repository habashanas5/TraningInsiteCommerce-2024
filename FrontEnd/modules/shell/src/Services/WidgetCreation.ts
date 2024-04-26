import { newGuid } from "@insite/client-framework/Common/StringHelpers";
import {
    createContextualIds,
    getContextualId,
    prepareFields,
} from "@insite/client-framework/Store/Data/Pages/PrepareFields";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { LoadedWidgetDefinition } from "@insite/shell/DefinitionTypes";
import { setDefaultFieldValues } from "@insite/shell/Services/PageCreation";
import { LanguageModel } from "@insite/shell/Store/ShellContext/ShellContextState";

export function setupWidgetModel(
    widgetDefinition: LoadedWidgetDefinition,
    parentId: string,
    zone: string,
    language: LanguageModel,
    defaultLanguageId: string,
    deviceType: DeviceType,
    personaId: string,
    defaultPersonaId: string,
) {
    const widget: WidgetProps = {
        parentId,
        zone,
        type: widgetDefinition.type,
        id: newGuid(),
        fields: {},
        generalFields: {},
        translatableFields: {},
        contextualFields: {},
        isLayout: false,
    };

    const contextualDeviceType = language.hasDeviceSpecificContent ? deviceType : "Desktop";
    const contextualPersonaId = language.hasPersonaSpecificContent ? personaId : defaultPersonaId;

    setDefaultFieldValues(
        widget,
        widgetDefinition.fieldDefinitions,
        language.id,
        getContextualId(language.id, contextualDeviceType, contextualPersonaId),
    );

    const contextualIds = createContextualIds(
        language.id,
        defaultLanguageId,
        deviceType,
        [personaId],
        defaultPersonaId,
    );

    prepareFields(widget, language.id, defaultLanguageId, contextualIds);

    return widget;
}
