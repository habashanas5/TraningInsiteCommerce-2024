import { ApiParameter, get, HasPagingParameters } from "@insite/client-framework/Services/ApiService";
import {
    BrandAlphabetModel,
    BrandCategoryCollectionModel,
    BrandCollectionModel,
    BrandModel,
    BrandProductLineCollectionModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetBrandByPathApiParameter extends ApiParameter {
    path: string;
}

export interface GetBrandByIdApiParameter extends ApiParameter {
    brandId: string;
    expand?: "htmlContent"[];
    additionalExpands?: string[];
}

export interface GetBrandCategoriesApiParameter extends ApiParameter, HasPagingParameters {
    brandId: string;
    maximumDepth?: number;
    additionalExpands?: string[];
}

export interface GetBrandProductLinesApiParameter extends ApiParameter, HasPagingParameters {
    brandId: string;
    getFeatured?: boolean;
    additionalExpands?: string[];
}

export interface GetBrandsApiParameter extends ApiParameter, HasPagingParameters {
    select?: string;
    startsWith?: string;
    manufacturer?: string;
    expand?: string;
    brandIds?: string[];
    randomize?: boolean;
    additionalExpands?: string[];
}

const brandAlphabetUrl = "/api/v1/brandAlphabet";
const brandsUrl = "/api/v1/brands";

export function getBrandAlphabet() {
    return get<BrandAlphabetModel>(`${brandAlphabetUrl}/`, {});
}

export function getBrandById(parameter: GetBrandByIdApiParameter) {
    const parameters = { ...parameter };
    delete parameters.brandId;
    return get<BrandModel>(`${brandsUrl}/${parameter.brandId}`, parameters);
}

export function getBrandByPath(parameter: GetBrandByPathApiParameter) {
    return get<BrandModel>(`${brandsUrl}/getByPath`, parameter);
}

export function getBrandCategories(parameter: GetBrandCategoriesApiParameter) {
    const parameters = { ...parameter };
    delete parameters["brandId"];
    return get<BrandCategoryCollectionModel>(`${brandsUrl}/${parameter.brandId}/categories`, parameters);
}

export function getBrandProductLines(parameter: GetBrandProductLinesApiParameter) {
    const parameters = { ...parameter };
    delete parameters["brandId"];
    return get<BrandProductLineCollectionModel>(`${brandsUrl}/${parameter.brandId}/productlines`, parameters);
}

export function getBrands(parameter: GetBrandsApiParameter) {
    return get<BrandCollectionModel>(`${brandsUrl}/`, parameter);
}
