import { SettingsModel } from "@insite/client-framework/Services/SettingsService";
import { HasCategoriesState } from "@insite/client-framework/Store/Data/Categories/CategoriesState";
import { HasLinksState } from "@insite/client-framework/Store/Links/LinksState";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import PageProps from "@insite/client-framework/Types/PageProps";
import { TabDefinition } from "@insite/client-framework/Types/TabDefinition";
import { GridWidths } from "@insite/mobius/GridItem";
import { ThunkDispatch } from "redux-thunk";

export interface MultilineTextFieldDefinition extends BaseFieldDefinition<"MultilineTextField"> {
    placeholder?: string;
}

export interface RichTextFieldDefinition extends BaseFieldDefinition<"RichTextField"> {
    placeholder?: string;
    extendedConfig?: object;
    collapsedToolbarButtons?: object;
    expandedToolbarButtons?: object;
}

export interface CodeSnippetFieldDefinition extends BaseFieldDefinition<"CodeSnippetField"> {
    placeholder?: string;
}

export interface IntegerFieldDefinition extends BaseFieldDefinition<"IntegerField", number | null> {
    placeholder?: string;
    min?: number;
    max?: number;
}

export interface DropDownFieldDefinition<TValue> extends BaseFieldDefinition<"DropDownField", TValue> {
    options: Option<TValue>[] | (() => Promise<Option<TValue>[]>);
    hideEmptyOption?: boolean;
    customFilter?: (item: Option<string | number>, page: PageProps, settings: SettingsModel) => boolean;
}

export interface SystemListDropDownFieldDefinition extends BaseFieldDefinition<"SystemListDropDownField", string> {
    systemListName: string;
}

export interface RadioButtonsDefinition<TValue> extends BaseFieldDefinition<"RadioButtonsField", TValue> {
    options: RadioButtonOption<TValue>[];
}

export interface CheckboxFieldDefinition extends BaseFieldDefinition<"CheckboxField", boolean> {
    variant?: "default" | "toggle";
}

export interface ListFieldDefinition extends BaseFieldDefinition<"ListField", HasFields[]> {
    /**
     * Determines what value will be displayed in a given row. This uses ShellState as it runs in the shell, not the storefront.
     */
    getDisplay: (
        item: HasFields,
        state: HasLinksState & HasCategoriesState,
    ) => string | ((dispatch: ThunkDispatch<HasLinksState, void, any>) => void);
    /**
     * The fields that exist on each item in the list. Note that the fieldType is not supported at this level.
     */
    fieldDefinitions: ChildFieldDefinition[];
    onEditRow?: (index: number, dispatch: ThunkDispatch<HasLinksState, void, any>) => void;
    onDoneEditingRow?: (dispatch: ThunkDispatch<HasLinksState, void, any>) => void;
    onLoad?: (dispatch: ThunkDispatch<HasLinksState, void, any>) => void;
    hideEdit?: boolean;
    hideAdd?: boolean;
    hideDelete?: boolean;
}

export interface RadioButtonOption<TValue> extends Option<TValue> {
    tooltip?: string;
}

export interface Option<TValue> {
    value: TValue;
    displayName?: string;
}

export interface TextFieldDefinition extends BaseFieldDefinition<"TextField"> {
    placeholder?: string;
    maxLength?: number;
}

export interface HorizontalRuleDefinition extends BaseFieldDefinition<"HorizontalRule"> {}

export interface TagsDefinition extends BaseFieldDefinition<"TagsField", string[]> {}

export interface LinkFieldDefinition extends BaseFieldDefinition<"LinkField", LinkFieldValue> {
    allowUrls?: (item: HasFields) => boolean;
    allowCategories?: (item: HasFields) => boolean;
    showCategoryRoot?: (item: HasFields) => boolean;
}

export interface ColorPickerFieldDefinition extends BaseFieldDefinition<"ColorPickerField", string> {}

export interface ImagePickerFieldDefinition extends BaseFieldDefinition<"ImagePickerField", string> {}
export interface SelectBrandsFieldDefinition extends BaseFieldDefinition<"SelectBrandsField", string[]> {}

export interface CategoriesFieldDefinition extends BaseFieldDefinition<"CategoriesField", string[]> {
    singleCategorySelection?: (item: HasFields) => boolean;
}

export interface ColumnsDefinition extends BaseFieldDefinition<"ColumnsField", GridWidths[]> {}

export interface ColumnAlignmentDefinition extends BaseFieldDefinition<"ColumnAlignmentField", ColumnAlignment[]> {}

export type ColumnAlignment = "top" | "middle" | "bottom";

export interface DateTimeFieldDefinition extends BaseFieldDefinition<"DateTimeField", Date | null> {}

export interface LinkFieldValue {
    type: "Url" | "Page" | "Category";
    value: string;
}

export interface BaseFieldDefinition<TEditorTemplate extends string, TValue = string> {
    name: string;
    displayName?: string;
    isVisible?: (item: HasFields) => boolean;
    isEnabled?: (item?: HasFields) => boolean;
    defaultValue: TValue;
    editorTemplate: TEditorTemplate;
    fieldType: FieldType;
    tooltip?: string;
    isRequired?: boolean;
    regularExpression?: RegExp;
    tab?: TabDefinition;
    sortOrder?: number;
    /* An optional validation function that returns a string describing an error, or null if no error. */
    validate?: (value: TValue, item: HasFields) => string | null;
    /* Used to validate dependent fields after current field change */
    dependentFields?: string[];
}

