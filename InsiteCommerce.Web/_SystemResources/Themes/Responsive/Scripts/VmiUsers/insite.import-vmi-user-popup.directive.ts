module insite.vmiUsers {
    "use strict";

    import BaseUploadController = insite.common.BaseUploadController;
    import AccountModel = Insite.Account.WebApi.V1.ApiModels.AccountModel;
    import VmiUserImportCollectionModel = Insite.Account.WebApi.V1.ApiModels.VmiUserImportCollectionModel;
    import VmiUserImportModel = Insite.Account.WebApi.V1.ApiModels.VmiUserImportModel;

    export enum ImportError {
        NotFound,
        InvalidRole
    }

    export class ImportVmiUserPopupController extends BaseUploadController {
        errorUsers: any[] = null;
        users: AccountModel[];
        importedUsersCount = 0;

        static $inject = [
            "$scope",
            "$rootScope",
            "accountService",
            "productService",
            "coreService",
            "settingsService",
            "importVmiUserPopupService"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected accountService: account.IAccountService,
            protected productService: catalog.IProductService,
            protected coreService: core.ICoreService,
            protected settingsService: core.ISettingsService,
            protected importVmiUserPopupService: IImportVmiUserPopupService) {
            super($scope, productService, coreService, settingsService);
        }

        $onInit(): void {
            super.$onInit();

            const popup = angular.element("#popup-import-vmi-user");

            this.importVmiUserPopupService.registerDisplayFunction((userId: string) => {
                this.coreService.displayModal(popup);
            });
        }

        protected processWb(wb): void {
            this.itemsToSearch = [];
            wb.SheetNames.forEach((sheetName) => {
                const opts = {header: 1};
                let roa = this.XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName], opts);
                if (roa.length > 0) {
                    if (this.firstRowHeading) {
                        roa = roa.slice(1, roa.length);
                    }
                    roa = roa.filter(r => r[0] != null && r[0].length > 0);
                    if (this.limitExceeded(roa.length)) {
                        return;
                    }
                    this.itemsToSearch = roa.map(r => ({
                        UserName: r[0],
                        VmiLocations: r[1],
                        Role: r[2]
                    }));
                }
            });
            this.getAccounts();
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
                if (s[0] == null || s[0].length === 0) {
                    return;
                }
                const objectToAdd: any = {};
                objectToAdd.UserName = s[0];
                if (s[1]) {
                    objectToAdd.VmiLocations = s[1];
                }
                if (s[2]) {
                    objectToAdd.Role = s[2];
                }
                this.itemsToSearch.push(objectToAdd);
            });
            this.getAccounts();
        }

        protected getAccounts(): void {
            this.errorUsers = [];
            this.users = [];

            if (this.itemsToSearch.length === 0) {
                this.badFile = true;
                return;
            }

            const userNames = this.itemsToSearch.map(item => item.UserName);
            const pagination = {page: 1, pageSize: userNames.length} as PaginationModel;
            this.accountService.getAccounts(null, pagination, null, null, userNames).then(
                (accountCollection: AccountCollectionModel) => {
                    this.getAccountsCompleted(accountCollection);
                },
                (error: any) => {
                    this.getAccountsFailed(error);
                });
        }

        protected getAccountsCompleted(accountCollection: AccountCollectionModel): void {
            if (this.uploadCancelled) {
                return;
            }

            this.processUsers(accountCollection.accounts);

            this.checkCompletion();
        }

        protected getAccountsFailed(error: any): void {
            this.users = [];
        }

        protected processUsers(users: AccountModel[]) {
            for (let i = 0; i < this.itemsToSearch.length; i++) {
                const item = this.itemsToSearch[i];
                const index = this.firstRowHeading ? i + 2 : i + 1;
                const user = users.find(o => o.userName.toLocaleLowerCase() === item.UserName.toLocaleLowerCase())
                if (!user) {
                    this.errorUsers.push(this.mapUserErrorInfo(index, ImportError.NotFound, item.VmiLocations, item.Role, <AccountModel>{
                        userName: item.UserName
                    }));
                } else if (item.Role && item.Role !== "VMI_User" && item.Role !== "VMI_Admin") {
                    this.errorUsers.push(this.mapUserErrorInfo(index, ImportError.InvalidRole, item.VmiLocations, item.Role, <AccountModel>{
                        userName: item.UserName
                    }));
                } else if (!this.users.includes(user)) {
                    this.users.push(user);
                }
            }
        }

        mapUserErrorInfo(index: number, error: ImportError, vmiLocations: string, role: string, user: AccountModel): any {
            return {
                index: index,
                error: ImportError[error],
                userName: user.userName,
                vmiLocations: vmiLocations,
                role: role
            };
        }

        protected checkCompletion(): void {
            if (this.uploadCancelled) {
                return;
            }

            if (this.users.length > 0 && this.errorUsers.length === 0) {
                this.importVmiUsers();
            } else {
                this.hideUploadingPopup();
                setTimeout(() => {
                    this.showUploadingIssuesPopup();
                }, 250); // Foundation.libs.reveal.settings.animation_speed
            }
        }

        protected showUploadingPopup() {
            this.coreService.displayModal(angular.element("#userImportingPopup"));
        }

        protected hideUploadingPopup() {
            this.coreService.closeModal("#userImportingPopup");
        }

        protected showUploadingIssuesPopup() {
            this.coreService.displayModal(angular.element("#userImportingIssuesPopup"));
        }

        protected hideUploadingIssuesPopup() {
            this.coreService.closeModal("#userImportingIssuesPopup");
        }

        protected cleanupUploadData(): void {
            this.errorUsers = null;
            this.users = null;
            this.fileName = null;
            this.file = null;
            this.firstRowHeading = false;
        }

        protected closeModal(): void {
            this.coreService.closeModal("#popup-import-vmi-user");
            this.cancelUpload();
        }

        importVmiUsers(): void {
            this.hideUploadingIssuesPopup();
            this.allowCancel = false;

            setTimeout(() => {
                this.showUploadingPopup();
            }, 250);

            const model = {
                vmiUsers: this.users.map(o => {
                    const items = this.itemsToSearch.filter(i => i.UserName.toLocaleLowerCase() === o.userName.toLocaleLowerCase());
                    return {
                        userId: o.id,
                        vmiRoles: items.map(i => i.Role),
                        vmiLocationNames: items.map(i => i.VmiLocations?.split(",")).reduce((prev, cur) => prev.concat(cur), []),
                        uri: "",
                        properties: null
                    } as VmiUserImportModel
                })
            } as VmiUserImportCollectionModel;

            this.accountService.importVmiUsers(model).then(
                (vmiUserImportCollection: VmiUserImportCollectionModel) => {
                    this.importVmiUsersCompleted(vmiUserImportCollection);
                },
                (error: any) => {
                    this.importVmiUsersFailed(error);
                });
        }

        protected importVmiUsersCompleted(vmiUserImportCollection: VmiUserImportCollectionModel): void {
            this.hideUploadingPopup();
            this.importedUsersCount = this.users.length;

            setTimeout(() => {
                this.showImportSuccessPopup();
                this.cleanupUploadData();
            }, 250);
            this.$rootScope.$broadcast("vmi-user-was-updated");
        }

        protected importVmiUsersFailed(error: any): void {
        }

        protected showImportSuccessPopup() {
            const $popup = angular.element("#userImportingSuccessPopup");
            if ($popup.length > 0) {
                this.coreService.displayModal($popup);
            }
        }

        protected hideImportSuccessPopup() {
            this.coreService.closeModal("#userImportingSuccessPopup");
        }
    }

    export interface IImportVmiUserPopupService {
        display(data: any): void;

        registerDisplayFunction(p: (data: any) => void);
    }

    export class ImportVmiUserPopupService extends base.BasePopupService<any> implements IImportVmiUserPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-import-vmi-user-popup></isc-import-vmi-user-popup>";
        }
    }

    angular
        .module("insite")
        .controller("ImportVmiUserPopupController", ImportVmiUserPopupController)
        .service("importVmiUserPopupService", ImportVmiUserPopupService)
        .directive("iscImportVmiUserPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/VmiUsers-ImportVmiUserPopup",
            controller: "ImportVmiUserPopupController",
            controllerAs: "vm",
            bindToController: true
        }));
}