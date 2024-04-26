import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { CatalogPage } from "@insite/client-framework/Services/CategoryService";
import { CatalogPagesState } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesState";
import { Draft } from "immer";

const initialState: CatalogPagesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    idByPath: {},
};

const reducer = {
    "Data/CatalogPages/BeginLoadCatalogPage": (draft: Draft<CatalogPagesState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/CatalogPages/CompleteLoadCatalogPage": (
        draft: Draft<CatalogPagesState>,
        action: { model: CatalogPage; path?: string },
    ) => {
        const { model, path } = action;
        const lowerPath = path?.toLowerCase();
        const lowerCanonicalPath = model.canonicalPath.toLowerCase();

        if (lowerPath) {
            delete draft.isLoading[lowerPath];
            if (lowerPath !== lowerCanonicalPath) {
                draft.idByPath[lowerPath] = lowerCanonicalPath;
            }
        }
        // this looks weird, but means we always start from idByPath to get to the "id" which is really the canonicalPath
        draft.idByPath[lowerCanonicalPath] = lowerCanonicalPath;
        delete draft.isLoading[lowerCanonicalPath];
        draft.byId[lowerCanonicalPath] = model;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
