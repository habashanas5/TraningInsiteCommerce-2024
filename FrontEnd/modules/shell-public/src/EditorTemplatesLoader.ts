import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { ChildFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import * as React from "react";

type RequireContext = __WebpackModuleApi.RequireContext;

export type EditorTemplateComponent = React.ComponentType<EditorTemplateProps<any, ChildFieldDefinition>>;

const templates: SafeDictionary<EditorTemplateComponent> = {};

let hotUpdate: () => void;

export function setEditorTemplatesHotUpdate(value: () => void) {
    hotUpdate = value;
}

export function loadEditorTemplates(foundItems: RequireContext) {
    actuallyLoadTemplates(foundItems);

    const onHotReplace = (replacements: RequireContext) => {
        actuallyLoadTemplates(replacements);

        if (hotUpdate) {
            hotUpdate();
        }
    };

    return onHotReplace;
}

function actuallyLoadTemplates(foundItems: RequireContext) {
    for (const foundItemKey of foundItems.keys()) {
        const type = foundItemKey.replace("./", "").replace(".tsx", "");
        const component = foundItems(foundItemKey);

        if (!component.default) {
            continue;
        }

        templates[type] = component.default;
    }
}

export function getTemplate(type: string) {
    return templates[type];
}
