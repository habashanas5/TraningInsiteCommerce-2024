import KeyValuePair = System.Collections.Generic.KeyValuePair;

module insite.order {
    "use strict";
    
    export class OrderListController {
        orderHistory: OrderCollectionModel;
        selectedIds = {};
        isAllSelected = false;
        pagination: PaginationModel;
        paginationStorageKey = "DefaultPagination-OrderList";
        searchFilter: OrderSearchFilter = {
            customerSequence: "-1",
            sort: "OrderDate DESC,ErpOrderNumber DESC,WebOrderNumber DESC",
            toDate: "",
            fromDate: "",
            expand: "",
            ponumber: "",
            ordernumber: "",
            search: "",
            ordertotaloperator: "",
            ordertotal: "",
            status: [],
            statusDisplay: "",
            productErpNumber: "",
            vmiOrdersOnly: false,
            vmiLocationId: ""
        };
        appliedSearchFilter = new OrderSearchFilter();
        shipTos: ShipToModel[];
        vmiLocations: VmiLocationModel[];
        validationMessage: string;
        orderStatusMappings: KeyValuePair<string, string[]>;
        settings: Insite.Order.WebApi.V1.ApiModels.OrderSettingsModel;
        autocompleteOptions: AutoCompleteOptions;
        Papa: any;
        isVmiOrdersPage: boolean;
        orderDetailsPageUrl : string;
        exportHeaders: {};
        
        static $inject = ["orderService", "customerService", "coreService", "paginationService", "settingsService", "searchService", "vmiLocationsService", "spinnerService", "$scope", "$filter"];

        constructor(
            protected orderService: order.IOrderService,
            protected customerService: customers.ICustomerService,
            protected coreService: core.ICoreService,
            protected paginationService: core.IPaginationService,
            protected settingsService: core.ISettingsService,
            protected searchService: catalog.ISearchService,
            protected vmiLocationsService : catalog.IVmiLocationsService,
            protected spinnerService: core.ISpinnerService,
			protected $scope: ng.IScope,
            protected $filter: ng.IFilterService) {
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
            
            this.$scope.$watch(() => this.isVmiOrdersPage, () => {
                if(this.isVmiOrdersPage) {
                    this.searchFilter.vmiOrdersOnly = true;
                    const vmiLocationsFilter: insite.catalog.ISearchFilter = {
                        page: 1,
                        pageSize: 9999
                    };
                    this.vmiLocationsService.getVmiLocations(vmiLocationsFilter).then(
                        (locationCollection: VmiLocationCollectionModel) => { this.getLocationsCompleted(locationCollection); },
                        (error: any) => { this.getLocationsFailed(error); });
                }

                this.settingsService.getSettings().then(
                    (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                    (error: any) => { this.getSettingsFailed(error); });

                this.customerService.getShipTos().then(
                    (shipToCollection: ShipToCollectionModel) => { this.getShipTosCompleted(shipToCollection); },
                    (error: any) => { this.getShipTosFailed(error); });

                this.orderService.getOrderStatusMappings().then(
                    (orderStatusMappingCollection: OrderStatusMappingCollectionModel) => { this.getOrderStatusMappingCompleted(orderStatusMappingCollection); },
                    (error: any) => { this.getOrderStatusMappingFailed(error); });                
            });

            this.initializeAutocomplete();
        }
                
        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.settings = settingsCollection.orderSettings;
            this.initFromDate(settingsCollection.orderSettings.lookBackDays);
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getShipTosCompleted(shipToCollection: ShipToCollectionModel): void {
            this.shipTos = shipToCollection.shipTos;
        }

        protected getShipTosFailed(error: any): void {
        }

        protected getOrderStatusMappingCompleted(orderStatusMappingCollection: OrderStatusMappingCollectionModel): void {
            this.orderStatusMappings = ({} as KeyValuePair<string, string[]>);

            for (let i = 0; i < orderStatusMappingCollection.orderStatusMappings.length; i++) {
                const key = orderStatusMappingCollection.orderStatusMappings[i].displayName;
                if (!this.orderStatusMappings[key]) {
                    this.orderStatusMappings[key] = [];
                }

                this.orderStatusMappings[key].push(orderStatusMappingCollection.orderStatusMappings[i].erpOrderStatus);
            }
        }

        protected getOrderStatusMappingFailed(error: any): void {
        }

        protected getLocationsCompleted(locationCollection: VmiLocationCollectionModel): void {
            this.vmiLocations = locationCollection.vmiLocations;
        }

        protected getLocationsFailed(error: any): void {
        }

        protected initializeAutocomplete(): void {
            this.autocompleteOptions = this.searchService.getProductAutocompleteOptions(() => this.searchFilter.productErpNumber);

            this.autocompleteOptions.template = this.searchService.getProductAutocompleteTemplate(() => this.searchFilter.productErpNumber, "tst_ordersPage_autocomplete");

            this.autocompleteOptions.select = this.onAutocompleteOptionsSelect();
        }

        protected onAutocompleteOptionsSelect(): (event: kendo.ui.AutoCompleteSelectEvent) => void {
            return (event: kendo.ui.AutoCompleteSelectEvent) => {
                const dataItem = event.sender.dataItem(event.item.index());
                this.searchFilter.productErpNumber = dataItem.erpNumber;
                dataItem.value = dataItem.erpNumber;
            };
        }

        protected initFromDate(lookBackDays: number): void {
            this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);

            if (lookBackDays > 0) {
                const tzOffset = (new Date()).getTimezoneOffset() * 60000;
                const date = new Date(Date.now() - lookBackDays * 60 * 60 * 24 * 1000 - tzOffset);
                this.searchFilter.fromDate = date.toISOString().split("T")[0];
            }

            this.restoreHistory();
            this.prepareSearchFilter();
            this.getOrders();
        }

