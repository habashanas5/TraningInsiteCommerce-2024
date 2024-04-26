module insite.vmiBin {
    "use strict";
    import VmiBinModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinModel;

    export class VmiBinModalController {
        vmiBinForm: any;
        binNumber: string = "";
        minimumQty: number = 0;
        maximumQty: number = 0;
        formErrorMessage: string;
        vmiBin: VmiBinModel;

        addingSearchTerm: string = "";
        errorMessage: string;
        showSuccessMessage: boolean;
        itemToAdd: ProductDto;
        autocompleteOptions: AutoCompleteOptions;
        messageTimeout: ng.IPromise<any>;
        cannotOrderConfigurableError: string;
        cannotOrderStyledError: string;
        productNotFoundError: string;

        broadcastCreateStr: string;
        broadcastEditStr: string;
        showImport: boolean;
        closeOnAdd: boolean;

        static $inject = ["$scope", "$rootScope", "vmiBinService", "coreService", "$timeout", "vmiBinModalService", "searchService", "productService", "importVmiBinsModalService"];

        constructor(
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected vmiBinService: IVmiBinService,
            protected coreService: core.ICoreService,
            protected $timeout: ng.ITimeoutService,
            protected vmiBinModalService: IVmiBinModalService,
            protected searchService: catalog.ISearchService,
            protected productService: catalog.IProductService,
            protected importVmiBinsModalService: vmiBin.IImportVmiBinsModalService) {
        }

        $onInit(): void {
            this.initModalEvents();
            this.initializeAutocomplete();
        }

        protected closeModal(): void {
            this.coreService.closeModal("#vmi-bin-modal");
        }

        protected openImportModal(): void {
            this.closeModal();
            this.importVmiBinsModalService.display(this.vmiBin.vmiLocationId);
        }

        protected clearMessages(): void {
            this.formErrorMessage = "";
        }

        protected initModalEvents(): void {
            const popup = angular.element("#vmi-bin-modal");

            this.vmiBinModalService.registerDisplayFunction(data => {
                this.vmiBin = data.vmiBin;
                this.broadcastCreateStr = data.broadcastCreateStr;
                this.broadcastEditStr = data.broadcastEditStr;
                this.showImport = data.showImport;
                this.closeOnAdd = data.closeOnAdd;
                this.clearMessages();
                
                if (this.vmiBin.id) {
                    this.itemToAdd = this.vmiBin.product;
                    this.addingSearchTerm = this.itemToAdd.shortDescription;
                    this.binNumber = this.vmiBin.binNumber;
                    this.minimumQty = this.vmiBin.minimumQty;
                    this.maximumQty = this.vmiBin.maximumQty;
                } else {
                    this.itemToAdd = null;
                    this.addingSearchTerm = "";
                    this.binNumber = "";
                    this.minimumQty = 0;
                    this.maximumQty = 0;
                }

                this.coreService.displayModal(popup);
            });
        }

        validForm(): boolean {
            this.clearMessages();

            if (!this.vmiBinForm.$valid) {
                return false;
            }

            return true;
        }

        addVmiBin(): void {
            if (!this.validForm()) {
                return;
            }

            this.vmiBin.productId = this.itemToAdd.id;
            this.vmiBin.binNumber = this.binNumber;
            this.vmiBin.minimumQty = this.minimumQty;
            this.vmiBin.maximumQty = this.maximumQty;

            this.vmiBinService.addVmiBin(this.vmiBin).then(
                (vmiBin: VmiBinModel) => { this.addVmiBinCompleted(vmiBin); },
                (error: any) => { this.addVmiBinFailed(error); });
        }

        protected addVmiBinCompleted(vmiBin: VmiBinModel): void {
            if (this.closeOnAdd) {
                this.closeModal();
            } else {
                this.setSuccessMessage();
            }
            this.$rootScope.$broadcast(this.broadcastCreateStr, vmiBin);
        }

        protected addVmiBinFailed(error: any): void {
            if (error && error.message) {
                this.formErrorMessage = error.message;
            }
        }

        updateVmiBin(): void {
            if (!this.validForm()) {
                return;
            }

            this.vmiBin.productId = this.itemToAdd.id;
            this.vmiBin.binNumber = this.binNumber;
            this.vmiBin.minimumQty = this.minimumQty;
            this.vmiBin.maximumQty = this.maximumQty;

            this.vmiBinService.updateVmiBin(this.vmiBin).then(
                (vmiBin: VmiBinModel) => { this.updateVmiBinCompleted(vmiBin); },
                (error: any) => { this.updateVmiBinFailed(error); });
        }

        protected updateVmiBinCompleted(vmiBin: VmiBinModel): void {
            this.closeModal();
            this.$rootScope.$broadcast(this.broadcastEditStr, vmiBin);
        }

        protected updateVmiBinFailed(error: any): void {
            if (error && error.message) {
                this.formErrorMessage = error.message;
            }
        }

        protected initializeAutocomplete(): void {
            this.autocompleteOptions = this.searchService.getProductAutocompleteOptions(() => this.addingSearchTerm);

            this.autocompleteOptions.template = this.searchService.getProductAutocompleteTemplate(() => this.addingSearchTerm, "tst_vmiBinModal_autocomplete");
            this.autocompleteOptions.select = this.onAutocompleteOptionsSelect();
        }

        protected onAutocompleteOptionsSelect(): (event: kendo.ui.AutoCompleteSelectEvent) => void {
            return (event: kendo.ui.AutoCompleteSelectEvent) => {
                const dataItem = event.sender.dataItem(event.item.index());
                this.searchProduct(dataItem.erpNumber);
            };
        }

        protected searchProduct(erpNumber: string): void {
            if (!erpNumber || erpNumber.length === 0) {
                return;
            }

            this.findProduct(erpNumber).then(
                (productCollection: ProductCollectionModel) => {
                    this.addProductCompleted(productCollection);
                },
                (error: any) => {
                    this.addProductFailed(error);
                });
        }

        protected findProduct(erpNumber: string): ng.IPromise<ProductCollectionModel> {
            const parameters: catalog.IProductCollectionParameters = { extendedNames: [erpNumber] };

            return this.productService.getProducts(parameters);
        }

        protected addProductCompleted(productCollection: ProductCollectionModel): void {
            this.validateAndSetProduct(productCollection);
        }

        protected addProductFailed(error: any): void {
            this.setErrorMessage(this.productNotFoundError);
        }

        protected validateAndSetProduct(productCollection: ProductCollectionModel): boolean {
            const product = productCollection.products[0];

            if (this.validateProduct(product)) {
                this.itemToAdd = product;
                this.errorMessage = "";
                this.formErrorMessage = "";
                this.showSuccessMessage = false;
                return true;
            }

            return false;
        }

        protected validateProduct(product: ProductDto): boolean {
            if (product.canConfigure || (product.isConfigured && !product.isFixedConfiguration)) {
                this.setErrorMessage(this.cannotOrderConfigurableError);
                return false;
            }
            if (product.isStyleProductParent) {
                this.setErrorMessage(this.cannotOrderStyledError);
                return false;
            }

            return true;
        }

        protected setErrorMessage(message: string) {
            this.errorMessage = message;
            this.showSuccessMessage = false;
            this.initHideMessageTimeout();
        }

        protected setSuccessMessage() {
            this.errorMessage = "";
            this.showSuccessMessage = true;
            this.initHideMessageTimeout();
        }

        protected initHideMessageTimeout(): void {
            this.$timeout.cancel(this.messageTimeout);
            this.messageTimeout = this.$timeout(() => {
                this.showSuccessMessage = false;
                this.errorMessage = "";
            }, 2000);
        }

        addingSearchTermChanged(): void {
            this.showSuccessMessage = false;
            this.formErrorMessage = "";
            this.errorMessage = "";
            this.itemToAdd = null;
        }

        onEnterKeyPressedInAutocomplete(): void {
            const autocomplete = $("#qo-search-view").data("kendoAutoComplete") as any;
            if (autocomplete && autocomplete._last === kendo.keys.ENTER && autocomplete.listView.selectedDataItems().length === 0) {
                this.searchProduct(this.addingSearchTerm);
            }
        }
    }

    export interface IVmiBinModalService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class VmiBinModalService extends base.BasePopupService<any> implements IVmiBinModalService {
        protected getDirectiveHtml(): string {
            return "<isc-vmi-bin-modal></isc-vmi-bin-modal>";
        }
    }

    angular
        .module("insite")
        .controller("VmiBinModalController", VmiBinModalController)
        .service("vmiBinModalService", VmiBinModalService)
        .directive("iscVmiBinModal", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Vmi-VmiBinModal",
            controller: "VmiBinModalController",
            controllerAs: "vm",
            bindToController: true
        }));
}