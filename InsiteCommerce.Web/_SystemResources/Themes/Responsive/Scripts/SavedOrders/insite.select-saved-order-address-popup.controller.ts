module insite.savedorders {
    "use strict";

    export class SelectSavedOrderAddressPopupController {
        errorMessage: string;
        cart: CartModel;
        session: SessionModel;
        useCustomerFrom: string = "order";

        static $inject = ["$rootScope", "coreService", "selectSavedOrderAddressPopupService", "sessionService"];

        constructor(
            protected $rootScope: ng.IRootScopeService,
            protected coreService: insite.core.ICoreService,
            protected selectSavedOrderAddressPopupService: ISelectSavedOrderAddressPopupService,
            protected sessionService: account.ISessionService) {
        }

        $onInit(): void {
            this.initListPopupEvents();
        }

        protected closeModal(): void {
            this.coreService.closeModal("#popup-select-saved-order-address");
        }

        protected clearMessages(): void {
            this.errorMessage = "";
        }

        protected initListPopupEvents(): void {
            const popup = angular.element("#popup-select-saved-order-address");

            this.selectSavedOrderAddressPopupService.registerDisplayFunction((data) => {
                this.cart = data.cart;
                this.session = data.session;

                this.coreService.displayModal(popup);
            });
        }

        setCustomer(): void {

            if (this.useCustomerFrom === "session") {
                this.$rootScope.$broadcast("savedOrderCustomerWasSet", { useCustomerFrom: "session" });
                this.closeModal();
                return;
            }

            const session: SessionModel = {
                customerWasUpdated: false,
                billTo: { id: this.cart.billTo.id },
                shipTo: { id: this.cart.shipTo.id },
            } as any;

            this.sessionService.updateSession(session).then(
                (session: SessionModel) => { this.setCustomerCompleted(session); },
                (error: any) => { this.setCustomerFailed(error); });
        }

        protected setCustomerCompleted(session: SessionModel): void {
            this.$rootScope.$broadcast("savedOrderCustomerWasSet", { useCustomerFrom: "order" });
            this.closeModal();
        }

        protected setCustomerFailed(error: any): void {
        }
    }

    export interface ISelectSavedOrderAddressPopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class SelectSavedOrderAddressPopupService extends base.BasePopupService<any> implements ISelectSavedOrderAddressPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-select-saved-order-address-popup></isc-select-order-saved-address-popup>";
        }
    }

    angular
        .module("insite")
        .controller("SelectSavedOrderAddressPopupController", SelectSavedOrderAddressPopupController)
        .service("selectSavedOrderAddressPopupService", SelectSavedOrderAddressPopupService)
        .directive("iscSelectSavedOrderAddressPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/SavedOrder-SelectSavedOrderAddressPopup",
            controller: "SelectSavedOrderAddressPopupController",
            controllerAs: "vm",
            bindToController: true
        }));
}