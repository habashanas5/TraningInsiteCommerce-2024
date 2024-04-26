import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import {
    GetBrandCategoriesApiParameter,
    GetBrandProductLinesApiParameter,
} from "@insite/client-framework/Services/BrandService";
import { BrandsState, DateViewCollection } from "@insite/client-framework/Store/Data/Brands/BrandsState";
import { getDataViewKey, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import {
    BrandCategoryCollectionModel,
    BrandCategoryModel,
    BrandCollectionModel,
    BrandModel,
    BrandProductLineCollectionModel,
    BrandProductLineModel,
} from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: BrandsState = {
    isLoading: {},
    byId: {},
    idByPath: {},
    dataViews: {},
    brandCategoryDataView: {},
    brandProductLineDataView: {},
};

const reducer = {
    "Data/Brands/BeginLoadBrands": (draft: Draft<BrandsState>, action: { parameter: object }) => {
        setDataViewLoading(draft, action.parameter);
    },
    "Data/Brands/CompleteLoadBrands": (
        draft: Draft<BrandsState>,
        action: { parameter: object; collection: BrandCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.brands!);
    },
    "Data/Brands/BeginLoadCategories": (
        draft: Draft<BrandsState>,
        action: { parameter: GetBrandCategoriesApiParameter },
    ) => {
        draft.brandCategoryDataView[getDataViewKey(action.parameter)] = {
            isLoading: true,
            value: undefined,
        };
    },
    "Data/Brands/CompleteLoadCategories": (
        draft: Draft<BrandsState>,
        action: { parameter: GetBrandCategoriesApiParameter; collection: BrandCategoryCollectionModel },
    ) => {
        const dataView: DateViewCollection<BrandCategoryModel> = {
            isLoading: false,
            value: action.collection.brandCategories,
            pagination: action.collection.pagination ? action.collection.pagination : undefined,
            properties: action.collection.properties ? action.collection.properties : {},
            fetchedDate: new Date(),
        };

        draft.brandCategoryDataView[getDataViewKey(action.parameter)] = dataView;
    },
    "Data/Brands/BeginLoadProductLines": (
        draft: Draft<BrandsState>,
        action: { parameter: GetBrandProductLinesApiParameter },
    ) => {
        draft.brandProductLineDataView[getDataViewKey(action.parameter)] = {
            isLoading: true,
            value: undefined,
        };
    },
    "Data/Brands/CompleteLoadProductLines": (
        draft: Draft<BrandsState>,
        action: { parameter: GetBrandProductLinesApiParameter; collection: BrandProductLineCollectionModel },
    ) => {
        const dataView: DateViewCollection<BrandProductLineModel> = {
            isLoading: false,
            value: action.collection.productLines,
            pagination: action.collection.pagination ? action.collection.pagination : undefined,
            properties: action.collection.properties ? action.collection.properties : {},
            fetchedDate: new Date(),
        };

        draft.brandProductLineDataView[getDataViewKey(action.parameter)] = dataView;
    },
    "Data/Brands/BeginLoadBrandByPath": (draft: Draft<BrandsState>, action: { path: string }) => {
        draft.isLoading[action.path] = true;
    },
    "Data/Brands/CompleteLoadBrandByPath": (
        draft: Draft<BrandsState>,
        action: { path: string; brand?: BrandModel },
    ) => {
        delete draft.isLoading[action.path];
        if (!action.brand) {
            return;
        }
        delete draft.isLoading[action.brand.id];
        draft.byId[action.brand.id] = action.brand;
        draft.idByPath[action.path] = action.brand.id;
    },
    "Data/Brands/BeginLoadBrand": (draft: Draft<BrandsState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },
    "Data/Brands/CompleteLoadBrand": (draft: Draft<BrandsState>, action: { id: string; brand: BrandModel }) => {
        delete draft.isLoading[action.id];
        draft.byId[action.brand.id] = action.brand;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
