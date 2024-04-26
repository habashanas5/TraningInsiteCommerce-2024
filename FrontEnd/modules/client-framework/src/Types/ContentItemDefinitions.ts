import { SettingsModel } from "@insite/client-framework/Services/SettingsService";
import FieldDefinition from "@insite/client-framework/Types/FieldDefinition";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { WidgetGroup } from "@insite/client-framework/Types/WidgetGroups";

export interface WidgetDefinition<T = FieldDefinition> extends ContentItemDefinition<T> {
    allowedContexts?: string[];
    isDeprecated?: true;
    group: WidgetGroup;
    icon?: string;
    isSystem?: boolean;
    canAdd?: (context: { permissions?: PermissionsModel; settings: SettingsModel }) => boolean;
}

export interface ContentItemDefinition<T = FieldDefinition> {
    displayName?: string;
    fieldDefinitions?: T[];
}

export interface PageDefinition<T = FieldDefinition> extends ContentItemDefinition<T> {
    hasEditableUrlSegment: boolean;
    hasEditableTitle: boolean;
    supportsProductSelection?: true;
    supportsCategorySelection?: true;
    supportsBrandSelection?: true;
    pageType: "System" | "Content";
    allowedParents?: string[];
    allowedChildren?: string[];
}