type FieldDefinition =
    | TextFieldDefinition
    | MultilineTextFieldDefinition
    | RichTextFieldDefinition
    | CodeSnippetFieldDefinition
    | IntegerFieldDefinition
    | DropDownFieldDefinition<string>
    | DropDownFieldDefinition<number>
    | SystemListDropDownFieldDefinition
    | RadioButtonsDefinition<string>
    | RadioButtonsDefinition<number>
    | CheckboxFieldDefinition
    | HorizontalRuleDefinition
    | TagsDefinition
    | ListFieldDefinition
    | LinkFieldDefinition
    | ColorPickerFieldDefinition
    | ImagePickerFieldDefinition
    | SelectBrandsFieldDefinition
    | CategoriesFieldDefinition
    | ColumnsDefinition
    | ColumnAlignmentDefinition
    | DateTimeFieldDefinition;
// eslint-disable-next-line semi-style

/** A modification of the standard `FieldDefinition` where field type is removed, covered by a parent field. */
export type ChildFieldDefinition =  // Omit<FieldDefinition, "fieldType"> would be nicer than a second list but doesn't work correctly as of TypeScript 3.7.1-rc.
    | Omit<TextFieldDefinition, "fieldType">
    | Omit<MultilineTextFieldDefinition, "fieldType">
    | Omit<RichTextFieldDefinition, "fieldType">
    | Omit<CodeSnippetFieldDefinition, "fieldType">
    | Omit<IntegerFieldDefinition, "fieldType">
    | Omit<DropDownFieldDefinition<string>, "fieldType">
    | Omit<DropDownFieldDefinition<number>, "fieldType">
    | Omit<SystemListDropDownFieldDefinition, "fieldType">
    | Omit<RadioButtonsDefinition<string>, "fieldType">
    | Omit<RadioButtonsDefinition<number>, "fieldType">
    | Omit<CheckboxFieldDefinition, "fieldType">
    | Omit<HorizontalRuleDefinition, "fieldType">
    | Omit<TagsDefinition, "fieldType">
    | Omit<ListFieldDefinition, "fieldType">
    | Omit<LinkFieldDefinition, "fieldType">
    | Omit<ColorPickerFieldDefinition, "fieldType">
    | Omit<ImagePickerFieldDefinition, "fieldType">
    | Omit<SelectBrandsFieldDefinition, "fieldType">
    | Omit<CategoriesFieldDefinition, "fieldType">
    | Omit<ColumnsDefinition, "fieldType">
    | Omit<ColumnAlignmentDefinition, "fieldType">
    | Omit<DateTimeFieldDefinition, "fieldType">;
// eslint-disable-next-line semi-style

export default FieldDefinition;

export type FieldType = "General" | "Contextual" | "Translatable";

export const AdvancedTab: TabDefinition = {
    displayName: "Advanced",
    sortOrder: 10,
    dataTestSelector: "advancedTab",
};

function field(
    name: string,
    editorTemplate: "CheckboxField" | "TextField" | "HorizontalRule" | "ImagePickerField",
    defaultValue: any,
    fieldType: FieldType,
    sortOrder: number,
    tab?: TabDefinition,
): FieldDefinition {
    return {
        name,
        editorTemplate,
        defaultValue,
        fieldType,
        sortOrder,
        tab,
    };
}

export const MetaKeywords: FieldDefinition = field("metaKeywords", "TextField", "", "Translatable", 200);
export const MetaDescription: FieldDefinition = field("metaDescription", "TextField", "", "Translatable", 210);
export const OpenGraphTitle: FieldDefinition = field(
    "openGraphTitle",
    "TextField",
    "",
    "Translatable",
    100,
    AdvancedTab,
);
export const OpenGraphUrl: FieldDefinition = field("openGraphUrl", "TextField", "", "Translatable", 110, AdvancedTab);
export const OpenGraphImage: FieldDefinition = field(
    "openGraphImage",
    "ImagePickerField",
    "",
    "Translatable",
    110,
    AdvancedTab,
);
export const HideHeader: FieldDefinition = field("hideHeader", "CheckboxField", false, "General", 200, AdvancedTab);
export const HideFooter: FieldDefinition = field("hideFooter", "CheckboxField", false, "General", 210, AdvancedTab);
export const HideFromSearchEngines: FieldDefinition = field(
    "hideFromSearchEngines",
    "CheckboxField",
    false,
    "General",
    220,
    AdvancedTab,
);
export const HideFromSiteSearch: FieldDefinition = field(
    "hideFromSiteSearch",
    "CheckboxField",
    false,
    "General",
    230,
    AdvancedTab,
);
export const ExcludeFromNavigation: FieldDefinition = field(
    "excludeFromNavigation",
    "CheckboxField",
    false,
    "General",
    240,
    AdvancedTab,
);
export const ExcludeFromSignInRequired: FieldDefinition = field(
    "excludeFromSignInRequired",
    "CheckboxField",
    false,
    "General",
    250,
    AdvancedTab,
);
export const HorizontalRule: FieldDefinition = field("horizontalRule", "HorizontalRule", "", "General", 0);
