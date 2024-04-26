import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import { createFromProduct, ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { trackSearchResultEvent } from "@insite/client-framework/Common/Utilities/tracking";
import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { getIsWebCrawler } from "@insite/client-framework/Common/WebCrawler";
import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    Handler,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { CatalogPage } from "@insite/client-framework/Services/CategoryService";
import {
    GetProductCollectionApiV2Parameter,
    ProductExpandTokens,
} from "@insite/client-framework/Services/ProductServiceV2";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import {
    getSearchDataModeActive,
    getSettingsCollection,
} from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCatalogPageStateByPath } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesSelectors";
import loadCatalogPageByPath from "@insite/client-framework/Store/Data/CatalogPages/Handlers/LoadCatalogPageByPath";
import loadProducts from "@insite/client-framework/Store/Data/Products/Handlers/LoadProducts";
import { getProductsDataView } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import setFilterQuery from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetFilterQuery";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import { ProductFilters } from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import { ProductModel, RealTimePricingModel } from "@insite/client-framework/Types/ApiModels";
import qs from "qs";

const productListSortTypeCookie = "productListSortType";

interface Parameter {
    queryString: string;
    path: string;
    isSearch: boolean;
}

export interface DisplayProductsResult {
    products?: ProductModel[];
    productInfosByProductId: SafeDictionary<ProductInfo>;
    productFilters: ProductFilters;
    isFiltered: boolean;
    unfilteredApiParameter?: GetProductCollectionApiV2Parameter;
    filteredApiParameter?: GetProductCollectionApiV2Parameter;
    catalogPage?: CatalogPage;
}

interface Props {
    apiParameter: GetProductCollectionApiV2Parameter;
    idByPath?: SafeDictionary<string>;
    result: DisplayProductsResult;
    pricingLoaded?: true;
    expandTokens?: ProductExpandTokens;
}

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/BeginLoadProducts",
    });
};

export const RequestCatalogPageFromApi: HandlerType = async props => {
    const { path, isSearch } = props.parameter;
    props.result = {
        productFilters: {},
        isFiltered: false,
        productInfosByProductId: {},
    };

    if (path && !isSearch) {
        props.result.catalogPage = getCatalogPageStateByPath(props.getState(), path).value;
        if (props.result.catalogPage) {
            return;
        }

        props.result.catalogPage = await executeAwaitableHandlerChain(loadCatalogPageByPath, { path }, props);
    }
};

export const ParseQueryParameter: HandlerType = props => {
    const { queryString } = props.parameter;
    const parsedQuery = qs.parse(queryString.startsWith("?") ? queryString.substr(1) : queryString);
    const splitCommaSeparated = (value?: string | string[] | null) =>
        typeof value === "string" ? value.split(",") : undefined;
    const {
        query,
        page,
        sort,
        includeSuggestions,
        stockedItemsOnly,
        previouslyPurchasedProducts,
        categoryId,
        brandIds,
        productLineIds,
        priceFilters,
        attributeValueIds,
        searchWithinQueries,
    } = parsedQuery;

    let pageSize = parsedQuery.pageSize;

    if (!pageSize) {
        pageSize = getCookie("ProductList-PageSize");
    }

    const { catalogPage } = props.result;

    props.result.productFilters = {
        query,
        page: page ? parseInt(page as string, 10) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined,
        sort,
        includeSuggestions: includeSuggestions !== undefined ? includeSuggestions === "true" : undefined,
        stockedItemsOnly: stockedItemsOnly !== undefined ? stockedItemsOnly === "true" : undefined,
        previouslyPurchasedProducts:
            previouslyPurchasedProducts !== undefined ? previouslyPurchasedProducts === "true" : undefined,
        pageCategoryId: catalogPage?.categoryId,
        pageBrandId: catalogPage?.brandId || undefined,
        pageProductLineId: catalogPage?.productLineId || undefined,
        categoryId,
        brandIds: splitCommaSeparated(brandIds),
        productLineIds: splitCommaSeparated(productLineIds),
        priceFilters: splitCommaSeparated(priceFilters),
        attributeValueIds: splitCommaSeparated(attributeValueIds),
        searchWithinQueries: splitCommaSeparated(searchWithinQueries),
    };
};

export const SetIsFiltered: HandlerType = ({ result, result: { productFilters } }) => {
    if (
        productFilters.searchWithinQueries?.length ||
        productFilters.brandIds?.length ||
        productFilters.productLineIds?.length ||
        productFilters.priceFilters?.length ||
        productFilters.attributeValueIds?.length ||
        productFilters.categoryId
    ) {
        result.isFiltered = true;
    }
};

