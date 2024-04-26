module insite.vmiUsers {
    "use strict";

    import AccountModel = Insite.Account.WebApi.V1.ApiModels.AccountModel;

    export class VmiUsersController {
        sort = "UserName";
        searchText = "";
        role = "";
        users: AccountModel[] = [];
        pagination: PaginationModel = null;
        paginationStorageKey = "DefaultPagination-VmiUser";
        displayEmail: boolean;

        static $inject = ["$scope", "accountService", "paginationService", "coreService", "addVmiUserPopupService", "settingsService"];

        constructor(
            protected $scope: ng.IScope,
            protected accountService: account.IAccountService,
            protected paginationService: core.IPaginationService,
            protected coreService: core.ICoreService,
            protected addVmiUserPopupService: IAddVmiUserPopupService,
            protected settingsService: core.ISettingsService) {
        }

        $onInit(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
            this.restoreHistory();

            this.search(this.sort, false, false);

            this.$scope.$on("vmi-user-was-updated", () => {
                this.search(this.sort, false, false);
            });
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.displayEmail = !settingsCollection.accountSettings.useEmailAsUserName;
        }

        protected getSettingsFailed(error: any): void {
        }

        search(sort: string = "UserName", newSearch: boolean = false, storeHistory: boolean = true): void {
            this.sort = sort;

            if (newSearch) {
                this.pagination.page = 1;
            }

            if (storeHistory) {
                this.updateHistory();
            }

            let roles;
            if (this.role === "User") {
                roles = ["VMI_User"];
            } else if (this.role === "Admin") {
                roles = ["VMI_Admin"];
            } else {
                roles = ["VMI_User", "VMI_Admin"];
            }

            this.accountService.expand = "administration";
            this.accountService.getAccounts(this.searchText, this.pagination, this.sort, roles).then(
                (accountCollection: AccountCollectionModel) => { this.getAccountsCompleted(accountCollection); },
                (error: any) => { this.getAccountsFailed(error); });
        }

        protected getAccountsCompleted(accountCollection: AccountCollectionModel): void {
            this.users = accountCollection.accounts;
            this.pagination = accountCollection.pagination;
        }

        protected getAccountsFailed(error: any): void {
            this.users = [];
            this.pagination = null;
        }

        openAddVmiUserPopup(editUser?: AccountModel): void {
            this.addVmiUserPopupService.display(editUser);
        }

        clearSearch(): void {
            if (this.searchText || this.role) {
                this.searchText = "";
                this.role = "";
                this.search(this.sort, true);
            }
        }

        sortBy(sortKey: string): void {
            if (this.sort.indexOf(sortKey) >= 0) {
                sortKey = this.sort.indexOf("DESC") >= 0 ? sortKey : `${sortKey} DESC`;
            }

            this.search(sortKey, true);
        }

        protected restoreHistory(): void {
            const state = this.coreService.getHistoryState();
            if (state) {
                if (state.pagination) {
                    this.pagination = state.pagination;
                }
                if (state.searchText) {
                    this.searchText = state.searchText;
                }
                if (state.sort) {
                    this.sort = state.sort;
                }
            }
        }

        protected updateHistory(): void {
            this.coreService.replaceState({ "searchText": this.searchText, "pagination": this.pagination, "sort": this.sort });
        }
    }

    angular
        .module("insite")
        .controller("VmiUsersController", VmiUsersController);
}