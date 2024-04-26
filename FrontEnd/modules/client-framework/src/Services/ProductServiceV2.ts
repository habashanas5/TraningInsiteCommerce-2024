import { ApiParameter, get, HasPagingParameters, post } from "@insite/client-framework/Services/ApiService";
import {
    CatalogPageModel,
    ProductCollectionModel,
    ProductModel,
    RealTimeInventoryModel,
    RealTimePricingModel,
} from "@insite/client-framework/Types/ApiModels";

const catalogPagesUrl = "/api/v1/catalogpages";
const realTimePricingUrl = "/api/v1/realtimepricing";
const realTimeInventoryUrl = "/api/v1/realtimeinventory";
const productsUrl = "/api/v2/products";

export type ProductExpandTokens = (
    | "detail"
    | "content"
    | "images"
    | "documents"
    | "specifications"
    | "properties"
    | "attributes"
    | "variantTraits"
    | "facets"
    | "warehouses"
    | "scoreexplanation"
)[];

export interface GetProductApiV2ParameterBase extends ApiParameter {
    expand?: ProductExpandTokens;
    additionalExpands?: string[];
    includeAttributes?: ("includeOnProduct" | "comparable" | "facets")[];
}

export type ProductFilterTokens =
    | "frequentlyPurchased"
    | "recentlyPurchased"
    | "alsoPurchased"
    | "recentlyViewed"
    | "topSellers"
    | "siteCrosssells";

export interface GetProductCollectionApiV2Parameter extends GetProductApiV2ParameterBase, HasPagingParameters {
    search?: string;
    categoryId?: string;
    productIds?: string[];
    names?: string[];
    searchWithin?: string;
    brandIds?: string[];
    makeBrandUrls?: boolean;
    productLineIds?: string[];
    attributeValueIds?: string[];
    priceFilters?: string[];
    filter?: ProductFilterTokens;
    topSellersCategoryIds?: string[];
    topSellersPersonaIds?: string[];
    /** @deprecated Use pageSize instead. */
    topSellersMaxResults?: number;
    includeSuggestions?: boolean;
    applyPersonalization?: boolean;
    stockedItemsOnly?: boolean;
    previouslyPurchasedProducts?: boolean;
    cartId?: string;
    extendedNames?: string[];
}

export interface GetProductByPathApiV2Parameter extends GetProductApiV2ParameterBase {
    path: string;
    styledOption?: string;
    addToRecentlyViewed?: boolean;
}

export interface GetProductByIdApiV2Parameter extends GetProductApiV2ParameterBase {
    id: string;
    unitOfMeasure?: string;
    alsoPurchasedMaxResults?: number;
}

interface ProductPriceParameter {
    productId: string;
    unitOfMeasure: string;
    qtyOrdered: number;
    configuration?: string[];
}

export interface GetProductRealTimePriceApiV2Parameter extends ApiParameter, ProductPriceParameter {}

export interface GetProductCollectionRealTimePriceApiV2Parameter extends ApiParameter {
    productPriceParameters: ProductPriceParameter[];
}

export interface GetProductRealTimeInventoryApiV2Parameter extends ApiParameter {
    productId: string;
    configuration?: string[];
    expand?: "warehouses"[];
}

export interface GetProductCollectionRealTimeInventoryApiV2Parameter extends ApiParameter {
    productIds: string[];
    configurations?: { [productId: string]: string[] };
    expand?: string[];

    /**
     * @deprecated Wrong naming, use configurations instead.
     */
    configuration?: { [productId: string]: string[] };
}

export interface GetProductVariantChildrenApiV2Parameter extends GetProductApiV2ParameterBase, HasPagingParameters {
    productId: string;
}

export interface GetProductVariantChildApiV2Parameter extends GetProductApiV2ParameterBase {
    variantParentId: string;
    id: string;
}

export enum ConfigurationType {
    None = "None",
    Standard = "Standard",
    Fixed = "Fixed",
    Advanced = "Advanced",
}

export function getProductCollectionV2(parameter: GetProductCollectionApiV2Parameter) {
    return get<ProductCollectionModel>(productsUrl, parameter);
}

