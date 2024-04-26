module insite.layout {
    "use strict";

    export class HeaderController {
        cart: CartModel;
        session: any;
        isVisibleSearchInput = false;
        accountSettings: AccountSettingsModel;

        static $inject = ["$scope", "$timeout", "cartService", "sessionService", "$window", "settingsService", "deliveryMethodPopupService", "$interval"];

        constructor(
            protected $scope: ng.IScope,
            protected $timeout: ng.ITimeoutService,
            protected cartService: cart.ICartService,
            protected sessionService: account.ISessionService,
            protected $window: ng.IWindowService,
            protected settingsService: core.ISettingsService,
            protected deliveryMethodPopupService: account.IDeliveryMethodPopupService,
            protected $interval: ng.IIntervalService) {
        }

        $onInit(): void {
            this.$scope.$on("cartLoaded", (event, cart) => {
                this.onCartLoaded(cart);
            });

            // use a short timeout to wait for anything else on the page to call to load the cart
            this.$timeout(() => {
                if (!this.cartService.cartLoadCalled) {
                    this.getCart();
                }
            }, 20);

            this.getSession();
            this.getSettings();

            // set min-width of the Search label
            angular.element(".header-b2c .header-zone.rt .sb-search").css("min-width", angular.element(".search-label").outerWidth());
            angular.element(".header-b2c .mega-nav .top-level-item").hover((event) => {
                const target = angular.element(event.target);
                if (target.hasClass("top-level-item")) {
                    target.addClass("hover");
                } else {
                    target.parents(".top-level-item").first().addClass("hover");
                }
            }, (event) => {
                const target = angular.element(event.target);
                if (target.hasClass("top-level-item")) {
                    target.removeClass("hover");
                } else {
                    target.parents(".top-level-item").first().removeClass("hover");
                }
            });

            angular.element(".header-b2c .mega-nav .sub-item").hover((event) => {
                const target = angular.element(event.target);
                if (target.hasClass("sub-item")) {
                    target.addClass("hover");
                } else {
                    target.parents(".sub-item").first().addClass("hover");
                }
            }, (event) => {
                const target = angular.element(event.target);
                if (target.hasClass("sub-item") && target.hasClass("hover")) {
                    target.removeClass("hover");
                } else {
                    target.parents(".sub-item.hover").first().removeClass("hover");
                }
            });
        }

        protected onCartLoaded(cart: CartModel): void {
            this.cart = cart;
        }

        protected getCart(): void {
            let times = 0;
            const interval = this.$interval(() => {
                ++times;
                if (this.cartService.getCartInProgress && times * 25 < 1000) {
                    return;
                }
                this.$interval.cancel(interval);
                this.cartService.getCart().then(
                    (cart: CartModel) => { this.getCartCompleted(cart); },
                    (error: any) => { this.getCartFailed(error); });
            }, 25);
        }

        protected getCartCompleted(cart: CartModel): void {
        }

        protected getCartFailed(error: any): void {
        }

        protected getSession(): void {
            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;
        }

        protected getSessionFailed(error: any): void {
        }

        protected getSettings(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.accountSettings = settingsCollection.accountSettings;
        }

        protected getSettingsFailed(error: any): void {
        }

        protected openSearchInput(): void {
            this.isVisibleSearchInput = true;
            this.$timeout(() => {
                angular.element(".sb-search input#isc-searchAutoComplete-b2c").focus();
            }, 500);
        }

        signOut(returnUrl: string): void {
            this.sessionService.signOut().then(
                (signOutResult: string) => { this.signOutCompleted(signOutResult, returnUrl); },
                (error: any) => { this.signOutFailed(error); });
        }

        protected signOutCompleted(signOutResult: string, returnUrl: string): void {
            this.$window.location.href = returnUrl;
        }

        protected signOutFailed(error: any): void {
        }

        hideB2CNav($event: any): void {
            const target = angular.element($event.target);
            if (target.hasClass("toggle-sub")) {

                // For tablets
                $event.preventDefault();
                target.mouseover();
            } else {
                target.mouseout();
            }
        }

        protected openDeliveryMethodPopup() {
            this.deliveryMethodPopupService.display({
                session: this.session
            });
        }
    }

    angular
        .module("insite")
        .controller("HeaderController", HeaderController);
}