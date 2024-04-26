import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { ApiParameter, get } from "@insite/client-framework/Services/ApiService";
import {
    BaseModel,
    CatalogPageModel,
    CategoryCollectionModel,
    CategoryModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetCatalogPageByPathApiParameter extends ApiParameter {
    path: string;
}

export interface GetCategoryByIdApiParameter extends ApiParameter {
    id: string;
}

export interface GetCategoriesApiParameter extends ApiParameter {
    maxDepth?: number;
    startCategoryId?: string;
    includeStartCategory?: boolean;
}

const catalogPagesUrl = "/api/v1/catalogPages";
const categoriesUrl = "/api/v1/categories";

export type CatalogPage = Omit<CatalogPageModel, "category"> & {
    categoryId?: string;
    categoryIdWithBrandId?: string;
};

export interface CatalogPageResult {
    catalogPage: CatalogPage;
    categoriesById: SafeDictionary<Category>;
}

export async function getCatalogPageByPath(parameter: GetCatalogPageByPathApiParameter): Promise<CatalogPageResult> {
    const catalogPageModel = await get<CatalogPageModel>(`${catalogPagesUrl}`, parameter);
    const category = catalogPageModel.category ?? undefined;
    delete catalogPageModel.category;

    (catalogPageModel as CatalogPage).categoryId = category?.id;

    if (catalogPageModel.brandId && category) {
        addBrandToId(category, catalogPageModel.brandId);
        (catalogPageModel as CatalogPage).categoryIdWithBrandId = category.id;
    }

    const categoriesById: SafeDictionary<Category> = {};
    if (category) {
        cleanCategory(category, categoriesById, 1);
    }

    return {
        catalogPage: catalogPageModel,
        categoriesById,
    };
}

// when we retrieve a category in the context of a brand, some of the properties may be different. We store them by categoryId:brandId
// so that everything on the site just works
function addBrandToId(category: CategoryModel, brandId: string) {
    category.id = `${category.id}:${brandId}`;
    category.subCategories?.forEach(o => addBrandToId(o, brandId));
}

function cleanCategory(category: CategoryModel, categoriesById: SafeDictionary<Category>, subCategoryLevels: number) {
    const subCategories = category.subCategories;
    subCategories?.sort((a, b) => a.sortOrder - b.sortOrder || a.shortDescription.localeCompare(b.shortDescription));
    delete category.subCategories;
    const actualCategory = category as any as Category;
    if (subCategoryLevels > 0 && subCategories) {
        const subCategoryIds = [];
        for (const subCategory of subCategories) {
            subCategoryIds.push(subCategory.id);
            cleanCategory(subCategory, categoriesById, subCategoryLevels - 1);
            delete subCategory.htmlContent;
        }
        actualCategory.subCategoryIds = subCategoryIds;
    }

    categoriesById[category.id] = actualCategory;
}

export type Category = Omit<CategoryModel, "subCategories"> & {
    subCategoryIds?: string[];
};

export interface CategoryCollection extends BaseModel {
    categoryIds: string[];
    categoriesById: SafeDictionary<Category>;
}

export async function getCategories(parameter: GetCategoriesApiParameter) {
    const categoryCollectionModel = await get<CategoryCollectionModel>(`${categoriesUrl}/`, parameter);

    const categoriesById = {};
    const categoryIds = [];
    for (const category of categoryCollectionModel.categories!) {
        categoryIds.push(category.id);
        cleanCategory(category, categoriesById, parameter.maxDepth ? parameter.maxDepth - 1 : 2);
        delete category.htmlContent;
    }

    const categoryCollection = {
        properties: categoryCollectionModel.properties,
        uri: categoryCollectionModel.uri,
        categoryIds,
        categoriesById,
    };

    return categoryCollection;
}

export async function getCategoryById(parameter: GetCategoryByIdApiParameter) {
    const categoryModel = await get<CategoryModel>(`${categoriesUrl}/${parameter.id}`, parameter);
    const categoriesById: SafeDictionary<Category> = {};
    cleanCategory(categoryModel, categoriesById, 0);

    return categoriesById[categoryModel.id]!;
}
