import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import PageProps from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";

export interface PagesState extends DataViewState<PageProps> {
    readonly idByPath: SafeDictionary<string>;
    readonly idByType: SafeDictionary<string>;
    readonly widgetIdsByPageId: Dictionary<readonly string[]>;
    readonly widgetsById: Dictionary<Readonly<WidgetProps>>;
    readonly widgetIdsByPageIdParentIdAndZone: Dictionary<Dictionary<Dictionary<readonly string[]>>>;
    readonly location: Location;
    readonly draggingWidgetId?: string;
    readonly pageDefinitionsByType?: SafeDictionary<Pick<PageDefinition, "pageType">>;
    readonly bypassedAuthorization: SafeDictionary<true>;
    readonly requiresAuthorizationByPageId: SafeDictionary<boolean>;
    readonly alternateLanguageUrlsByPageId: SafeDictionary<SafeDictionary<string>>;
}

const frozenEmptyObject = Object.freeze({});

export const nullPage = Object.freeze({
    name: "",
    id: "",
    nodeId: "",
    sortOrder: 0,
    parentId: "",
    type: "NullPage",
    fields: frozenEmptyObject,
    generalFields: frozenEmptyObject,
    translatableFields: frozenEmptyObject,
    contextualFields: frozenEmptyObject,
} as PageProps);
