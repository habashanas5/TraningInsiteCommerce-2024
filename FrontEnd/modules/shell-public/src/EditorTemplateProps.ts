import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { ChildFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";

export interface EditorTemplateProps<TFieldValue, TFieldDefinition extends ChildFieldDefinition> {
    fieldDefinition: TFieldDefinition;
    fieldValue: TFieldValue;
    item: HasFields;
    updateField: (fieldName: string, value: TFieldValue) => void;
}
