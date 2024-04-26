import { PageDefinition, WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";

export type LoadedWidgetDefinition = WidgetDefinition & HasType;
export type LoadedPageDefinition = PageDefinition & HasType;

export interface HasType {
    type: string;
}
