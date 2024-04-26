module insite.cart {
    "use strict";

    export class InvalidPricePopupController {
        static $inject = [
            "$scope",
            "coreService",
            "invalidPricePopupService"
        ];

        constructor(
            protected $scope: ICartScope,
            protected coreService: core.ICoreService,
            protected invalidPricePopupService: IInvalidPricePopupService) {
        }

        $onInit(): void {
            this.registerDisplayFunction();
        }

        protected registerDisplayFunction(): void {
            this.invalidPricePopupService.registerDisplayFunction((data: any) => this.displayFunction(data));
        }

        protected displayFunction(data: any): void {
            const popupSelector = ".invalid-price-popup";
            const $popup = angular.element(popupSelector);
            if ($popup.length <= 0) {
                return;
            }

            this.coreService.displayModal($popup);
        }
    }

    export interface IInvalidPricePopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class InvalidPricePopupService extends base.BasePopupService<any> implements IInvalidPricePopupService {
        protected getDirectiveHtml(): string {
            return "<isc-invalid-price-popup></isc-invalid-price-popup>";
        }
    }

    angular
        .module("insite")
        .controller("InvalidPricePopupController", InvalidPricePopupController)
        .service("invalidPricePopupService", InvalidPricePopupService)
        .directive("iscInvalidPricePopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/Cart-InvalidPricePopup",
            controller: "InvalidPricePopupController",
            controllerAs: "vm",
            scope: {},
            bindToController: true
        }));
}