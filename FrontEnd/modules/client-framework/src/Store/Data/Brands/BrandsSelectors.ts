import {
    GetBrandCategoriesApiParameter,
    GetBrandProductLinesApiParameter,
    GetBrandsApiParameter,
} from "@insite/client-framework/Services/BrandService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { dataViewNotFound, getById, getDataView, getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { createContext } from "react";

export function getBrandStateById(state: ApplicationState, brandId: string | undefined) {
    return getById(state.data.brands, brandId);
}

export function getBrandStateByPath(state: ApplicationState, path: string | undefined) {
    return getById(state.data.brands, path, id => state.data.brands.idByPath[id]);
}

export function getAllBrandsDataView(state: ApplicationState) {
    return getDataView(state.data.brands, { key: "AllBrands" });
}

export function getBrandCategoriesDataView(state: ApplicationState, parameter: GetBrandCategoriesApiParameter) {
    const dataView = state.data.brands.brandCategoryDataView[getDataViewKey(parameter)];
    if (dataView) {
        return dataView;
    }
    return dataViewNotFound;
}

export function getBrandProductLinesDataView(state: ApplicationState, parameter: GetBrandProductLinesApiParameter) {
    const dataView = state.data.brands.brandProductLineDataView[getDataViewKey(parameter)];
    if (dataView) {
        return dataView;
    }
    return dataViewNotFound;
}

export function getBrandsDataView(state: ApplicationState, parameter: GetBrandsApiParameter) {
    return getDataView(state.data.brands, parameter);
}

export const BrandStateContext = createContext<ReturnType<typeof getBrandStateById>>({
    value: undefined,
    isLoading: false,
    errorStatusCode: undefined,
    id: undefined,
});
export const BrandCategoriesStateContext = createContext<ReturnType<typeof getBrandCategoriesDataView>>({
    value: undefined,
    isLoading: false,
});
export const BrandProductLinesStateContext = createContext<ReturnType<typeof getBrandProductLinesDataView>>({
    value: undefined,
    isLoading: false,
});
