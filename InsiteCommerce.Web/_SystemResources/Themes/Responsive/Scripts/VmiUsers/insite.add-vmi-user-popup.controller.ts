module insite.vmiUsers {
    "use strict";

    import AccountModel = Insite.Account.WebApi.V1.ApiModels.AccountModel;
    import VmiLocationModel = Insite.Catalog.WebApi.V1.ApiModels.VmiLocationModel;
    import VmiUserModel = Insite.Account.WebApi.V1.ApiModels.VmiUserModel;
    import ISearchFilter = insite.catalog.ISearchFilter;

    export class AddVmiUserPopupController {
        isEditUserModal: boolean;
        vmiUserForm: any;
        userSearchText: string;
        userOptions: any;
        userOptionsPlaceholder: string;
        totalUsersCount: number;
        user: AccountModel;
        role: string;
        errorMessage: string;
        vmiLocationSearchText: string;
        vmiLocations: VmiLocationModel[];
        vmiLocationsPagination: PaginationModel;
        checkStorage: {} = {};
        isPopupOpened = false;

        static $inject = [
            "$scope",
            "$rootScope",
            "coreService",
            "$timeout",
            "addVmiUserPopupService",
            "spinnerService",
            "accountService",
            "vmiLocationsService",
            "removeVmiUserPopupService",
            "importVmiUserPopupService"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected coreService: core.ICoreService,
            protected $timeout: ng.ITimeoutService,
            protected addVmiUserPopupService: IAddVmiUserPopupService,
            protected spinnerService: core.ISpinnerService,
            protected accountService: account.IAccountService,
            protected vmiLocationsService: catalog.IVmiLocationsService,
            protected removeVmiUserPopupService: IRemoveVmiUserPopupService,
            protected importVmiUserPopupService: IImportVmiUserPopupService) {
        }

        $onInit(): void {
            this.vmiLocationsPagination = {"page": 1, "sortType": "name"} as PaginationModel;
            this.initVmiUserPopupEvents();
            this.role = this.role || "VMI_User";
        }

        protected closeModal(): void {
            this.coreService.closeModal("#popup-add-vmi-user");
            this.isPopupOpened = false;
            this.resetPopup();
        }

        protected resetPopup(): void {
            this.checkStorage = {};
            this.user = null;
            this.role = "VMI_User";
            this.userSearchText = "";
            this.vmiLocationSearchText = "";
            this.errorMessage = "";
            this.vmiLocations = [];
            this.vmiUserForm.$setPristine();
        }

        protected initVmiUserPopupEvents(): void {
            const popup = angular.element("#popup-add-vmi-user");
            this.addVmiUserPopupService.registerDisplayFunction((editUser?: AccountModel) => {
                this.isPopupOpened = true;
                this.user = editUser || this.user;
                this.isEditUserModal = !!editUser;
                this.coreService.displayModal(popup, () => {
                    this.resetPopup();
                });
                this.searchVmiLocation();
                editUser && this.selectUser(editUser);
                !editUser && this.initVmiUserAutocompletes();
            });
        }

        initVmiUserAutocompletes(): void {
            this.userOptions = {
                "dataSource": new kendo.data.DataSource({
                    "serverFiltering": true,
                    "serverPaging": true,
                    "transport": {
                        "read": (options: kendo.data.DataSourceTransportReadOptions) => {
                            this.onUserAutocompleteRead(options);
                        }
                    }
                }),
                "select": (event: kendo.ui.AutoCompleteSelectEvent) => {
                    this.onUserAutocompleteSelect(event);
                },
                "minLength": 0,
                "dataTextField": "userName",
                "dataValueField": "id",
                "placeholder": this.userOptionsPlaceholder
            };

            this.userOptions.dataSource.read();
        }

        protected onUserAutocompleteRead(options: kendo.data.DataSourceTransportReadOptions): void {
            this.spinnerService.show();
            const pagination = {"page": 1, "pageSize": 20} as PaginationModel;
            const excludeRoles = ["VMI_User", "VMI_Admin"];
            this.accountService.expand = "administration";
            this.accountService.getAccounts(this.userSearchText, pagination, "UserName", null, null, excludeRoles).then(
                (accountCollection: AccountCollectionModel) => {
                    this.getAccountsCompleted(options, accountCollection);
                },
                (error: any) => {
                    this.getAccountsFailed(error);
                });
        }

        protected getAccountsCompleted(options: kendo.data.DataSourceTransportReadOptions, accountCollection: AccountCollectionModel): void {
            const users = accountCollection.accounts;
            this.totalUsersCount = accountCollection.pagination.totalItemCount;
            if (users && users.length === 1 && !this.userSearchText) {
                this.userSearchText = users[0].userName;
                this.user = users[0];
            }

            // need to wrap this in setTimeout for prevent double scroll
            this.$timeout(() => {
                options.success(users);
            }, 0);
        }

        protected getAccountsFailed(error: any): void {
        }

        protected onUserAutocompleteSelect(event: kendo.ui.AutoCompleteSelectEvent): void {
            if (event.item == null) {
                return;
            }

            this.user = event.sender.dataItem(event.item.index());
            this.selectUser(this.user);
        }

        protected selectUser(user: AccountModel): void {
            this.role = user.vmiRole === "VMI_Admin" ? "VMI_Admin" : "VMI_User";
            this.checkStorage = [];
            const filter: ISearchFilter = {
                page: 1,
                pageSize: 10000,
                userId: user.id
            }
            this.vmiLocationsService.getVmiLocations(filter).then(
                (locationCollection: VmiLocationCollectionModel) => {
                    this.getUserLocationsCompleted(locationCollection);
                },
                (error: any) => {
                    this.getUserLocationsFailed(error);
                });
        }

        protected getUserLocationsCompleted(locationCollection: VmiLocationCollectionModel): void {
            locationCollection.vmiLocations.forEach(vmiLocation => {
                this.checkStorage[vmiLocation.id.toString()] = true;
            });
        }

        protected getUserLocationsFailed(error: any): void {
        }

        openAutocomplete($event: ng.IAngularEvent, selector: string): void {
            const autoCompleteElement = angular.element(selector) as any;
            const kendoAutoComplete = autoCompleteElement.data("kendoAutoComplete");
            kendoAutoComplete.popup.open();
        }

        searchVmiLocation(): void {
            if (this.vmiLocationsPagination) {
                this.vmiLocationsPagination.page = 1;
            }

            this.getLocations();
        }

        getLocations(): void {
            const filter: ISearchFilter = {
                filter: this.vmiLocationSearchText,
                page: this.vmiLocationsPagination?.page,
                pageSize: this.vmiLocationsPagination?.pageSize,
                sort: this.vmiLocationsPagination?.sortType
            }
            this.vmiLocationsService.getVmiLocations(filter).then(
                (locationCollection: VmiLocationCollectionModel) => {
                    this.getLocationsCompleted(locationCollection);
                },
                (error: any) => {
                    this.getLocationsFailed(error);
                });
        }

        protected getLocationsCompleted(locationCollection: VmiLocationCollectionModel): void {
            this.vmiLocations = locationCollection.vmiLocations;
            this.vmiLocationsPagination = locationCollection.pagination;
        }

        protected getLocationsFailed(error: any): void {
        }

        changeSort(sort: string): void {
            if (this.vmiLocationsPagination.sortType === sort && this.vmiLocationsPagination.sortType.indexOf(" DESC") < 0) {
                this.vmiLocationsPagination.sortType = sort.split(",").map(o => `${o} DESC`).join(",");
            } else {
                this.vmiLocationsPagination.sortType = sort;
            }

            this.searchVmiLocation();
        }

        selectAll(): void {
            const isAllSelected = this.isAllSelected();
            this.vmiLocations.forEach(vmiLocation => {
                if (isAllSelected) {
                    delete this.checkStorage[vmiLocation.id.toString()];
                } else {
                    this.checkStorage[vmiLocation.id.toString()] = true;
                }
            });
        }

        isAllSelected(): boolean {
            return this.vmiLocations && this.vmiLocations.every(o => this.checkStorage[o.id.toString()]);
        }

        checkVmiLocation(vmiLocationId: System.Guid): void {
            if (this.checkStorage[vmiLocationId.toString()]) {
                delete this.checkStorage[vmiLocationId.toString()];
            } else {
                this.checkStorage[vmiLocationId.toString()] = true;
            }
        }

        isVmiLocationChecked(vmiLocationId: System.Guid): boolean {
            return !!this.checkStorage[vmiLocationId.toString()];
        }

        validForm(): boolean {
            this.errorMessage = "";

            return this.vmiUserForm.$valid;
        }

        submitForm(): void {
            this.vmiUserForm.$setSubmitted();
            if (!this.validForm()) {
                return;
            }

            this.updateVmiUser();
        }

        updateVmiUser(): void {
            const selectedIds = Object.keys(this.checkStorage);
            const vmiUser = {
                "userId": this.user.id,
                "role": this.role,
                "vmiLocationIds": selectedIds,
                "removeVmiPermissions": false,
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
            if (error && error.message) {
                this.errorMessage = error.message;
            }
        }

        openRemoveVmiUserPopup(): void {
            this.removeVmiUserPopupService.display(this.user.id);
        }

        openImportVmiUserPopup(): void {
            this.importVmiUserPopupService.display(null);
        }
    }

    export interface IAddVmiUserPopupService {
        display(editedUser?: AccountModel): void;

        registerDisplayFunction(p: (editedUser?: AccountModel) => void);
    }

    export class AddVmiUserPopupService extends base.BasePopupService<any> implements IAddVmiUserPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-add-vmi-user-popup></isc-add-vmi-user-popup>";
        }
    }

    angular
        .module("insite")
        .controller("AddVmiUserPopupController", AddVmiUserPopupController)
        .service("addVmiUserPopupService", AddVmiUserPopupService)
        .directive("iscAddVmiUserPopup", () => ({
            "restrict": "E",
            "replace": true,
            "templateUrl": "/PartialViews/VmiUsers-AddVmiUserPopup",
            "controller": "AddVmiUserPopupController",
            "controllerAs": "vm",
            "bindToController": true
        }));
}