export interface GetRelatedProductCollectionApiV2Parameter extends GetProductApiV2ParameterBase, HasPagingParameters {
    productId: string;
    relationship: string;
}

export function getRelatedProductsCollectionV2(parameter: GetRelatedProductCollectionApiV2Parameter) {
    const productId = parameter.productId;
    delete parameter.productId;
    return get<ProductCollectionModel>(`${productsUrl}/${productId}/relatedproducts`, parameter);
}

export async function getProductRealTimePrice(parameter: GetProductRealTimePriceApiV2Parameter) {
    const pricing = await getProductCollectionRealTimePrices({
        additionalQueryStringParameters: parameter.additionalQueryStringParameters,
        productPriceParameters: [
            {
                productId: parameter.productId,
                unitOfMeasure: parameter.unitOfMeasure,
                qtyOrdered: parameter.qtyOrdered,
                configuration: parameter.configuration,
            },
        ],
    });

    return pricing.realTimePricingResults?.find(o => o.productId === parameter.productId);
}

export function getProductCollectionRealTimePrices(parameter: GetProductCollectionRealTimePriceApiV2Parameter) {
    return post<GetProductCollectionRealTimePriceApiV2Parameter, RealTimePricingModel>(`${realTimePricingUrl}`, {
        productPriceParameters: parameter.productPriceParameters,
    });
}

export async function getProductRealTimeInventory(parameter: GetProductRealTimeInventoryApiV2Parameter) {
    const realTimeInventoryModel = await getProductCollectionRealTimeInventory({
        expand: parameter.expand,
        productIds: [parameter.productId],
        additionalQueryStringParameters: parameter.additionalQueryStringParameters,
        configurations: parameter.configuration ? { [parameter.productId]: parameter.configuration } : undefined,
    });

    return realTimeInventoryModel.realTimeInventoryResults?.find(o => o.productId === parameter.productId);
}

export function getProductCollectionRealTimeInventory(parameter: GetProductCollectionRealTimeInventoryApiV2Parameter) {
    let url = realTimeInventoryUrl;
    if (parameter.expand) {
        url += `?expand=${parameter.expand.join(",")}`;
    }

    return post<GetProductCollectionRealTimeInventoryApiV2Parameter, RealTimeInventoryModel>(`${url}`, {
        productIds: parameter.productIds,
        configurations: parameter.configurations,
    });
}

export async function getProductByPath(parameter: GetProductByPathApiV2Parameter) {
    const result = await get<CatalogPageModel>(`${catalogPagesUrl}`, { path: parameter.path } as ApiParameter);
    const productModel = await get<ProductModel>(`${productsUrl}/${result.productId}`, {
        expand: parameter.expand,
        additionalExpands: parameter.additionalExpands,
        includeAttributes: parameter.includeAttributes,
        addToRecentlyViewed: parameter.addToRecentlyViewed,
    } as ApiParameter);

    return productModel;
}

export function getProductById(parameter: GetProductByIdApiV2Parameter) {
    return get<ProductModel>(`${productsUrl}/${parameter.id}`, {
        expand: parameter.expand,
        additionalExpands: parameter.additionalExpands,
        unitOfMeasure: parameter.unitOfMeasure,
        includeAttributes: parameter.includeAttributes,
        alsoPurchasedMaxResults: parameter.alsoPurchasedMaxResults,
    } as ApiParameter);
}

export function getVariantChildren(parameter: GetProductVariantChildrenApiV2Parameter) {
    const newParameter = { ...parameter };
    delete newParameter.productId;

    return get<ProductCollectionModel>(`${productsUrl}/${parameter.productId}/variantchildren`, newParameter);
}

export function getVariantChild(parameter: GetProductVariantChildApiV2Parameter) {
    const newParameter = { ...parameter };
    delete newParameter.variantParentId;
    delete newParameter.id;

    return get<ProductModel>(
        `${productsUrl}/${parameter.variantParentId}/variantchildren/${parameter.id}`,
        newParameter,
    );
}
