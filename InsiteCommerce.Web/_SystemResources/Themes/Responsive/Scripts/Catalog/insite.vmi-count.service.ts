module insite.vmiCount {
    "use strict";
    import VmiCountCollectionModel = Insite.Catalog.WebApi.V1.ApiModels.VmiCountCollectionModel;

    export interface ISearchFilter {
        userName?: string;
        previousCountFromDate?: string;
        previousCountToDate?: string;
        getUniqueByUser?: boolean;
        sort?: string;
    }

    export interface IVmiCountService {
        getVmiCounts(vmiLocationId: System.Guid, vmiBinId: System.Guid, filter: ISearchFilter, pagination: PaginationModel): ng.IPromise<VmiCountCollectionModel>;
    }

    export class VmiCountService implements IVmiCountService {
        serviceUri = "/api/v1/vmiLocations/{vmiLocationId}/bins/{vmiBinId}/binCounts";

        static $inject = ["$http", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: core.HttpWrapperService) {
        }

        getVmiCounts(vmiLocationId: System.Guid, vmiBinId: System.Guid, filter: ISearchFilter, pagination: PaginationModel): ng.IPromise<VmiCountCollectionModel> {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({
                    url: this.serviceUri.replace("{vmiLocationId}", vmiLocationId.toString()).replace("{vmiBinId}", vmiBinId.toString()),
                    method: "GET",
                    params: this.getVmiCountsParams(filter, pagination)
                }),
                this.getVmiCountsCompleted,
                this.getVmiCountsFailed
            );
        }

        protected getVmiCountsParams(filter: ISearchFilter, pagination: PaginationModel): any {
            const params: any = filter ? JSON.parse(JSON.stringify(filter)) : {};

            if (pagination) {
                params.page = pagination.page;
                params.pageSize = pagination.pageSize;
            }

            return params;
        }

        protected getVmiCountsCompleted(response: ng.IHttpPromiseCallbackArg<VmiCountCollectionModel>): void {
        }

        protected getVmiCountsFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }
    }

    angular
        .module("insite")
        .service("vmiCountService", VmiCountService);
}