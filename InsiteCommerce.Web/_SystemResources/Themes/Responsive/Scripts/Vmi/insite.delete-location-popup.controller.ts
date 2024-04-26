module insite.vmiLocation {
    "use strict";
    import VmiLocationModel = Insite.Catalog.WebApi.V1.ApiModels.VmiLocationModel;

    export class DeleteLocationPopupController {
        vmiLocations: VmiLocationModel[];
        broadcastStr: string;

        static $inject = ["$scope", "$rootScope", "vmiLocationsService", "coreService", "deleteLocationPopupService"];

        constructor(
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected vmiLocationsService: catalog.IVmiLocationsService,
            protected coreService: core.ICoreService,
            protected deleteLocationPopupService: IDeleteLocationPopupService) {
        }

        $onInit(): void {
            const popup = angular.element("#deleteLocationPopup");

            this.deleteLocationPopupService.registerDisplayFunction(data => {
                this.vmiLocations = data.vmiLocations;
                this.broadcastStr = data.broadcastStr;
                this.coreService.displayModal(popup);
            });
        }

        protected closeModal(): void {
            this.coreService.closeModal("#deleteLocationPopup");
        }

        deleteVmiLocations(): void {
            if (this.vmiLocations.length === 0) {
                return;
            }

            this.vmiLocationsService.deleteVmiLocations(this.vmiLocations.map(o => o.id)).then(
                (vmiLocationCollectionModel: VmiLocationCollectionModel) => { this.deleteVmiLocationsCompleted(); },
                (error: any) => { this.deleteVmiLocationsFailed(error); });
        }

        protected deleteVmiLocationsCompleted(): void {
            this.closeModal();
            this.$rootScope.$broadcast(this.broadcastStr);
        }

        protected deleteVmiLocationsFailed(error: any): void {
        }
    }

    export interface IDeleteLocationPopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class DeleteLocationPopupService extends base.BasePopupService<any> implements IDeleteLocationPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-delete-location-popup></isc-delete-location-popup>";
        }
    }

    angular
        .module("insite")
        .controller("DeleteLocationPopupController", DeleteLocationPopupController)
        .service("deleteLocationPopupService", DeleteLocationPopupService)
        .directive("iscDeleteLocationPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Vmi-DeleteLocationPopup",
            controller: "DeleteLocationPopupController",
            controllerAs: "vm",
            bindToController: true
        }));
}