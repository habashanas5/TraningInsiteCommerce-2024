module insite.common {
    "use strict";

    enum LocationUploadError {
        None,
        NoBillTo,
        BillToNotFound,
        NoShipTo,
        ShipToNotFound,
        NoLocationName,
        DuplicateLocationName,
        DuplicateLocationNameSameFile,
        LocationNameTooLong
    }

    export class VmiLocationImportPopupController extends common.BaseUploadController {
        currentBillTo: BillToModel;
        totalLocationCount: number;
        errorEntries: any[] = null;
        fullFileError: boolean;
        importedItems: VmiLocationModel[];

        static $inject = [
            "$rootScope",
            "$scope",
            "productService",
            "vmiLocationsService",
            "customerService",
            "coreService",
            "settingsService",
            "vmiLocationImportPopupService",
            "sessionService"];

        constructor(
            protected $rootScope: ng.IRootScopeService,
            protected $scope: ng.IScope,
            protected productService: catalog.IProductService,
            protected vmiLocationsService: catalog.IVmiLocationsService,
            protected customerService: customers.ICustomerService,
            protected coreService: core.ICoreService,
            protected settingsService: core.ISettingsService,
            protected vmiLocationImportPopupService: IVmiLocationImportPopupService,
            protected sessionService: account.ISessionService) {
            super($scope, productService, coreService, settingsService);
            this.vmiLocationImportPopupService.registerDisplayFunction((data) => {
                this.cleanupUploadData();
                this.totalLocationCount = data.totalLocationCount;
                this.badFile = false;
                this.file = null;
                this.fileName = null;
                this.fullFileError = false;
                this.uploadLimitExceeded = false;
                this.coreService.displayModal("#VmiLocationImportPopup");
            });
        }

        protected processWb(wb): void {
            this.itemsToSearch = [];
            wb.SheetNames.forEach((sheetName) => {
                const opts = { header: 1 };
                let roa = this.XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName], opts);
                if (roa.length > 0) {
                    if (this.firstRowHeading) {
                        roa = roa.slice(1, roa.length);
                    }
                    roa = roa.filter(r => (r[0] != null && r[0].length > 0) || (r[1] != null && r[1].length > 0) || (r[2] != null && r[2].length > 0));
                    if (this.limitExceeded(roa.length)) {
                        return;
                    }
                    roa.forEach((r) => {
                        let objectToAdd = { givenBillTo: r[0], billToId: null, givenShipTo: r[1], shipToId: null, name: r[2], useBins: r[3] ? r[3].toString().toLowerCase() : 'false' };

                        if (objectToAdd.givenBillTo && !guidHelper.isEmptyGuid(objectToAdd.givenBillTo) && guidHelper.isGuid(objectToAdd.givenBillTo)) {
                            objectToAdd.billToId = objectToAdd.givenBillTo;
                        }

                        if (objectToAdd.givenShipTo && !guidHelper.isEmptyGuid(objectToAdd.givenShipTo) && guidHelper.isGuid(objectToAdd.givenShipTo)) {
                            objectToAdd.shipToId = objectToAdd.givenShipTo;
                        }
                        if (objectToAdd.useBins === '1') {
                            objectToAdd.useBins = 'true';
                        } else {
                            objectToAdd.useBins = 'false';
                        }

                        this.itemsToSearch.push(objectToAdd);
                    });
                }
            });

            this.batchGetFromApi();
        }

        protected processCsv(data: string): void {
            this.itemsToSearch = [];
            const newLineIndex = data.lastIndexOf("\r\n");
            if (newLineIndex + 2 === data.length) {
                data = data.substr(0, newLineIndex);
            }
            const results = Papa.parse(data);
            if (results.errors.length > 0) {
                this.badFile = true;
                return;
            }
            let rows = results.data;
            if (this.firstRowHeading) {
                rows = rows.slice(1, rows.length);
            }
            if (this.limitExceeded(rows.length)) {
                return;
            }
            rows.forEach((s) => {
                if ((s[0] == null || s[0].length === 0) && (s[1] == null || s[1].length === 0) && (s[2] == null || s[2].length === 0)) {
                    return;
                }
                const objectToAdd: any = {};
                objectToAdd.givenBillTo = s[0];

                if (objectToAdd.givenBillTo && !guidHelper.isEmptyGuid(objectToAdd.givenBillTo) && guidHelper.isGuid(objectToAdd.givenBillTo)) {
                    objectToAdd.billToId = objectToAdd.givenBillTo;
                }
                if (s[1]) {
                    objectToAdd.givenShipTo = s[1];

                    if (!guidHelper.isEmptyGuid(objectToAdd.givenShipTo) && guidHelper.isGuid(objectToAdd.givenShipTo)) {
                        objectToAdd.shipToId = objectToAdd.givenShipTo;
                    }
                }
                if (s[2]) {
                    objectToAdd.name = s[2];
                }
                if (s[3]) {
                    objectToAdd.useBins = s[3] ? s[3] : 'false';
                }

                if (objectToAdd.useBins === '1') {
                    objectToAdd.useBins = 'true';
                } else {
                    objectToAdd.useBins = 'false';
                }

                this.itemsToSearch.push(objectToAdd);
            });
            this.batchGetFromApi();
        }

        protected batchGetFromApi(): void {
            this.errorEntries = [];
            this.importedItems = [];

            if (this.itemsToSearch.length === 0) {
                this.badFile = true;
                return;
            }

            this.vmiLocationsService.batchAddVmiLocations(this.itemsToSearch, true).then(
                (locationCollection: VmiLocationCollectionModel) => { this.validateLocationsCompleted(locationCollection); },
                (error: any) => { this.validateLocationsFailed(error); });
        }

        protected validateLocationsCompleted(locationCollection: VmiLocationCollectionModel): void {
            if (this.uploadCancelled) {
                return;
            }

            this.customerService.getBillTo("shiptos,excludeonetime,excludecreatenew,country,state").then(
                (billTo: BillToModel) => { this.getBillToCompleted(billTo, locationCollection); },
                (error: any) => { this.getBillToFailed(error); });
        }

        protected validateLocationsFailed(error: any): void {
            // server gave us back an error, need to let user know the file was using incorrect format
            this.fullFileError = true;
            if (this.uploadCancelled) {
                return;
            }

            this.checkCompletion();
        }

        protected getBillToCompleted(billTo: BillToModel, locationCollection?: VmiLocationCollectionModel): void {
            if (this.uploadCancelled) {
                return;
            }

            this.currentBillTo = billTo;

            this.processLocations(locationCollection?.vmiLocations);

            this.checkCompletion();
        }

        protected getBillToFailed(error: any): void {
        }

        protected processLocations(locations?: VmiLocationModel[]) {
            for (let i = 0; i < this.itemsToSearch.length; i++) {
                const index = this.firstRowHeading ? i + 2 : i + 1;
                const error = this.validateLocationData(this.itemsToSearch[i], i, locations);
                if (error === LocationUploadError.None) {
                    this.importedItems.push(this.itemsToSearch[i]);
                } else {
                    this.errorEntries.push(this.mapLocationErrorInfo(index, error, this.itemsToSearch[i].givenBillTo, this.itemsToSearch[i].givenShipTo, this.itemsToSearch[i].name));
                }
            };
        }

        protected validateLocationData(row: any, index: number, locations: VmiLocationModel[]): LocationUploadError {
            if (!row.givenBillTo) {
                return LocationUploadError.NoBillTo;
            }
            if (row.billToId === null) {
                return LocationUploadError.BillToNotFound;
            }
            if (row.billToId.toLowerCase() != this.currentBillTo.id.toString().toLowerCase()) {
                return LocationUploadError.BillToNotFound;
            }
            if (!row.givenShipTo) {
                return LocationUploadError.NoShipTo;
            }
            if (row.shipToId === null) {
                return LocationUploadError.ShipToNotFound;
            }
            if (!this.currentBillTo.shipTos.find(x => x.id.toLowerCase() === row.shipToId.toLowerCase())) {
                return LocationUploadError.ShipToNotFound;
            }
            if (!row.name) {
                return LocationUploadError.NoLocationName;
            }
            if (row.name.length > 255) {
                return LocationUploadError.LocationNameTooLong;
            }
            if (locations && locations[index]?.name?.toLowerCase() === row.name.toLowerCase() && locations[index]?.shipToId?.toString().toLowerCase() === row.shipToId.toString().toLowerCase()) {
                return LocationUploadError.DuplicateLocationName;
            }
            if (this.importedItems.find(x => x.name.toLowerCase() === row.name.toLowerCase() && x.shipToId?.toString().toLowerCase() === row.shipToId.toString().toLowerCase())) {
                return LocationUploadError.DuplicateLocationNameSameFile;
            }

            return LocationUploadError.None;
        }

        protected mapLocationErrorInfo(index: number, error: LocationUploadError, billToId: string, shipToId: string, name: string): any {
            return {
                billToId,
                shipToId,
                name,
                index: index,
                error: LocationUploadError[error],
            };
        }

        protected checkCompletion(): void {
            if (this.uploadCancelled) {
                return;
            }

            if (this.importedItems && this.errorEntries.length === 0 && !this.fullFileError) {
                this.uploadProducts();
            } else {
                this.hideUploadingPopup();
                setTimeout(() => {
                    this.showUploadingIssuesPopup();
                }, 250); // Foundation.libs.reveal.settings.animation_speed
            }
        }

        protected uploadProducts(popupSelector?: string): void {
            if (popupSelector) {
                this.coreService.closeModal(popupSelector);
            }

            this.allowCancel = false;

            this.vmiLocationsService.batchAddVmiLocations(this.importedItems, false).then(
                (result: VmiLocationModel) => { this.addLocationsCompleted(result); },
                (error: any) => { this.addLocationsFailed(error); });
        }

        protected addLocationsCompleted(location: VmiLocationModel): void {
            this.uploadingCompleted();
        }

        protected addLocationsFailed(error: any): void {
        }

        protected uploadingCompleted(): void {
            this.hideUploadingPopup();
            this.uploadedItemsCount = this.importedItems.length;

            setTimeout(() => {
                this.showUploadSuccessPopup();
                this.cleanupUploadData();
            }, 250);
        }

        protected cleanupUploadData(): void {
            this.file = null;
            this.fileName = null;
            this.firstRowHeading = false;
            this.errorEntries = null;
            this.fullFileError = false;
            this.importedItems = null;
        }

        protected showUploadingPopup() {
            this.coreService.displayModal(angular.element("#locationUploadingPopup"));
        }

        protected hideUploadingPopup() {
            this.coreService.closeModal("#locationUploadingPopup");
        }

        protected showUploadSuccessPopup() {
            this.coreService.displayModal(angular.element("#locationUploadSuccessPopup"), this.onCompletion());
        }

        onCompletion(): void {
            this.cleanupUploadData();

            this.$rootScope.$broadcast("UploadingItemsCompleted");
        }

        protected hideUploadSuccessPopup() {
            this.coreService.closeModal("#locationUploadSuccessPopup");
        }

        protected showUploadingIssuesPopup() {
            this.coreService.displayModal(angular.element("#locationUploadingIssuesPopup"));
        }

        protected hideUploadingIssuesPopup() {
            this.coreService.closeModal("#locationUploadingIssuesPopup");
        }
    }

    export interface IVmiLocationImportPopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class VmiLocationImportPopupService extends base.BasePopupService<any> implements IVmiLocationImportPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-vmi-location-import-popup></isc-vmi-location-import-popup>";
        }
    }

    angular
        .module("insite")
        .controller("VmiLocationImportPopupController", VmiLocationImportPopupController)
        .service("vmiLocationImportPopupService", VmiLocationImportPopupService)
        .directive("iscVmiLocationImportPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Catalog-VmiLocationImportPopup",
            controller: "VmiLocationImportPopupController",
            controllerAs: "vm",
            bindToController: true
        }));
}