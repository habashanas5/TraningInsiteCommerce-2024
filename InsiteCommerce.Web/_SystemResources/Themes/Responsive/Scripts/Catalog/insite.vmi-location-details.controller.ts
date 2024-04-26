module insite.catalog {
    "use strict";
    import VmiBinModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinModel;
    import VmiBinCollectionModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinCollectionModel;

    export class VmiLocationDetailsController {
        vmiLocationId: System.Guid;
        vmiLocationListPage: string;
        vmiLocation: VmiLocationModel;
        billTo: BillToModel;
        shipTo: ShipToModel;
        useBin: boolean;
        locationName: string;
        tableViewProducts: boolean;
        Papa: any;

        vmiBinList: VmiBinModel[];
        vmiBinPagination: PaginationModel;
        vmiBinPaginationStorageKey = "DefaultPagination-VmiBinsSearch";
        productTableSearchFilter: string;
        checkProductStorage: {} = {};
        checkedProductsCount = 0;
        allProductsSelected = false;
        exportProductHeaders: string[];

        vmiOrdersList: Insite.Cart.WebApi.V1.ApiModels.CartModel[];
        vmiOrdersPagination: PaginationModel;
        vmiOrdersPaginationStorageKey = "DefaultPagination-VmiOrdersSearch";
        ordersTableSearchFilter: string;
        checkOrderStorage: {} = {};
        checkedOrdersCount = 0;
        allOrdersSelected = false;
        exportOrdersHeaders: string[];

        static $inject = [
            "$scope",
            "coreService",
            "cartService",
            "spinnerService",
            "customerService",
            "vmiLocationPopupService",
            "queryString",
            "vmiLocationsService",
            "vmiBinService",
            "deleteVmiBinsModalService",
            "deleteLocationPopupService",
            "vmiBinModalService",
            "paginationService",
            "$filter"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected coreService: core.ICoreService,
            protected cartService: cart.ICartService,
            protected spinnerService: core.ISpinnerService,
            protected customerService: customers.ICustomerService,
            protected vmiLocationPopupService: catalog.IVmiLocationPopupService,
            protected queryString: common.IQueryStringService,
            protected vmiLocationsService: catalog.IVmiLocationsService,
            protected vmiBinService: vmiBin.IVmiBinService,
            protected deleteVmiBinsModalService: vmiBin.IDeleteVmiBinsModalService,
            protected deleteLocationPopupService: vmiLocation.IDeleteLocationPopupService,
            protected vmiBinModalService: vmiBin.IVmiBinModalService,
            protected paginationService: core.IPaginationService,
            protected $filter: ng.IFilterService) {
        }

        $onInit(): void {
            if (typeof (Papa) === "undefined") {
                $.getScript("/SystemResources/Scripts/Libraries/papaparse/4.1/papaparse.min.js", () => {
                    this.Papa = Papa;
                });
            }
            else {
                this.Papa = Papa;
            }

            this.updateBreadcrumbs();
            this.initCheckStorageWatcher();

            this.vmiLocationId = this.getVmiLocationId();
            this.tableViewProducts = true;
            this.vmiBinPagination = this.paginationService.getDefaultPagination(this.vmiBinPaginationStorageKey);
            this.vmiOrdersPagination = this.paginationService.getDefaultPagination(this.vmiOrdersPaginationStorageKey);

            this.productTableSearchFilter = "";
            this.ordersTableSearchFilter = "";

            this.getLocationData();

            this.getVmiBinCollection();
            this.getVmiOrderCollection();

            this.$scope.$on("vmi-location-bins-were-deleted", () => {
                if (this.vmiBinPagination) {
                    this.vmiBinPagination.page = 1;
                }
                this.getVmiBinCollection();
            });

            this.$scope.$on("vmi-location-was-removed", () => {
                this.spinnerService.show();
                this.coreService.redirectToPath(this.vmiLocationListPage);
            });

            this.$scope.$on("vmi-bin-item-was-created", () => {
                this.getVmiBinCollection();
            });

            this.$scope.$on("vmi-bins-were-imported", () => {
                this.getVmiBinCollection();
            });
        }

        updateBreadcrumbs(): void {
            this.$scope.$watch(() => this.vmiLocation && this.vmiLocation.name,
                (newValue) => {
                    if (newValue) {
                        angular.element(".breadcrumbs > .current").text(newValue);
                    }
                },
                true);
        }

        initCheckStorageWatcher(): void {
            this.$scope.$watch(() => this.checkProductStorage, () => this.calculateCheckedProducts(), true);
            this.$scope.$watch(() => this.checkOrderStorage, () => this.calculateCheckedOrders(), true);
        }

        calculateCheckedProducts(): void {
            this.checkedProductsCount = 0;

            if (!this.vmiBinList) {
                return;
            }

            for (let i = 0; i < this.vmiBinList.length; i++) {
                if (this.checkProductStorage[this.vmiBinList[i].id.toString()]) {
                    this.checkedProductsCount++;
                }
            }
        }

        calculateCheckedOrders(): void {
            this.checkedOrdersCount = 0;

            if (!this.vmiOrdersList) {
                return;
            }

            for (let i = 0; i < this.vmiOrdersList.length; i++) {
                if (this.checkOrderStorage[this.vmiOrdersList[i].id.toString()]) {
                    this.checkedOrdersCount++;
                }
            }
        }

        // utilities
        protected getVmiLocationId(): System.Guid {
            return this.queryString.get("locationId");
        }

        openAddProductPopup(): void {
            this.vmiBinModalService.display({
                vmiBin: { vmiLocationId: this.vmiLocationId },
                broadcastCreateStr: "vmi-bin-item-was-created",
                showImport: true,
                closeOnAdd: true
            });
        }
        openEditPopup(): void {
            this.vmiLocationPopupService.display({ location: this.vmiLocation, billTo: this.billTo, afterSaveFn: () => { this.getLocationData(); } });
        }

        // product table utilities
        protected generateCsvProducts(list: VmiBinModel[]): void {
            this.spinnerService.hide();

            const dataForUnparse = this.createDataForProductUnparse(list);
            if (!dataForUnparse) {
                return;
            }

            const csv = this.Papa.unparse(dataForUnparse);
            const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

            const fileName = `vmi_location_bins_${list[0].id}.csv`;
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(csvBlob, fileName);
            } else {
                const downloadLink = document.createElement("a");
                downloadLink.href = window.URL.createObjectURL(csvBlob);
                downloadLink.setAttribute("download", fileName);
                downloadLink.click();
            }
        }

        protected createDataForProductUnparse(list: VmiBinModel[]): any {
            if (!list?.length) {
                return null;
            }

            return {
                fields: this.exportProductHeaders,
                data: list.map(o => [
                    o.vmiLocationId.toString(),
                    o.productId.toString(),
                    o.binNumber,
                    o.minimumQty.toString(),
                    o.maximumQty.toString(),
                ]),
            };
        };

        exportSelectedProducts(): void {
            this.spinnerService.show();

            let selectedBins: VmiBinModel[] = [];

            this.vmiBinList.forEach((vmiBin) => {
                if (this.checkProductStorage[vmiBin.id.toString()]) {
                    selectedBins.push(vmiBin);
                }
            });

            this.generateCsvProducts(selectedBins);
        }

        exportAllProducts(): void {
            this.spinnerService.show();

            this.vmiBinService.getVmiBins(this.vmiLocationId, {}, { page: 1, pageSize: this.vmiBinPagination?.totalItemCount } as PaginationModel).then(
                (result: VmiBinCollectionModel) => { this.generateCsvProducts(result.vmiBins) },
                (error: any) => { this.getVmiBinCollectionFailed(error); });
        }

        deleteVmiProducts(): void {
            this.deleteVmiBinsModalService.display({
                vmiBins: this.vmiBinList.filter(vmiBin => this.checkProductStorage[vmiBin.id.toString()]),
                broadcastStr: "vmi-location-bins-were-deleted"
            });
        }

        isProductChecked(productId: System.Guid): boolean {
            return !!this.checkProductStorage[productId.toString()];
        }

        toggleSelectedProduct(product: VmiBinModel): void {
            if (this.checkProductStorage[product.id.toString()]) {
                delete this.checkProductStorage[product.id.toString()];
                this.allProductsSelected = false;
            } else {
                this.checkProductStorage[product.id.toString()] = true;
            }
        }

        toggleSelectAllProducts(): void {
            if (this.allProductsSelected) {
                this.checkProductStorage = {};
                this.allProductsSelected = false;
            } else {
                for (let i = 0; i < this.vmiBinList.length; i++) {
                    this.checkProductStorage[this.vmiBinList[i].id.toString()] = true;
                }
                this.allProductsSelected = true;
            }
        }

        searchProducts(): void {
            if (this.vmiBinPagination) {
                this.vmiBinPagination.page = 1;
            }

            this.getVmiBinCollection();
        }

        clearProductSearch(): void {
            this.vmiBinPagination.page = 1;
            this.productTableSearchFilter = "";

            this.getVmiBinCollection();
        }

        // orders table utilities
        protected generateCsvOrders(list: CartModel[]): void {
            this.spinnerService.hide();

            const dataForUnparse = this.createDataForOrderUnparse(list);
            if (!dataForUnparse) {
                return;
            }

            const csv = this.Papa.unparse(dataForUnparse);
            const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

            const fileName = `vmi_location_orders_${list[0].id}.csv`;
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(csvBlob, fileName);
            } else {
                const downloadLink = document.createElement("a");
                downloadLink.href = window.URL.createObjectURL(csvBlob);
                downloadLink.setAttribute("download", fileName);
                downloadLink.click();
            }
        }

        protected createDataForOrderUnparse(list: CartModel[]): any {
            if (!list?.length) {
                return null;
            }

            return {
                fields: this.exportOrdersHeaders,
                data: list.map(o => [
                    o.orderNumber,
                    this.$filter("date")(o.orderDate, "shortDate"),
                    o.orderGrandTotal.toString(),
                    o.status,
                ]),
            };
        };

        exportSelectedOrders(): void {
            this.spinnerService.show();

            let selectedOrders: CartModel[] = [];

            this.vmiOrdersList.forEach((order) => {
                if (this.checkOrderStorage[order.id.toString()]) {
                    selectedOrders.push(order);
                }
            });

            this.generateCsvOrders(selectedOrders);
        }

        exportAllOrders(): void {
            this.spinnerService.show();

            let searchFilter = {
                sort: "",
                orderNumber: "",
                status: "Submitted",
                vmiLocationId: this.vmiLocationId
            };

            this.cartService.getCarts(searchFilter, { page: 1, pageSize: this.vmiOrdersPagination?.totalItemCount } as PaginationModel).then(
                (result: CartCollectionModel) => { this.generateCsvOrders(result.carts) },
                (error: any) => { this.getVmiOrderCollectionFailed(error); });
        }

        isOrderChecked(orderId: System.Guid): boolean {
            return !!this.checkOrderStorage[orderId.toString()];
        }

        toggleSelectedOrder(order: CartModel): void {
            if (this.checkOrderStorage[order.id.toString()]) {
                delete this.checkOrderStorage[order.id.toString()];
                this.allOrdersSelected = false;
            } else {
                this.checkOrderStorage[order.id.toString()] = true;
            }
        }

        toggleSelectAllOrders(): void {
            if (this.allOrdersSelected) {
                this.checkOrderStorage = {};
                this.allOrdersSelected = false;
            } else {
                for (let i = 0; i < this.vmiOrdersList.length; i++) {
                    this.checkOrderStorage[this.vmiOrdersList[i].id.toString()] = true;
                }
                this.allOrdersSelected = true;
            }
        }

        searchOrders(): void {
            if (this.vmiOrdersPagination) {
                this.vmiOrdersPagination.page = 1;
            }

            this.getVmiOrderCollection();
        }

        clearOrdersSearch(): void {
            this.vmiOrdersPagination.page = 1;
            this.ordersTableSearchFilter = "";

            this.getVmiOrderCollection();
        }

        // api calls and handlers
        getLocationData(): void {
            this.vmiLocationsService.getVmiLocation(this.vmiLocationId).then(
                (result: VmiLocationModel) => { this.getLocationCompleted(result); },
                (error: any) => { this.getLocationFailed(error); });
        }

        protected getLocationCompleted(location: VmiLocationModel): void {
            if (location.id != null) {
                this.vmiLocation = location;
                this.useBin = location.useBins;
                this.locationName = location.name;

                this.getBillTo();
            }
        }

        protected getLocationFailed(error: any): void {
        }

        getVmiBinCollection(): void {
            this.allProductsSelected = false;
            this.vmiBinService.getVmiBins(this.vmiLocationId, { filter: this.productTableSearchFilter }, this.vmiBinPagination).then(
                (result: VmiBinCollectionModel) => { this.getVmiBinCollectionCompleted(result); },
                (error: any) => { this.getVmiBinCollectionFailed(error); });
        }

        protected getVmiBinCollectionCompleted(result: VmiBinCollectionModel): void {
            this.checkProductStorage = {};
            this.vmiBinList = result.vmiBins;
            this.vmiBinPagination = result.pagination;
        }

        protected getVmiBinCollectionFailed(error: any): void {
        }

        getVmiOrderCollection(): void {
            let searchFilter = {
                sort: "",
                orderNumber: this.ordersTableSearchFilter,
                status: "Submitted",
                vmiLocationId: this.vmiLocationId
            };
            this.cartService.getCarts(searchFilter, this.vmiOrdersPagination).then(
                (result: CartCollectionModel) => { this.getVmiOrderCollectionCompleted(result); },
                (error: any) => { this.getVmiOrderCollectionFailed(error); });
        }

        protected getVmiOrderCollectionCompleted(result: CartCollectionModel): void {
            this.checkOrderStorage = {};
            this.vmiOrdersList = result.carts;
            this.vmiOrdersPagination = result.pagination;
        }

        protected getVmiOrderCollectionFailed(error: any): void {
        }

        getBillTo(): void {
            this.customerService.getBillTo("shiptos,excludeonetime,excludecreatenew,validation,country,state").then(
                (billTo: BillToModel) => { this.getBillToCompleted(billTo); },
                (error: any) => { this.getBillToFailed(error); });
        }

        protected getBillToCompleted(billTo: BillToModel): void {
            this.billTo = billTo;
            this.shipTo = this.billTo.shipTos.find(x => x.id === this.vmiLocation.customer.id);
        }

        protected getBillToFailed(error: any): void {
        }

        deleteVmiLocation(): void {
            this.deleteLocationPopupService.display({
                vmiLocations: [this.vmiLocation],
                broadcastStr: "vmi-location-was-removed"
            });
        }
    }

    angular
        .module("insite")
        .controller("VmiLocationDetailsController", VmiLocationDetailsController);
}