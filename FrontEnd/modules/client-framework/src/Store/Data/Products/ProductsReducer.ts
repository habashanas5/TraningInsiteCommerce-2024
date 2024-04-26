import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import {
    GetProductCollectionApiV2Parameter,
    GetRelatedProductCollectionApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import {
    assignById,
    replaceDataView,
    setDataViewLoaded,
    setDataViewLoading,
} from "@insite/client-framework/Store/Data/DataState";
import { ProductsDataView, ProductsState } from "@insite/client-framework/Store/Data/Products/ProductsState";
import { ProductCollectionModel, ProductModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: ProductsState = {
    isLoading: {},
    idByPath: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Products/BeginLoadProducts": (draft: Draft<ProductsState>, action: { parameter: object }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Products/CompleteLoadProducts": (
        draft: Draft<ProductsState>,
        action: { parameter: object; collection: ProductCollectionModel },
    ) => {
        const { parameter, collection } = action;

        setDataViewLoaded(
            draft,
            parameter,
            collection,
            collection => collection.products!,
            (product: ProductModel) => {
                draft.idByPath[product.canonicalUrl] = product.id;
            },
            (dataView: ProductsDataView) => {
                dataView.attributeTypeFacets = collection.attributeTypeFacets;
                dataView.brandFacets = collection.brandFacets;
                dataView.categoryFacets = collection.categoryFacets;
                dataView.correctedQuery = collection.correctedQuery;
                dataView.didYouMeanSuggestions = collection.didYouMeanSuggestions;
                dataView.exactMatch = collection.exactMatch;
                dataView.notAllProductsAllowed = collection.notAllProductsAllowed;
                dataView.notAllProductsFound = collection.notAllProductsFound;
                dataView.originalQuery = collection.originalQuery;
                dataView.priceRange = collection.priceRange;
                dataView.productLineFacets = collection.productLineFacets;
                dataView.searchTermRedirectUrl = collection.searchTermRedirectUrl;
            },
        );
    },

    "Data/Products/ReplaceDataView": (draft: Draft<ProductsState>, action: { parameter: object; dataView: object }) => {
        const { parameter, dataView } = action;
        replaceDataView(draft, parameter, dataView);
    },

    "Data/Products/BeginLoadProduct": (draft: Draft<ProductsState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/Products/CompleteLoadProduct": (
        draft: Draft<ProductsState>,
        action: { model: ProductModel; path?: string },
    ) => {
        if (action.path) {
            draft.idByPath[action.path] = action.model.id;
            delete draft.isLoading[action.path];
        }

        draft.idByPath[action.model.canonicalUrl] = action.model.id;

        delete draft.isLoading[action.model.id];
        assignById(draft, action.model);
    },

    "Data/Products/UpdateIdByPath": (draft: Draft<ProductsState>, action: { idByPath: SafeDictionary<string> }) => {
        for (const path in action.idByPath) {
            draft.idByPath[path] = action.idByPath[path]!;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
