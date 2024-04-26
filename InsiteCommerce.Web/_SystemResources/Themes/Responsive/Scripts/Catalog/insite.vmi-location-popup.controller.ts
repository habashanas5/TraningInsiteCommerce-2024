module insite.catalog {
    "use strict";

    export class VmiLocationPopupController {
        editMode: boolean;
        location: VmiLocationModel;
        billTo: BillToModel;
        afterSaveFn: Function;
        shipTo: ShipToModel;
        totalLocationCount: number;
        useBin: boolean;
        locationName: string;
        errorMessage: string;

        vmiLocationForm: any;


        static $inject = ["coreService", "vmiLocationsService", "vmiLocationPopupService", "vmiLocationImportPopupService"];

        constructor(
            protected coreService: core.ICoreService,
            protected vmiLocationsService: catalog.IVmiLocationsService,
            protected vmiLocationPopupService: IVmiLocationPopupService,
            protected vmiLocationImportPopupService: common.IVmiLocationImportPopupService) {
        }

        $onInit(): void {
            this.vmiLocationPopupService.registerDisplayFunction((data) => {
                this.location = data.location ? JSON.parse(JSON.stringify(data.location)) : undefined;
                this.billTo = data.billTo;
                this.afterSaveFn = data.afterSaveFn;
                this.totalLocationCount = data.totalLocationCount;
                this.fillData();
                this.errorMessage = "";
                if (this.vmiLocationForm) {
                    this.vmiLocationForm.$setPristine();
                    this.vmiLocationForm.$setUntouched();
                }
                this.coreService.displayModal("#VmiLocationPopup");
            });
        }

        protected fillData(): void {
            if (!this.location) {
                this.editMode = false;
                this.shipTo = null;
                this.useBin = true;
                this.locationName = "";

                if (this.billTo && this.billTo.shipTos) {
                    this.shipTo = this.billTo.shipTos[0];
                }
            } else {
                this.editMode = true;
                this.useBin = this.location.useBins;
                this.locationName = this.location.name;
                this.shipTo = this.billTo.shipTos.find(x => x.id === this.location.billToId || x.id === this.location.shipToId);
            }
        }

        addToVmiLocationList(): void {
            if (!this.vmiLocationForm.$valid) {
                return;
            }

            this.vmiLocationsService.addVmiLocation(this.useBin, this.shipTo.id, this.billTo.id, this.locationName, false).then(
                (result: VmiLocationModel) => { this.addLocationCompleted(result); },
                (error: any) => { this.addLocationFailed(error); });
        }

        protected addLocationCompleted(location: VmiLocationModel): void {
            this.afterSaveFn();

            this.closeModal();
        }

        protected addLocationFailed(error: any): void {
            if (error && error.message) {
                this.errorMessage = error.message;
            }
        }

        updateLocation(): void {
            if (!this.vmiLocationForm.$valid) {
                return;
            }

            this.vmiLocationsService.updateVmiLocation(this.useBin, this.shipTo, this.location, this.locationName).then(
                (result: VmiLocationModel) => { this.updateLocationCompleted(result); },
                (error: any) => { this.updateLocationFailed(error); });
        }

        protected updateLocationCompleted(location: VmiLocationModel): void {
            this.afterSaveFn();

            this.closeModal();
        }

        protected updateLocationFailed(error: any): void {
            if (error && error.message) {
                this.errorMessage = error.message;
            }
        }

        openImportLocationPopup(): void {
            this.vmiLocationImportPopupService.display({ totalLocationCount: this.totalLocationCount });
        }

        protected closeModal(): void {
            this.coreService.closeModal("#VmiLocationPopup");
        }
    }

    export interface IVmiLocationPopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class VmiLocationPopupService extends base.BasePopupService<any> implements IVmiLocationPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-vmi-location-popup></isc-vmi-location-popup>";
        }
    }

    angular
        .module("insite")
        .controller("VmiLocationPopupController", VmiLocationPopupController)
        .service("vmiLocationPopupService", VmiLocationPopupService)
        .directive("iscVmiLocationPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Catalog-VmiLocationPopup",
            scope: {},
            controller: "VmiLocationPopupController",
            controllerAs: "vm",
            bindToController: true
        }));
}