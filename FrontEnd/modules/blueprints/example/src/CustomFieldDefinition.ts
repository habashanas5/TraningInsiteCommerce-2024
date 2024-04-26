import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import FieldDefinition, {
    BaseFieldDefinition,
    ChildFieldDefinition,
} from "@insite/client-framework/Types/FieldDefinition";

// When a field definition uses the editorTemplate CustomTemplate, then the extraLabel property will need to be defined on it
export interface CustomTemplateDefinition extends BaseFieldDefinition<"CustomTemplate"> {
    extraLabel: string;
}

// We need to extend the base FieldDefinition with any custom FieldDefinitions we are going to define
export type CustomFieldDefinition = FieldDefinition | CustomTemplateDefinition;

// These next two types allows us to get proper typing in our editor templates
export type CustomChildFieldDefinition = ChildFieldDefinition | Omit<CustomTemplateDefinition, "fieldType">;

export interface CustomEditorTemplateProps<TFieldValue, TFieldDefinition extends CustomChildFieldDefinition> {
    fieldDefinition: TFieldDefinition;
    fieldValue: TFieldValue;
    item: HasFields;
    updateField: (fieldName: string, value: TFieldValue) => void;
}
