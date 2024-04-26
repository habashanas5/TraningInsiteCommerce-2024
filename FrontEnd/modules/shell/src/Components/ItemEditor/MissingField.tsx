import { ChildFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import * as React from "react";

const MissingField: React.FC<EditorTemplateProps<string, ChildFieldDefinition>> = ({
    fieldDefinition: { editorTemplate, name },
}) => (
    <span>
        There was no component '${editorTemplate}' found for the fieldDefinition '${name}'
    </span>
);

export default MissingField;
