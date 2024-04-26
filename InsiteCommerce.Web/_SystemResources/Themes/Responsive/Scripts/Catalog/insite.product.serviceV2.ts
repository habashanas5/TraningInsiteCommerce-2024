module insite.catalog {
    "use strict";

    import ProductModel = Insite.Catalog.WebApi.V2.ApiModels.Product.ProductModel;

    export type ProductExpandTokens = (
        "detail"
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

    export type ProductFilterTokens =
        "frequentlyPurchased"
        | "recentlyPurchased"
        | "alsoPurchased"
        | "recentlyViewed"
        | "topSellers"
        | "siteCrosssells";

    export interface IHasPagingParameters {
        page?: number;
        pageSize?: number;
        defaultPageSize?: number;
        sort?: string;
    }

    export interface IGetProductApiV2ParameterBase {
        expand?: ProductExpandTokens;
        additionalExpands?: string[];
        includeAttributes?: ("includeOnProduct" | "comparable" | "facets")[];
    }

    export interface IGetProductCollectionApiV2Parameter extends IGetProductApiV2ParameterBase, IHasPagingParameters {
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

    export interface IGetProductByPathApiV2Parameter extends IGetProductApiV2ParameterBase {
        path: string;
        styledOption?: string;
        addToRecentlyViewed?: boolean;
    }

    export interface IGetProductByIdApiV2Parameter extends IGetProductApiV2ParameterBase {
        unitOfMeasure?: string;
        alsoPurchasedMaxResults?: number;
    }

    export interface IGetProductVariantChildrenApiV2Parameter extends IGetProductApiV2ParameterBase, IHasPagingParameters {
        productId: string;
    }

    export interface IGetProductVariantChildApiV2Parameter extends IGetProductApiV2ParameterBase {
    }

    export interface IGetRelatedProductCollectionApiV2Parameter extends IGetProductApiV2ParameterBase, IHasPagingParameters {
        relationship: string;
    }

    export interface IProductServiceV2 {
        getProductCollection(parameter: IGetProductCollectionApiV2Parameter): ng.IPromise<ProductCollectionModel>;
        getRelatedProductsCollection(productId: string, parameter: IGetRelatedProductCollectionApiV2Parameter): ng.IPromise<ProductCollectionModel>;
        getProductByPath(parameter: IGetProductByPathApiV2Parameter): ng.IPromise<ProductModel>;
        getProductById(productId: string, parameter: IGetProductByIdApiV2Parameter): ng.IPromise<ProductModel>;
        getVariantChildren(productId: string, parameter: IGetProductVariantChildrenApiV2Parameter): ng.IPromise<ProductCollectionModel>;
        getVariantChild(id: string, variantParentId: string, parameter: IGetProductVariantChildApiV2Parameter): ng.IPromise<ProductModel>;
    }

    export class ProductServiceV2 implements IProductServiceV2 {
        catalogPagesUrl = "/api/v1/catalogpages";
        productsUrl = "/api/v2/products";

        productSettings: ProductSettingsModel;

        static $inject = ["$http", "$rootScope", "$q", "coreService", "settingsService", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected $rootScope: ng.IRootScopeService,
            protected $q: ng.IQService,
            protected coreService: core.ICoreService,
            protected settingsService: core.ISettingsService,
            protected httpWrapperService: core.HttpWrapperService) {

        }

        getProductCollection(parameter: IGetProductCollectionApiV2Parameter): ng.IPromise<ProductCollectionModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http<ProductCollectionModel>({
                    method: "GET",
                    url: `${this.productsUrl}`,
                    params: this.getProductsParams(parameter),
                    bypassErrorInterceptor: true
                }),
                this.getProductCollectionCompleted,
                this.getProductCollectionFailed
            );
        }

        protected getProductCollectionCompleted(response: ProductCollectionModel): void {
        }

        protected getProductCollectionFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        getRelatedProductsCollection(productId: string, parameter: IGetRelatedProductCollectionApiV2Parameter): ng.IPromise<ProductCollectionModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http<ProductCollectionModel>({
                    method: "GET",
                    url: `${this.productsUrl}/${productId}/relatedproducts`,
                    params: this.getProductsParams(parameter),
                    bypassErrorInterceptor: true
                }),
                this.getRelatedProductsCollectionCompleted,
                this.getRelatedProductsCollectionFailed
            );
        }

        protected getRelatedProductsCollectionCompleted(response: ProductCollectionModel): void {
        }

        protected getRelatedProductsCollectionFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        getProductByPath(parameter: IGetProductByPathApiV2Parameter): ng.IPromise<ProductModel> {
            const deferred = this.$q.defer<ProductModel>();
            this.httpWrapperService.executeHttpRequest(
                this,
                this.$http<CatalogPageModel>({
                    method: "GET",
                    url: `${this.catalogPagesUrl}`,
                    params: { path: parameter.path },
                    bypassErrorInterceptor: true
                }),
                response => this.getCatalogPageCompleted(response, parameter, deferred),
                this.getCatalogPageFailed
            );

            return deferred.promise;
        }

        protected getCatalogPageCompleted(catalogPage: CatalogPageModel, parameter: IGetProductByPathApiV2Parameter, deferred: ng.IDeferred<ProductModel>) {
            this.httpWrapperService.executeHttpRequest(
                this,
                this.$http<ProductModel>({
                    method: "GET",
                    url: `${this.productsUrl}/${catalogPage.productId}`,
                    params: {
                        expand: parameter.expand.join(),
                        additionalExpands: parameter.additionalExpands,
                        includeAttributes: parameter.includeAttributes,
                        addToRecentlyViewed: parameter.addToRecentlyViewed,
                    },
                    bypassErrorInterceptor: true
                }),
                response => this.getProductByPathCompleted(response, deferred),
                this.getProductByPathFailed
            );
        }

        protected getCatalogPageFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        protected getProductByPathCompleted(product: ProductModel, deferred: ng.IDeferred<ProductModel>): void {
            deferred.resolve(product);
        }

        protected getProductByPathFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        getProductById(productId: string, parameter: IGetProductByIdApiV2Parameter): ng.IPromise<ProductModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http<ProductModel>({
                    method: "GET",
                    url: `${this.productsUrl}/${productId}`,
                    params: {
                        expand: parameter.expand.join(),
                        additionalExpands: parameter.additionalExpands,
                        unitOfMeasure: parameter.unitOfMeasure,
                        includeAttributes: parameter.includeAttributes,
                        alsoPurchasedMaxResults: parameter.alsoPurchasedMaxResults,
                    },
                    bypassErrorInterceptor: true
                }),
                this.getProductByIdCompleted,
                this.getProductByIdFailed
            );
        }

        protected getProductByIdCompleted(response: ProductModel): void {
        }

        protected getProductByIdFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        getVariantChildren(productId: string, parameter: IGetProductVariantChildrenApiV2Parameter): ng.IPromise<ProductCollectionModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http<ProductCollectionModel>({
                    method: "GET",
                    url: `${this.productsUrl}/${productId}/variantchildren`,
                    params: this.getProductsParams(parameter),
                    bypassErrorInterceptor: true
                }),
                this.getVariantChildrenCompleted,
                this.getVariantChildrenFailed
            );
        }

        protected getVariantChildrenCompleted(response: ProductCollectionModel): void {
        }

        protected getVariantChildrenFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        getVariantChild(id: string, variantParentId: string, parameter: IGetProductVariantChildApiV2Parameter): ng.IPromise<ProductModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http<ProductModel>({
                    method: "GET",
                    url: `${this.productsUrl}/${variantParentId}/variantchildren/${id}`,
                    params: this.getProductsParams(parameter),
                    bypassErrorInterceptor: true
                }),
                this.getVariantChildrenCompleted,
                this.getVariantChildrenFailed
            );
        }

        protected getVariantChildCompleted(response: ProductModel): void {
        }

        protected getVariantChildFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        protected getProductsParams(parameter: IGetProductApiV2ParameterBase): any {
            const params = {} as any;
            angular.copy(parameter, params);
            if (parameter.expand) {
                params.expand = parameter.expand.join();
            }

            if (parameter.additionalExpands) {
                params.expand += `,${parameter.expand.join()}`;
                delete params.additionalExpands;
            }

            if (parameter.includeAttributes) {
                params.includeAttributes = parameter.includeAttributes.join();
            }

            return params;
        }
    }

    angular
        .module("insite")
        .service("productServiceV2", ProductServiceV2);
}
