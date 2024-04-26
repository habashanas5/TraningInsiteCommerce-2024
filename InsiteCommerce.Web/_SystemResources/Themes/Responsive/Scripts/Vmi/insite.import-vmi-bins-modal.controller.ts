module insite.vmiBin {
    "use strict";
    import VmiBinCollectionModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinCollectionModel;
    import VmiBinModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinModel;

    export class ImportVmiBinsModalController extends common.BaseUploadController {
        locationId: string;
        supportedExtensions = ["csv"];
        uploadInProgress = false;
        startUploadingTime: number;
        uploadServerErrors: string[] = [];

        static $inject = ["$rootScope", "$scope", "productService", "coreService", "settingsService", "vmiBinService", "importVmiBinsModalService", "$timeout"];

        constructor(
            protected $rootScope: ng.IRootScopeService,
            protected $scope: ng.IScope,
            protected productService: catalog.IProductService,
            protected coreService: core.ICoreService,
            protected settingsService: core.ISettingsService,
            protected vmiBinService: IVmiBinService,
            protected importVmiBinsModalService: IImportVmiBinsModalService,
            protected $timeout: ng.ITimeoutService) {
            super($scope, productService, coreService, settingsService);
        }

        $onInit(): void {
            super.$onInit();
            this.importVmiBinsModalService.registerDisplayFunction((locationId: string) => {
                this.cleanupUploadData();
                this.badFile = false;
                this.uploadLimitExceeded = false;
                this.locationId = locationId;
                this.uploadInProgress = false;
                this.uploadServerErrors.length = 0;
                this.fileName = "";
                this.file = null;
                this.coreService.displayModal(angular.element("#import-vmi-bins-modal"));
            });
        }

        protected skipFirstCsvRowHeading(row: string[]): boolean {
            return row && row.length === 4 && row.every(o => o) && isNaN(parseFloat(row[2])) && isNaN(parseFloat(row[3]));
        }

        protected rowMapper(row: string[]): any {
            return { Name: row[0], binNumber: row[1], minQty: row[2], maxQty: row[3] };
        }

        protected closeModal(): void {
            this.uploadInProgress = false;

            if (this.errorProducts && this.errorProducts.length > 0) {
                this.errorProducts = [];
                return;
            }

            if (this.uploadServerErrors.length > 0) {
                this.uploadServerErrors = [];
                return;
            }

            this.coreService.closeModal("#import-vmi-bins-modal");
        }

        protected showUploadingPopup() {
            this.uploadInProgress = true;
            this.startUploadingTime = Date.now();
        }

        protected hideUploadingPopup() {
            this.$timeout(() => {
                this.uploadInProgress = false;
            }, Math.max(0, 300 - (Date.now() - this.startUploadingTime)));
        }

        protected uploadProducts(popupSelector?: string): void {
            this.addVmiBins();
        }

        addVmiBins(): void {
            const erpNumberToIdMap = {};
            for (const product of this.products) {
                erpNumberToIdMap[product.erpNumber.toLowerCase()] = product.id;
            }

            const vmiBins: VmiBinModel[] = [];
            for (const item of this.itemsToSearch) {
                vmiBins.push({
                    productId: erpNumberToIdMap[item.Name.toLowerCase()],
                    binNumber: item.binNumber,
                    minimumQty: +item.minQty || 0,
                    maximumQty: +item.maxQty || 0
                } as any);
            }

            this.vmiBinService.addVmiBinCollection(this.locationId, vmiBins).then(
                (vmiBinCollectionModel: VmiBinCollectionModel) => { this.addVmiBinsCompleted(); },
                (error: any) => { this.addVmiBinsFailed(error); });
        }

        protected addVmiBinsCompleted(): void {
            this.closeModal();
            this.$rootScope.$broadcast("vmi-bins-were-imported");
        }

        protected addVmiBinsFailed(error: any): void {
            if (error && error.message) {
                this.uploadServerErrors = error.message.split("\r\n");
            }
        }
    }

    export interface IImportVmiBinsModalService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class ImportVmiBinsModalService extends base.BasePopupService<any> implements IImportVmiBinsModalService {
        protected getDirectiveHtml(): string {
            return "<isc-import-vmi-bins-modal></isc-import-vmi-bins-modal>";
        }
    }

    angular
        .module("insite")
        .controller("ImportVmiBinsModalController", ImportVmiBinsModalController)
        .service("importVmiBinsModalService", ImportVmiBinsModalService)
        .directive("iscImportVmiBinsModal", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Vmi-ImportVmiBinsModal",
            controller: "ImportVmiBinsModalController",
            controllerAs: "vm",
            bindToController: true
        }));
}