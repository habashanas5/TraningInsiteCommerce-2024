module insite.vmiUsers {
    "use strict";

    export class RemoveVmiUserPopupController {
        userId: string;

        static $inject = ["$rootScope","accountService", "coreService", "removeVmiUserPopupService"];

        constructor(
            protected $rootScope: ng.IRootScopeService,
            protected accountService: account.IAccountService,
            protected coreService: core.ICoreService,
            protected removeVmiUserPopupService: IRemoveVmiUserPopupService) {
        }

        $onInit(): void {
            const popup = angular.element("#popup-remove-vmi-user");

            this.removeVmiUserPopupService.registerDisplayFunction((userId: string) => {
                this.userId = userId;
                this.coreService.displayModal(popup);
            });
        }

        protected closeModal(): void {
            this.coreService.closeModal("#popup-remove-vmi-user");
        }

        removeVmiUser(): void {
            const vmiUser = {
                "userId": this.userId,
                "role": null,
                "vmiLocationIds": null,
                "removeVmiPermissions": true,
                "uri": null,
                "properties": null
            } as VmiUserModel;
            this.accountService.updateVmiUser(vmiUser).then(
                (vmiUser: VmiUserModel) => {
                    this.updateVmiUserCompleted(vmiUser);
                },
                (error: any) => {
                    this.updateVmiUserFailed(error);
                });
        }

        protected updateVmiUserCompleted(vmiUser: VmiUserModel): void {
            this.closeModal();
            this.$rootScope.$broadcast("vmi-user-was-updated");
        }

        protected updateVmiUserFailed(error: any): void {
        }
    }

    export interface IRemoveVmiUserPopupService {
        display(userId: string): void;
        registerDisplayFunction(p: (userId: string) => void);
    }

    export class RemoveVmiUserPopupService extends base.BasePopupService<any> implements IRemoveVmiUserPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-remove-vmi-user-popup></isc-remove-vmi-user-popup>";
        }
    }

    angular
        .module("insite")
        .controller("RemoveVmiUserPopupController", RemoveVmiUserPopupController)
        .service("removeVmiUserPopupService", RemoveVmiUserPopupService)
        .directive("iscRemoveVmiUserPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/VmiUsers-RemoveVmiUserPopup",
            controller: "RemoveVmiUserPopupController",
            controllerAs: "vm",
            bindToController: true
        }));
}