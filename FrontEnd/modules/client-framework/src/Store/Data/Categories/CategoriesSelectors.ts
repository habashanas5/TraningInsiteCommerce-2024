import { GetCategoriesApiParameter } from "@insite/client-framework/Services/CategoryService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { HasCategoriesState } from "@insite/client-framework/Store/Data/Categories/CategoriesState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getCategoryState(state: HasCategoriesState, id: string | undefined) {
    return getById(state.data.categories, id);
}

export function getCategoriesDataView(state: ApplicationState, getCategoriesParameter?: GetCategoriesApiParameter) {
    return getDataView(state.data.categories, getCategoriesParameter);
}

export function getCategoryDepthLoaded(state: ApplicationState, categoryId: string) {
    return state.data.categories.categoryDepthLoaded[categoryId];
}

export function getSubCategoryIds(state: ApplicationState, categoryId: string) {
    return state.data.categories.parentCategoryIdToChildrenIds[categoryId];
}
