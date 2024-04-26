module insite.catalog {
    "use strict";
    import VmiBinModel = Insite.Catalog.WebApi.V1.ApiModels.VmiBinModel;
    import VmiCountCollectionModel = Insite.Catalog.WebApi.V1.ApiModels.VmiCountCollectionModel;
    import VmiCountModel = Insite.Catalog.WebApi.V1.ApiModels.VmiCountModel;

    export class VmiBinDetailController {

        vmiLocationId: string;
        vmiBinId: string;
        vmiBin: VmiBinModel;

        pagination: PaginationModel;
        paginationStorageKey = "DefaultPaginationVmiCountList";
        defaultSort = "createdOn DESC";
        searchFilter: vmiCount.ISearchFilter = {
            sort: this.defaultSort
        };
        vmiCounts: VmiCountModel[];
        allSelected: boolean;
        isSelected: {};

        vmiCountOptions: any;
        defaultPageSize = 20;
        vmiCountOptionsPlaceholder: string;

        Papa: any;
        exportHeaders: string[];

        static $inject = ["$scope", "vmiBinService", "coreService", "queryString", "vmiCountService", "paginationService", "spinnerService", "$filter", "vmiBinModalService"];

        constructor(
            protected $scope: ng.IScope,
            protected vmiBinService: vmiBin.IVmiBinService,
            protected coreService: core.ICoreService,
            protected queryString: common.IQueryStringService,
            protected vmiCountService: vmiCount.IVmiCountService,
            protected paginationService: core.IPaginationService,
            protected spinnerService: core.ISpinnerService,
            protected $filter: ng.IFilterService,
            protected vmiBinModalService: vmiBin.IVmiBinModalService) {
        }

        $onInit(): void {
            this.vmiLocationId = this.queryString.get("locationId");
            this.vmiBinId = this.queryString.get("id");
            if (this.vmiLocationId && this.vmiBinId) {
                this.getVmiBin();
            }

            this.updateBreadcrumbs();

            this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
            this.restoreHistory();

            if (typeof (Papa) === "undefined") {
                $.getScript("/SystemResources/Scripts/Libraries/papaparse/4.1/papaparse.min.js", () => {
                    this.Papa = Papa;
                });
            } else {
                this.Papa = Papa;
            }

            this.$scope.$on("vmi-bin-was-saved", (event, vmiBin: VmiBinModel) => {
                this.vmiBin.binNumber = vmiBin.binNumber;
                this.vmiBin.minimumQty = vmiBin.minimumQty;
                this.vmiBin.maximumQty = vmiBin.maximumQty;
            });
        }

        protected getVmiBin(): void {
            this.vmiBinService.getVmiBin(this.vmiLocationId, this.vmiBinId).then(
                (vmiBin: VmiBinModel) => { this.getVmiBinCompleted(vmiBin); },
                (error: any) => { this.getVmiBinFailed(error); });
        }

        protected getVmiBinCompleted(vmiBin: VmiBinModel): void {
            this.vmiBin = vmiBin;
            this.initVmiCountsAutocompletes();
            this.getVmiCounts();
        }

        protected getVmiBinFailed(error: any): void {
        }

        updateBreadcrumbs(): void {
            this.$scope.$watch(() => this.vmiBin && this.vmiBin.product && this.vmiBin.product.shortDescription, (newValue) => {
                if (newValue) {
                    const currentElement = angular.element(".breadcrumbs > .current");
                    currentElement.text(newValue);
                    const link = currentElement.siblings("li:last").children("a");
                    const href = link.attr("href");
                    if (href && href.indexOf("?locationId=") === -1) {
                        link.attr("href", `${href}?locationId=${this.vmiLocationId}`);
                    }
                }
            }, true);
        }

        openEditProductModal(): void {
            this.vmiBinModalService.display({
                vmiBin: JSON.parse(JSON.stringify(this.vmiBin)),
                broadcastEditStr: "vmi-bin-was-saved"
            });
        }

        search(): void {
            if (this.pagination) {
                this.pagination.page = 1;
            }

            this.getVmiCounts();
        }

        changeSort(sort: string): void {
            if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                this.searchFilter.sort = sort.split(",").map(o => `${o} DESC`).join(",");
            } else {
                this.searchFilter.sort = sort;
            }

            this.getVmiCounts();
        }

        getVmiCounts(): void {
            this.coreService.replaceState({ filter: this.searchFilter, pagination: this.pagination });

            this.vmiCountService.getVmiCounts(this.vmiLocationId, this.vmiBinId, this.searchFilter, this.pagination).then(
                (getVmiCountCollection: VmiCountCollectionModel) => { this.getVmiCountsCompleted(getVmiCountCollection); },
                (error: any) => { this.getVmiCountsFailed(error); });
        }

        protected getVmiCountsCompleted(getVmiCountCollection: VmiCountCollectionModel): void {
            this.isSelected = {};
            this.allSelected = false;
            this.pagination = getVmiCountCollection.pagination;
            this.vmiCounts = getVmiCountCollection.binCounts;
        }

        protected getVmiCountsFailed(error: any): void {
        }

        clear(): void {
            this.searchFilter = {
                sort: this.defaultSort
            };
            this.search();
            this.vmiCountOptions.dataSource.read();
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
            if (selectedCount === this.vmiCounts.length) {
                this.isSelected = {};
                this.allSelected = false;
            } else {
                this.vmiCounts.forEach(o => this.isSelected[o.id.toString()] = true);
                this.allSelected = true;
            }
        }

        select(id: string): void {
            if (this.isSelected[id]) {
                delete this.isSelected[id];
            } else {
                this.isSelected[id] = true;
            }

            this.allSelected = Object.keys(this.isSelected).length === this.vmiCounts.length;
        }

        isAnyRowSelected(): boolean {
            return this.isSelected && Object.keys(this.isSelected).length > 0;
        }

        initVmiCountsAutocompletes(): void {
            this.vmiCountOptions = this.vmiCountOptions || {
                dataSource: new kendo.data.DataSource({
                    serverFiltering: true,
                    serverPaging: true,
                    transport: {
                        read: (options: kendo.data.DataSourceTransportReadOptions) => {
                            this.onVmiCountAutocompleteRead(options);
                        }
                    }
                }),
                select: (event: kendo.ui.AutoCompleteSelectEvent) => {
                    this.onVmiCountAutocompleteSelect(event);
                },
                minLength: 0,
                dataTextField: "createdBy",
                dataValueField: "createdBy",
                placeholder: this.vmiCountOptionsPlaceholder
            };

            this.vmiCountOptions.dataSource.read();
        }

        protected openAutocomplete($event: ng.IAngularEvent, selector: string): void {
            const autoCompleteElement = angular.element(selector) as any;
            const kendoAutoComplete = autoCompleteElement.data("kendoAutoComplete");
            kendoAutoComplete.popup.open();
        }

        protected onVmiCountAutocompleteRead(options: kendo.data.DataSourceTransportReadOptions): void {
            this.vmiCountService.getVmiCounts(this.vmiLocationId, this.vmiBinId, { getUniqueByUser: true, userName: this.searchFilter.userName }, this.getDefaultPagination()).then(
                (vmiCountCollectionModel: VmiCountCollectionModel) => { this.getVmiCountCollectionCompleted(options, vmiCountCollectionModel); },
                (error: any) => { this.getVmiCountCollectionFailed(error); });
        }

        protected getVmiCountCollectionCompleted(options: kendo.data.DataSourceTransportReadOptions, vmiCountCollectionModel: VmiCountCollectionModel): void {
            const vmiCountCollection = vmiCountCollectionModel.binCounts;

            // need to wrap this in setTimeout for prevent double scroll
            setTimeout(() => { options.success(vmiCountCollection); }, 0);
        }

        protected getVmiCountCollectionFailed(error: any): void {
        }

        protected onVmiCountAutocompleteSelect(event: kendo.ui.AutoCompleteSelectEvent): void {
            if (event.item == null) {
                return;
            }

            const dataItem = event.sender.dataItem(event.item.index());
            this.searchFilter.userName = dataItem.createdBy;
        }

        protected getDefaultPagination(): PaginationModel {
            return { page: 1, pageSize: this.defaultPageSize } as PaginationModel;
        }

        exportAll(): void {
            this.spinnerService.show();
            this.vmiCountService.getVmiCounts(this.vmiLocationId, this.vmiBinId, {}, { pageSize: 9999 } as PaginationModel).then(
                (getVmiCountCollection: VmiCountCollectionModel) => { this.getExportVmiCountsCompleted(getVmiCountCollection); },
                (error: any) => { this.getVmiCountsFailed(error); });
        }

        protected getExportVmiCountsCompleted(getVmiCountCollection: VmiCountCollectionModel): void {
            this.spinnerService.hide();
            this.generateCsvFile(getVmiCountCollection.binCounts);
        }

        protected getExportVmiCountsFailed(error: any): void {
            this.spinnerService.hide();
        }

        exportSelected(): void {
            const items = [];
            for (const vmiCount of this.vmiCounts) {
                if (this.isSelected[vmiCount.id.toString()]) {
                    items.push(vmiCount);
                }
            }

            this.generateCsvFile(items);
        }

        generateCsvFile(vmiCounts: VmiCountModel[]): void {
            const csv = this.Papa.unparse({
                fields: this.exportHeaders,
                data: vmiCounts.map(o => [o.count.toString(), this.$filter("date")(o.createdOn, "shortDate"), o.createdBy])
            });
            const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

            const fileName = `vmiBin_${this.vmiBinId}_vmiCounts.csv`;
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(csvBlob, fileName);
            } else {
                const downloadLink = document.createElement("a");
                downloadLink.href = window.URL.createObjectURL(csvBlob);
                downloadLink.setAttribute("download", fileName);
                downloadLink.click();
            }
        }
    }

    angular
        .module("insite")
        .controller("VmiBinDetailController", VmiBinDetailController);
}