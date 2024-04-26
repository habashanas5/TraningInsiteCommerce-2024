import VmiLocationCollectionModel = Insite.Catalog.WebApi.V1.ApiModels.VmiLocationCollectionModel;

module insite.catalog {
    "use strict";

    export interface ISearchFilter {
        filter?: string,
        sort?: string,
        page?: number,
        pageSize?: number,
        userId?: string
    }

    export interface IVmiLocationsService {
        batchAddVmiLocations(locations: VmiLocationModel[], validationOnly?: boolean): any;
        addVmiLocation(useBins: boolean, shipToId: System.Guid, billToId: System.Guid, locationName: string, isPrimaryLocation: boolean): any;
        updateVmiLocation(useBins: boolean, shipTo: ShipToModel, vmiLocation: VmiLocationModel, locationName: string): any;
        getVmiLocations(filter: ISearchFilter): any;
        getVmiLocation(locationId: System.Guid): any;
        deleteVmiLocations(locationIds: System.Guid[]): any;
    }

    export class VmiLocationsService implements IVmiLocationsService {
        serviceUri = "api/v1/vmiLocations";

        static $inject = ["$http", "httpWrapperService"];

        constructor(
            protected $http: ng.IHttpService,
            protected httpWrapperService: core.HttpWrapperService) {
        }

        getVmiLocations(filter: ISearchFilter) {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "GET", url: this.serviceUri, params: this.getVmiLocationsParams(filter) }),
                this.getLocationsCompleted,
                this.getLocationsFailed
            );
        }

        protected getVmiLocationsParams(filter: ISearchFilter): any {
            let parameter = filter ? JSON.parse(JSON.stringify(filter)) : {};

            parameter.expand = "customerlabel";

            return parameter;
        }

        protected getLocationsCompleted(response: ng.IHttpPromiseCallbackArg<VmiLocationCollectionModel>): void {
        }

        protected getLocationsFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        getVmiLocation(locationId: System.Guid): any {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "GET", url: `${this.serviceUri}/${locationId}`, params: this.getVmiLocationParams() }),
                this.getLocationCompleted,
                this.getLocationFailed
            );
        }

        protected getVmiLocationParams(): any {
            return { expand: "customerlabel,customer" };
        }

        protected getLocationCompleted(response: ng.IHttpPromiseCallbackArg<VmiLocationModel>): void {
        }

        protected getLocationFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        batchAddVmiLocations(locations: VmiLocationModel[], validationOnly: boolean = false) {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "POST", url: this.serviceUri + "/batch", data: this.batchAddVmiLocationParams(locations, validationOnly) }),
                this.batchAddVmiLocationsCompleted,
                this.batchAddVmiLocationsFailed
            );
        }

        protected batchAddVmiLocationParams(locations: VmiLocationModel[], validationOnly: boolean): any {
            const params: any = {
                validationOnly,
                vmiLocations: locations.map(location => ({ billToId: location.billToId ? location.billToId : undefined, shipToId: location.shipToId, name: location.name, IsPrimaryLocation: location.isPrimaryLocation, useBins: location.useBins }))
            };

            return params;
        }

        protected batchAddVmiLocationsCompleted(response: ng.IHttpPromiseCallbackArg<VmiLocationCollectionModel>): void {
        }

        protected batchAddVmiLocationsFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        addVmiLocation(useBins: boolean, shipToId: System.Guid, billToId: System.Guid, locationName: string, isPrimaryLocation: boolean) {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "POST", url: this.serviceUri, data: this.addVmiLocationParams(useBins, shipToId, billToId, locationName, isPrimaryLocation) }),
                this.addVmiLocationCompleted,
                this.addVmiLocationFailed
            );
        }

        protected addVmiLocationParams(useBins: boolean, shipToId: System.Guid, billToId: System.Guid, locationName: string, isPrimaryLocation: boolean): any {
            const params: any = {
                name: locationName,
                billToId: billToId,
                useBins: useBins,
                isPrimaryLocation: isPrimaryLocation,
                shipToId: shipToId
            };

            return params;
        }

        protected addVmiLocationCompleted(response: ng.IHttpPromiseCallbackArg<VmiLocationModel>): void {
        }

        protected addVmiLocationFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        updateVmiLocation(useBins: boolean, shipTo: ShipToModel, vmiLocation: VmiLocationModel, locationName: string) {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "PATCH", url: `${this.serviceUri}/${vmiLocation.id}`, data: this.updateVmiLocationParams(useBins, shipTo, vmiLocation, locationName) }),
                this.updateVmiLocationCompleted,
                this.updateVmiLocationFailed
            );
        }

        protected updateVmiLocationParams(useBins: boolean, shipTo: ShipToModel, vmiLocation: VmiLocationModel, locationName: string): any {
            const params = vmiLocation;

            params.useBins = useBins;
            params.name = locationName;
            params.shipToId = shipTo.id;

            return params;
        }

        protected updateVmiLocationCompleted(response: ng.IHttpPromiseCallbackArg<VmiLocationModel>): void {
        }

        protected updateVmiLocationFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }

        deleteVmiLocations(locationIds: System.Guid[]): any {
            return this.httpWrapperService.executeHttpRequest(
                this,
                this.$http({ method: "DELETE", url: this.serviceUri + "/batch", params: this.deleteVmiLocationsParams(locationIds)}),
                this.deleteVmiLocationsCompleted,
                this.deleteVmiLocationsFailed
            );
        }

        deleteVmiLocationsParams(locationIds: System.Guid[]): any {
            const params: any = {
                ids: locationIds
            };

            return params;
        }

        protected deleteVmiLocationsCompleted(response: ng.IHttpPromiseCallbackArg<VmiLocationModel>): void {
        }

        protected deleteVmiLocationsFailed(error: ng.IHttpPromiseCallbackArg<any>): void {
        }
    }

    angular
        .module("insite")
        .service("vmiLocationsService", VmiLocationsService);
}