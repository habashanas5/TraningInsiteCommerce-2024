import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import {
    Category,
    CategoryCollection,
    GetCategoriesApiParameter,
} from "@insite/client-framework/Services/CategoryService";
import { CategoriesState } from "@insite/client-framework/Store/Data/Categories/CategoriesState";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { Draft } from "immer";

const initialState: CategoriesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    parentCategoryIdToChildrenIds: {},
    categoryDepthLoaded: {},
    errorStatusCodeById: {},
};

const reducer = {
    "Data/Categories/BeginLoadCategories": (
        draft: Draft<CategoriesState>,
        action: { parameter: GetCategoriesApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Categories/CompleteLoadCategories": (
        draft: Draft<CategoriesState>,
        action: { parameter: GetCategoriesApiParameter; collection: CategoryCollection },
    ) => {
        const { parameter, collection } = action;
        const { parentCategoryIdToChildrenIds, categoryDepthLoaded } = draft;
        const { startCategoryId, includeStartCategory } = parameter;
        const maxDepth = parameter.maxDepth ?? 2;

        const loadCategories = (categoryIds: string[] | undefined, parentCategoryId: string, currentDepth: number) => {
            if (!categoryIds) {
                return;
            }

            categoryDepthLoaded[parentCategoryId] = Math.max(
                maxDepth - currentDepth,
                categoryDepthLoaded[parentCategoryId] || 0,
            );
            parentCategoryIdToChildrenIds[parentCategoryId] = categoryIds;

            for (const categoryId of categoryIds) {
                const category = collection.categoriesById[categoryId]!;
                if (category.subCategoryIds) {
                    loadCategories(category.subCategoryIds, categoryId, currentDepth + 1);
                }
            }
        };

        if (!startCategoryId) {
            loadCategories(collection.categoryIds, emptyGuid, 0);
        } else {
            let foundStartCategory = false;
            for (const categoryId of collection.categoryIds) {
                loadCategories(collection.categoriesById[categoryId]?.subCategoryIds, categoryId, 0);
                if (categoryId === startCategoryId) {
                    foundStartCategory = true;
                }
            }

            if (includeStartCategory && !foundStartCategory && draft.errorStatusCodeById) {
                draft.errorStatusCodeById[startCategoryId] = 404;
            }
        }

        setDataViewLoaded(draft, parameter, collection, collection =>
            Object.keys(collection.categoriesById).map(o => collection.categoriesById[o]!),
        );
    },

    "Data/Categories/CompleteLoadCategoriesById": (
        draft: Draft<CategoriesState>,
        action: { categoriesById: SafeDictionary<Category> },
    ) => {
        for (const categoryId in action.categoriesById) {
            assignById(draft, action.categoriesById[categoryId]!);
        }
    },

    "Data/Categories/BeginLoadCategory": (draft: Draft<CategoriesState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/Categories/CompleteLoadCategory": (draft: Draft<CategoriesState>, action: { model: Category }) => {
        delete draft.isLoading[action.model.id];
        assignById(draft, action.model);
    },

    "Data/Categories/FailedToLoadCategory": (
        draft: Draft<CategoriesState>,
        action: { categoryId: string; status: number },
    ) => {
        if (draft.errorStatusCodeById) {
            draft.errorStatusCodeById[action.categoryId] = action.status;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
