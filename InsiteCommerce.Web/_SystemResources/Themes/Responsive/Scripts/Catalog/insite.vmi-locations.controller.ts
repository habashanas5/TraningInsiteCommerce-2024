import VmiLocationModel = Insite.Catalog.WebApi.V1.ApiModels.VmiLocationModel;

module insite.catalog {
    "use strict";

    export class VmiLocationsController {
        vmiLocationDetailsUrl: string;
        pagination: PaginationModel;
        billTo: BillToModel;
        shipTo: ShipToModel;
        useBin: boolean;
        locationName: string;
        paginationStorageKey = "DefaultPagination-VmiLocationSearch";
        savedLocations: VmiLocationModel[];
        checkStorage: {} = {};
        checkedLocationsCount = 0;
        editingLocation: VmiLocationModel;
        searchFilter: string;
        sort: string;
        allSelected = false;

        Papa: any;
        exportHeaders: string[];

        static $inject = [
            "$scope",
            "coreService",
            "spinnerService",
            "customerService",
            "vmiLocationPopupService",
            "paginationService",
            "sessionService",
            "vmiLocationsService",
            "deleteLocationPopupService"];

        constructor(
            protected $scope: ng.IScope,
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService,
            protected customerService: customers.ICustomerService,
            protected vmiLocationPopupService: catalog.IVmiLocationPopupService,
            protected paginationService: core.IPaginationService,
            protected sessionService: account.ISessionService,
            protected vmiLocationsService: catalog.IVmiLocationsService,
            protected deleteLocationPopupService: vmiLocation.IDeleteLocationPopupService) {
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

            this.$scope.$on("UploadingItemsCompleted", () => {
                this.searchFilter = this.getDefaultSearchFilter();
                this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
                this.getLocations();
            });
            this.initCheckStorageWatcher();
            this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
            this.searchFilter = this.getDefaultSearchFilter();
            this.getSession();

            this.$scope.$on("vmi-locations-were-deleted", () => {
                this.getLocations();
            });
        }

        initCheckStorageWatcher(): void {
            this.$scope.$watch(() => this.checkStorage, () => this.calculateCheckedLocations(), true);
        }

        calculateCheckedLocations(): void {
            this.checkedLocationsCount = 0;

            if (!this.savedLocations) {
                return;
            }

            for (let i = 0; i < this.savedLocations.length; i++) {
                if (this.checkStorage[this.savedLocations[i].id.toString()]) {
                    this.checkedLocationsCount++;
                }
            }
        }

