module insite.vmiBin {
    "use strict";
    import VmiBinCollectionModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinCollectionModel;
    import VmiBinModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinModel;

    export class DeleteVmiBinsModalController {
        vmiBins: VmiBinModel[];
        broadcastStr: string;

        static $inject = ["$scope", "$rootScope","vmiBinService", "coreService", "deleteVmiBinsModalService"];

        constructor(
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected vmiBinService: IVmiBinService,
            protected coreService: core.ICoreService,
            protected deleteVmiBinsModalService: IDeleteVmiBinsModalService) {
        }

        $onInit(): void {
            const popup = angular.element("#delete-vmi-bins-modal");

            this.deleteVmiBinsModalService.registerDisplayFunction(data => {
                this.vmiBins = data.vmiBins;
                this.broadcastStr = data.broadcastStr;
                this.coreService.displayModal(popup);
            });
        }

        protected closeModal(): void {
            this.coreService.closeModal("#delete-vmi-bins-modal");
        }

        deleteVmiBins(): void {
            if (this.vmiBins.length === 0) {
                return;
            }

            this.vmiBinService.deleteVmiBinCollection(this.vmiBins[0].vmiLocationId, this.vmiBins).then(
                (vmiBinCollectionModel: VmiBinCollectionModel) => { this.deleteVmiBinsCompleted(); },
                (error: any) => { this.deleteVmiBinsFailed(error); });
        }

        protected deleteVmiBinsCompleted(): void {
            this.closeModal();
            this.$rootScope.$broadcast(this.broadcastStr);
        }

        protected deleteVmiBinsFailed(error: any): void {
        }
    }

    export interface IDeleteVmiBinsModalService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class DeleteVmiBinsModalService extends base.BasePopupService<any> implements IDeleteVmiBinsModalService {
        protected getDirectiveHtml(): string {
            return "<isc-delete-vmi-bins-modal></isc-delete-vmi-bins-modal>";
        }
    }

    angular
        .module("insite")
        .controller("DeleteVmiBinsModalController", DeleteVmiBinsModalController)
        .service("deleteVmiBinsModalService", DeleteVmiBinsModalService)
        .directive("iscDeleteVmiBinsModal", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Vmi-DeleteVmiBinsModal",
            controller: "DeleteVmiBinsModalController",
            controllerAs: "vm",
            bindToController: true
        }));
}