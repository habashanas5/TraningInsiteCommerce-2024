import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { CatalogPage } from "@insite/client-framework/Services/CategoryService";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";

export interface CatalogPagesState extends DataViewState<CatalogPage> {
    idByPath: SafeDictionary<string>;
}