        getSession(): void {
            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });
        }

        protected getSessionCompleted(session: SessionModel): void {
            const shipTo = session.shipTo.oneTimeAddress ? null : session.shipTo;
            this.getBillTo(shipTo);
        }

        getBillTo(selectedShipTo?: ShipToModel): void {
            this.customerService.getBillTo("shiptos,excludeonetime,excludecreatenew,country,state").then(
                (billTo: BillToModel) => { this.getBillToCompleted(billTo, selectedShipTo); },
                (error: any) => { this.getBillToFailed(error); });
        }

        protected getBillToCompleted(billTo: BillToModel, selectedShipTo?: ShipToModel): void {
            this.billTo = billTo;

            this.getLocations();
        }

        protected getBillToFailed(error: any): void {
        }

        protected getSessionFailed(error: any): void {
        }

        clear(): void {
            this.pagination.page = 1;
            this.searchFilter = this.getDefaultSearchFilter();
            this.sort = "Name";

            this.getLocations();
        }

        changeSort(sort: string): void {
            if (this.sort === sort && this.sort.indexOf(" DESC") < 0) {
                this.sort = sort.split(",").map(o => `${o} DESC`).join(",");
            } else {
                this.sort = sort;
            }

            this.getLocations(true);
        }

        isLocationChecked(locationId: System.Guid): boolean {
            return !!this.checkStorage[locationId.toString()];
        }

        toggleSelected(location: VmiLocationModel): void {
            if (this.checkStorage[location.id.toString()]) {
                delete this.checkStorage[location.id.toString()];
                this.allSelected = false;
            } else {
                this.checkStorage[location.id.toString()] = true;
            }
        }

        toggleSelectedAll(): void {
            if (this.allSelected) {
                this.checkStorage = {};
                this.allSelected = false;
            } else {
                for (let i = 0; i < this.savedLocations.length; i++) {
                    this.checkStorage[this.savedLocations[i].id.toString()] = true;
                }
                this.allSelected = true;
            }
        }

        search(): void {
            if (this.pagination) {
                this.pagination.page = 1;
            }

            this.getLocations();
        }

        protected updateHistory(): void {
            this.coreService.replaceState({ filter: this.searchFilter, pagination: this.pagination });
        }

        protected getDefaultSearchFilter(): string {
            return "";
        }

        getLocations(newSearch: boolean = false): void {
            if (newSearch) {
                this.pagination.page = 1;
            }

            this.updateHistory();

            const filter: ISearchFilter = {
                filter: this.searchFilter,
                sort: this.sort,
                page: this.pagination?.page,
                pageSize: this.pagination?.pageSize
            }

            this.vmiLocationsService.getVmiLocations(filter).then(
                (locationCollection: VmiLocationCollectionModel) => { this.getLocationsCompleted(locationCollection); },
                (error: any) => { this.getLocationsFailed(error); });
        }

        protected getLocationsCompleted(locationCollection: VmiLocationCollectionModel): void {
            this.savedLocations = locationCollection.vmiLocations;
            this.pagination = locationCollection.pagination;
        }

        protected getLocationsFailed(error: any): void {
        }

        deleteVmiLocations(): void {
            this.deleteLocationPopupService.display({
                vmiLocations: this.savedLocations.filter(location => this.checkStorage[location.id.toString()]),
                broadcastStr: "vmi-locations-were-deleted"
            });
        }

        exportSelected(): void {
            this.spinnerService.show();

            let selectedLocations: VmiLocationModel[] = [];

            this.savedLocations.forEach((location) => {
                if (this.checkStorage[location.id.toString()]) {
                    selectedLocations.push(location);
                }
            });

            this.generateCsv(selectedLocations);
        }

        exportAll(): void {
            this.spinnerService.show();

            const filter: ISearchFilter = {
                filter: "",
                sort: this.sort,
                page: 0,
                pageSize: this.pagination?.totalItemCount
            }

            this.vmiLocationsService.getVmiLocations(filter).then(
                (locationCollection: VmiLocationCollectionModel) => { this.generateCsv(locationCollection.vmiLocations) },
                (error: any) => { this.getLocationsFailed(error); });
        }

        protected generateCsv(list: VmiLocationModel[]): void {
            this.spinnerService.hide();

            const dataForUnparse = this.createDataForUnparse(list);
            if (!dataForUnparse) {
                return;
            }

            const csv = this.Papa.unparse(dataForUnparse);
            const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

            const fileName = `vmi_locations_${list[0].id}.csv`;
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(csvBlob, fileName);
            } else {
                const downloadLink = document.createElement("a");
                downloadLink.href = window.URL.createObjectURL(csvBlob);
                downloadLink.setAttribute("download", fileName);
                downloadLink.click();
            }
        }

        protected createDataForUnparse(list: VmiLocationModel[]): any {
            if (!list?.length) {
                return null;
            }

            return {
                fields: this.exportHeaders,
                data: list.map(o => [
                    o.shipToId.toString(),
                    o.name,
                    o.useBins.toString(),
                    o.isPrimaryLocation.toString(),
                    o.customerLabel,
                ]),
            };
        };

        validForm(currentForm: any): boolean {
            if (!currentForm.$valid) {
                return false;
            }

            return true;
        }

        openEditPopup(location: VmiLocationModel): void {
            this.vmiLocationPopupService.display({ location, billTo: this.billTo, totalLocationCount: this.pagination.totalItemCount, afterSaveFn: () => { this.getLocations(); } });
        }

        openAddPopup(): void {
            this.vmiLocationPopupService.display({ undefined, billTo: this.billTo, afterSaveFn: () => { this.getLocations(); } });
        }
    }

    angular
        .module("insite")
        .controller("VmiLocationsController", VmiLocationsController);
}