export const SetExpandTokens: HandlerType = props => {
    props.expandTokens = ["attributes", "facets"];
    if (getSearchDataModeActive(props.getState())) {
        props.expandTokens.push("scoreexplanation");
    }
};

export const PopulateApiParameter: HandlerType = props => {
    const filters = props.result.productFilters;
    const {
        query,
        brandIds,
        productLineIds,
        priceFilters,
        attributeValueIds,
        searchWithinQueries,
        pageCategoryId,
        pageBrandId,
        pageProductLineId,
        ...apiParameter
    } = filters;
    props.apiParameter = {
        ...apiParameter,
        search: query,
        categoryId: filters.categoryId || filters.pageCategoryId,
        searchWithin: searchWithinQueries?.join(" "),
        includeSuggestions: filters.includeSuggestions !== false,
        brandIds: filters.pageBrandId ? [filters.pageBrandId] : brandIds,
        productLineIds: filters.pageProductLineId ? [filters.pageProductLineId] : productLineIds,
        priceFilters,
        attributeValueIds,
        expand: props.expandTokens || [],
        applyPersonalization: true,
        includeAttributes: ["includeOnProduct"],
    };
};

export const HandleSortOrderDefault: HandlerType = props => {
    if (!props.apiParameter.sort) {
        props.apiParameter.sort = getCookie(productListSortTypeCookie) ?? "1";
    } else {
        setCookie(productListSortTypeCookie, props.apiParameter.sort);
    }
};

export const DispatchSetParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/SetParameter",
        parameter: props.apiParameter,
    });
};

export const DispatchLoadProducts: HandlerType = async props => {
    const state = props.getState();
    props.result.products = getProductsDataView(state, props.apiParameter).value;
    if (props.result.products) {
        const attributeTypeFacetIds = getProductListDataViewProperty(state, "attributeTypeFacets")?.map(
            o => o.attributeTypeId,
        );

        let attributeTypeIds: string[] = [];
        props.result.products.forEach(product => {
            const ids = product.attributeTypes?.map(o => o.id) || [];
            attributeTypeIds = attributeTypeIds.concat(ids);
        });
        if (attributeTypeIds.length === attributeTypeFacetIds?.length) {
            const isAllAttributesAssignedToCategory = attributeTypeIds.every(
                o => attributeTypeFacetIds.indexOf(o) > -1,
            );
            if (isAllAttributesAssignedToCategory) {
                return;
            }
        }
    }

    props.result.products = await executeAwaitableHandlerChain(loadProducts, props.apiParameter, props);
};

export const ResetSortTypeIfNeeded: HandlerType = props => {
    const productsDataView = getProductsDataView(props.getState(), props.apiParameter);
    if (!productsDataView.value || !productsDataView.pagination) {
        return;
    }

    if (props.apiParameter.sort !== productsDataView.pagination.sortType) {
        setCookie(productListSortTypeCookie, "1");
        props.dispatch(displayProducts(props.parameter));
        return false;
    }
};

export const GetUnfilteredProducts: HandlerType = async props => {
    const unfilteredApiParameter = { ...props.apiParameter };
    delete unfilteredApiParameter.searchWithin;
    if (!props.result.productFilters.pageBrandId) {
        delete unfilteredApiParameter.brandIds;
    }
    if (!props.result.productFilters.pageProductLineId) {
        delete unfilteredApiParameter.productLineIds;
    }
    delete unfilteredApiParameter.priceFilters;
    delete unfilteredApiParameter.attributeValueIds;
    if (!props.result.productFilters.pageCategoryId) {
        delete unfilteredApiParameter.categoryId;
    }
    unfilteredApiParameter.stockedItemsOnly = undefined;
    unfilteredApiParameter.previouslyPurchasedProducts = undefined;

    props.result.unfilteredApiParameter = unfilteredApiParameter;
    props.result.filteredApiParameter = { ...props.apiParameter };

    const unfilteredProducts = getProductsDataView(props.getState(), unfilteredApiParameter).value;

    if (unfilteredProducts) {
        return;
    }

    await executeAwaitableHandlerChain(loadProducts, unfilteredApiParameter, props);
};

export const SetUpProductInfos: HandlerType = props => {
    const categoryPath = props.apiParameter.search ? undefined : props.result.catalogPage?.canonicalPath;

    props.idByPath = {};

    props.result.products?.forEach(product => {
        const productDetailPath = categoryPath ? `${categoryPath}/${product.urlSegment}` : product.canonicalUrl;
        props.idByPath![productDetailPath] = product.id;
        props.result.productInfosByProductId[product.id] = {
            ...createFromProduct(product),
            productDetailPath,
        };
    });
};

