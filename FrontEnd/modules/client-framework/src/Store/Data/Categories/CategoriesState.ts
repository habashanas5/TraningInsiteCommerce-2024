import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { Category } from "@insite/client-framework/Services/CategoryService";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";

export interface CategoriesState extends DataViewState<Category> {
    readonly categoryDepthLoaded: Dictionary<number>;
    readonly parentCategoryIdToChildrenIds: SafeDictionary<readonly string[]>;
}

export interface HasCategoriesState {
    data: {
        categories: CategoriesState;
    };
}
