import { ChildFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import { getTemplate, loadEditorTemplates } from "@insite/shell-public/EditorTemplatesLoader";
import MissingField from "@insite/shell/Components/ItemEditor/MissingField";
import * as React from "react";

const templates = require.context("../EditorTemplates", true, /\.tsx$/);
loadEditorTemplates(templates);

export function getEditorTemplate(
    fieldDefinition: Pick<ChildFieldDefinition, "editorTemplate">,
    props: EditorTemplateProps<any, ChildFieldDefinition>,
) {
    const loadedTemplate = getTemplate(fieldDefinition.editorTemplate);
    if (typeof loadedTemplate !== "undefined") {
        return React.createElement(loadedTemplate, props);
    }

    return React.createElement(MissingField, props);
}
