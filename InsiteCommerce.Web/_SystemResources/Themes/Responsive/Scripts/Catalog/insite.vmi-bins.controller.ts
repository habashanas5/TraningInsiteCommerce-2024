module insite.catalog {
    "use strict";
    import VmiBinCollectionModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinCollectionModel;
    import VmiBinModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinModel;

    export class VmiBinsController {

        locationId: string;
        failedToLoadVmiBins: boolean = false;
        pagination: PaginationModel;
        paginationStorageKey = "DefaultPaginationVmiBinList";
        defaultSort = "product.shortDescription";
        searchFilter: vmiBin.ISearchFilter = {
            sort: this.defaultSort
        };
        vmiBins: VmiBinModel[];
        allSelected: boolean;
        isSelected: {};
        Papa: any;
        exportHeaders: string[];

        static $inject = ["$scope", "vmiBinService", "coreService", "paginationService", "queryString", "deleteVmiBinsModalService", "vmiBinModalService", "spinnerService"];

        constructor(
            protected $scope: ng.IScope,
            protected vmiBinService: vmiBin.IVmiBinService,
            protected coreService: core.ICoreService,
            protected paginationService: core.IPaginationService,
            protected queryString: common.IQueryStringService,
            protected deleteVmiBinsModalService: vmiBin.IDeleteVmiBinsModalService,
            protected vmiBinModalService: vmiBin.IVmiBinModalService,
            protected spinnerService: core.ISpinnerService) {
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

            this.locationId = this.queryString.get("locationId");
            this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
            this.restoreHistory();
            this.getVmiBins();

            this.$scope.$on("vmi-bins-were-deleted", () => {
                if (this.pagination) {
                    this.pagination.page = 1;
                }

                this.getVmiBins();
            });

            this.$scope.$on("vmi-bin-was-created", () => {
                this.getVmiBins();
            });

            this.$scope.$on("vmi-bins-were-imported", () => {
                this.getVmiBins();
            });
        }

        openAddProductModal(): void {
            this.vmiBinModalService.display({
                vmiBin: { vmiLocationId: this.locationId },
                broadcastCreateStr: "vmi-bin-was-created",
                showImport: true
            });
        }

        search(): void {
            if (this.pagination) {
                this.pagination.page = 1;
            }

            this.getVmiBins();
        }

        changeSort(sort: string): void {
            if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                this.searchFilter.sort = sort.split(",").map(o => `${o} DESC`).join(",");
            } else {
                this.searchFilter.sort = sort;
            }

            this.getVmiBins(true);
        }

        getVmiBins(newSearch: boolean = false): void {
            if (newSearch) {
                this.pagination.page = 1;
            }

            this.coreService.replaceState({ filter: this.searchFilter, pagination: this.pagination });

            this.spinnerService.show();
            this.vmiBinService.getVmiBins(this.locationId, this.searchFilter, this.pagination).then(
                (getVmiBinCollection: VmiBinCollectionModel) => { this.getVmiBinsCompleted(getVmiBinCollection); },
                (error: any) => { this.getVmiBinsFailed(error); });
        }

        protected getVmiBinsCompleted(getVmiBinCollection: VmiBinCollectionModel): void {
            this.isSelected = {};
            this.allSelected = false;
            this.pagination = getVmiBinCollection.pagination;
            this.vmiBins = getVmiBinCollection.vmiBins;
            this.spinnerService.hide();
        }

        protected getVmiBinsFailed(error: any): void {
            this.spinnerService.hide();
            this.failedToLoadVmiBins = true;
        }

        clear(): void {
            this.searchFilter = {
                sort: this.defaultSort
            };
            this.search();
        }

        protected restoreHistory(): void {
            const state = this.coreService.getHistoryState();
            if (state) {
                if (state.pagination) {
                    this.pagination = state.pagination;
                }

                if (state.filter) {
                    this.searchFilter = state.filter;
                }
            }
        }

        selectAll(): void {
            const selectedCount = Object.keys(this.isSelected).length;
            if (selectedCount === this.vmiBins.length) {
                this.isSelected = {};
                this.allSelected = false;
            } else {
                this.vmiBins.forEach(o => this.isSelected[o.id.toString()] = true);
                this.allSelected = true;
            }
        }

        select(id: string): void {
            if (this.isSelected[id]) {
                delete this.isSelected[id];
            } else {
                this.isSelected[id] = true;
            }

            this.allSelected = Object.keys(this.isSelected).length === this.vmiBins.length;
        }

        isAnyRowSelected(): boolean {
            return this.isSelected && Object.keys(this.isSelected).length > 0;
        }

        protected generateCsv(list: VmiBinModel[]): void {
            this.spinnerService.hide();

            const dataForUnparse = this.createDataForUnparse(list);
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

        protected createDataForUnparse(list: VmiBinModel[]): any {
            if (!list?.length) {
                return null;
            }

            return {
                fields: this.exportHeaders,
                data: list.map(o => [
                    o.vmiLocationId.toString(),
                    o.productId.toString(),
                    o.binNumber,
                    o.minimumQty.toString(),
                    o.maximumQty.toString(),
                ]),
            };
        };

        exportSelected(): void {
            this.spinnerService.show();

            let selectedBins: VmiBinModel[] = [];

            this.vmiBins.forEach((vmiBin) => {
                if (this.isSelected[vmiBin.id.toString()]) {
                    selectedBins.push(vmiBin);
                }
            });

            this.generateCsv(selectedBins);
        }

        exportAll(): void {
            this.spinnerService.show();

            this.vmiBinService.getVmiBins(this.locationId, {}, { page: 1, pageSize: this.pagination?.totalItemCount } as PaginationModel).then(
                (result: VmiBinCollectionModel) => { this.generateCsv(result.vmiBins) },
                (error: any) => { this.getVmiBinsFailed(error); });
        }

        deleteVmiBins(): void {
            this.deleteVmiBinsModalService.display({
                vmiBins: this.vmiBins.filter(o => this.isSelected[o.id.toString()]),
                broadcastStr: "vmi-bins-were-deleted"
            });
        }
    }

    angular
        .module("insite")
        .controller("VmiBinsController", VmiBinsController);
}