export const DispatchUpdateIdByPath: HandlerType = props => {
    if (!props.idByPath) {
        return;
    }

    props.dispatch({
        type: "Data/Products/UpdateIdByPath",
        idByPath: props.idByPath,
    });
};

export const DispatchCompleteLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/CompleteLoadProducts",
        result: props.result,
    });
};

export const DispatchSetFilterQuery: HandlerType = props => {
    props.dispatch(setFilterQuery());
};

export const SendTracking: HandlerType = props => {
    const { search } = props.apiParameter;

    if (!search) {
        return;
    }

    const state = props.getState();
    const pagination = getProductListDataViewProperty(state, "pagination");
    const originalQuery = getProductListDataViewProperty(state, "originalQuery");
    const correctedQuery = getProductListDataViewProperty(state, "correctedQuery");
    trackSearchResultEvent(originalQuery || "", pagination?.totalItemCount || 0, correctedQuery);
};

export const LoadRealTimePrices: HandlerType = async props => {
    const {
        result: { productInfosByProductId },
    } = props;
    const productIds = Object.keys(productInfosByProductId);
    if (productIds.length === 0) {
        return;
    }

    const loadRealTimePricingParameter: Parameters<typeof loadRealTimePricing>[0] = {
        productPriceParameters: productIds.map(o => productInfosByProductId[o]!),
        onSuccess: realTimePricing => {
            props.dispatch({
                type: "Pages/ProductList/CompleteLoadRealTimePricing",
                realTimePricing,
            });
            props.pricingLoaded = true;
        },
        onError: () => {
            props.dispatch({
                type: "Pages/ProductList/FailedLoadRealTimePricing",
            });
            props.pricingLoaded = true;
        },
        onComplete(realTimePricingProps) {
            if (realTimePricingProps.apiResult) {
                this.onSuccess?.(realTimePricingProps.apiResult);
            } else if (realTimePricingProps.error) {
                this.onError?.(realTimePricingProps.error);
            }
        },
    };

    if (IS_SERVER_SIDE && getIsWebCrawler()) {
        const awaitableLoadRealTimePricing = makeHandlerChainAwaitable<
            Parameters<typeof loadRealTimePricing>[0],
            RealTimePricingModel
        >(loadRealTimePricing);
        const realTimePricing = await awaitableLoadRealTimePricing({
            productPriceParameters: loadRealTimePricingParameter.productPriceParameters,
        })(props.dispatch, props.getState);
        if (realTimePricing) {
            loadRealTimePricingParameter.onSuccess?.(realTimePricing);
        } else {
            loadRealTimePricingParameter.onError?.(realTimePricing);
        }
    } else {
        props.dispatch(loadRealTimePricing(loadRealTimePricingParameter));
    }

    if (getSettingsCollection(props.getState()).productSettings.inventoryIncludedWithPricing) {
        await waitFor(() => !!props.pricingLoaded);
    }
};

export const LoadRealTimeInventory: HandlerType = props => {
    if (!props.result.products?.length || getIsWebCrawler()) {
        return;
    }

    props.dispatch(
        loadRealTimeInventory({
            productIds: props.result.products.map(o => o.id),
            onSuccess: realTimeInventory => {
                props.dispatch({
                    type: "Pages/ProductList/CompleteLoadRealTimeInventory",
                    realTimeInventory,
                });
            },
            onError: () => {
                props.dispatch({
                    type: "Pages/ProductList/FailedLoadRealTimeInventory",
                });
            },
            onComplete(realTimeInventoryProps) {
                if (realTimeInventoryProps.apiResult) {
                    this.onSuccess?.(realTimeInventoryProps.apiResult);
                } else if (realTimeInventoryProps.error) {
                    this.onError?.(realTimeInventoryProps.error);
                }
            },
        }),
    );
};

export const chain = [
    DispatchBeginLoadProducts,
    RequestCatalogPageFromApi,
    ParseQueryParameter,
    SetIsFiltered,
    SetExpandTokens,
    PopulateApiParameter,
    HandleSortOrderDefault,
    DispatchSetParameter,
    DispatchLoadProducts,
    ResetSortTypeIfNeeded,
    GetUnfilteredProducts,
    SetUpProductInfos,
    DispatchUpdateIdByPath,
    DispatchCompleteLoadProducts,
    DispatchSetFilterQuery,
    SendTracking,
    LoadRealTimePrices,
    LoadRealTimeInventory,
];

const displayProducts = createHandlerChainRunner(chain, "DisplayProducts");
export default displayProducts;
