import { Dictionary } from "@insite/client-framework/Common/Types";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { ChildFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";

export function validateField(fieldDefinition: ChildFieldDefinition, item: HasFields) {
    if (fieldDefinition.isVisible && !fieldDefinition.isVisible(item)) {
        return;
    }

    const value = item.fields[fieldDefinition.name];
    let validationError: string | null = null;
    if (fieldDefinition.isRequired && (value === "" || value === undefined || value === null || value?.value === "")) {
        validationError = "A value must be provided.";
    }

    if (!validationError) {
        if (fieldDefinition.regularExpression && !fieldDefinition.regularExpression.test(value)) {
            validationError = "A valid value must be provided.";
        }
    }

    if (!validationError) {
        const validate = fieldDefinition.validate;
        if (validate) {
            validationError = validate(value as never, item); // as never because TypeScript 3.7.0 is confused
        }
    }

    return validationError;
}

export function validateItem(fieldDefinitions: ChildFieldDefinition[], item: HasFields) {
    const validationErrors: Dictionary<string> = {};

    for (const fieldDefinition of fieldDefinitions) {
        const validationError = validateField(fieldDefinition, item);
        if (validationError) {
            validationErrors[fieldDefinition.name] = validationError;
        }
    }

    return validationErrors;
}