        clear(): void {
            this.pagination.page = 1;
            this.searchFilter.customerSequence = "-1";
            this.searchFilter.sort = "OrderDate DESC,ErpOrderNumber DESC,WebOrderNumber DESC";
            this.searchFilter.toDate = "";
            this.searchFilter.fromDate = "";
            this.searchFilter.ponumber = "";
            this.searchFilter.ordernumber = "";
            this.searchFilter.search = "";
            this.searchFilter.ordertotaloperator = "";
            this.searchFilter.ordertotal = "";
            this.searchFilter.status = [];
            this.searchFilter.statusDisplay = "";
            this.searchFilter.productErpNumber = "";
            this.searchFilter.vmiLocationId = "";
            
            this.prepareSearchFilter();
            this.getOrders();
        }

        changeSort(sort: string): void {
            if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                this.searchFilter.sort = sort.split(",").map(o => `${o} DESC`).join(",");
            } else {
                this.searchFilter.sort = sort;
            }

            this.getOrders();
        }

        search(): void {
            if (this.pagination) {
                this.pagination.page = 1;
            }
            
            this.selectedIds = {};
            this.isAllSelected = false;
            
            this.prepareSearchFilter();
            this.getOrders();
        }

        getOrders(): void {
            this.appliedSearchFilter.sort = this.searchFilter.sort;
            this.coreService.replaceState({ filter: this.appliedSearchFilter, pagination: this.pagination });

            delete this.appliedSearchFilter.statusDisplay;
            this.orderService.getOrders(this.appliedSearchFilter, this.pagination, true).then(
                (orderCollection: OrderCollectionModel) => { this.getOrdersCompleted(orderCollection); },
                (error: any) => { this.getOrdersFailed(error); });
        }

        protected getOrdersCompleted(orderCollection: OrderCollectionModel): void {
            this.orderHistory = orderCollection;
            this.pagination = orderCollection.pagination;
        }

        protected getOrdersFailed(error: any): void {
            this.validationMessage = error.exceptionMessage;
        }

        prepareSearchFilter(): void {
            for (let property in this.searchFilter) {
                if (this.searchFilter.hasOwnProperty(property)) {
                    if (this.searchFilter[property] === "") {
                        this.appliedSearchFilter[property] = null;
                    } else {
                        this.appliedSearchFilter[property] = this.searchFilter[property];
                    }
                }
            }

            if (this.appliedSearchFilter.statusDisplay && this.orderStatusMappings && this.orderStatusMappings[this.appliedSearchFilter.statusDisplay]) {
                this.appliedSearchFilter.status = this.orderStatusMappings[this.appliedSearchFilter.statusDisplay];
            }
        }

        protected restoreHistory(): void {
            const state = this.coreService.getHistoryState();
            if (state) {
                if (state.pagination) {
                    this.pagination = state.pagination;
                }

                if (state.filter) {
                    this.searchFilter = state.filter;
                    if (this.searchFilter.customerSequence === null) {
                        this.searchFilter.customerSequence = "-1";
                    }

                    if (this.searchFilter.statusDisplay === null) {
                        this.searchFilter.statusDisplay = "";
                    }
                }
            }
        }

        exportOrders(allOrders: boolean): void {
            this.spinnerService.show();
            if(!allOrders) {
                this.generateCsv(this.orderHistory.orders.filter(f => this.selectedIds.hasOwnProperty(f.id)));
                this.spinnerService.hide();
            } else {
                this.orderService.getOrders(this.appliedSearchFilter, { ...this.pagination, ...{ page: 1, pageSize: 9999 } } , true).then(
                    (orderCollection: OrderCollectionModel) => {
                        this.generateCsv(orderCollection.orders);
                        this.spinnerService.hide();
                    },
                    (error: any) => { this.spinnerService.hide(); });
            }
        }

        areNoneSelected(): boolean {
            return Object.keys(this.selectedIds).length === 0;
        }

        selectUnselectAll(selectAll: boolean): void {
            if(selectAll) {
                this.selectedIds = {};
                for (let x = 0; x < this.orderHistory.orders.length; x++) {
                    this.selectedIds[this.orderHistory.orders[x].id] = true;
                }
                this.isAllSelected = true;
            } else {
                this.selectedIds = {};
                this.isAllSelected = false;
            }
        }

        updateSelected($event, id): void {
            const checkbox = $event.target;
            if (checkbox.checked) {
                this.selectedIds[id] = true;
            } else {
                delete this.selectedIds[id];
            }
            this.isAllSelected = Object.keys(this.selectedIds).length === this.orderHistory.orders.length;
        }

        protected generateCsv(orders: OrderModel[]): void {
            if (!orders?.length) {
                return;
            }

            const data = orders.map(o => {
                const row = {};
                row[this.exportHeaders["date"]] = this.$filter("date")(o.orderDate, "shortDate");
                row[this.exportHeaders["orderNumber"]] = o.erpOrderNumber;
                row[this.exportHeaders["shipToPickUp"]] = o.stCompanyName;
                row[this.exportHeaders["status"]] = o.statusDisplay;
                if (this.settings.showWebOrderNumber) row[this.exportHeaders["webOrderNumber"]] = o.webOrderNumber;
                if (this.settings.showPoNumber) row[this.exportHeaders["poNumber"]] = o.customerPO;
                row[this.exportHeaders["total"]] = o.orderTotalDisplay;

                return row;
            });

            const csv = this.Papa.unparse(data);
            const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
            const now = new Date();
            const fileName = `VmiOrderHistory_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}.csv`;

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
        .controller("OrderListController", OrderListController);
}