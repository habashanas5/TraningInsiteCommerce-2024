﻿module insite.savedorders {
    "use strict";

    export class SavedOrderDetailController {
        cart: CartModel = null;
        canAddToCart = false;
        canAddAllToCart = false;
        showInventoryAvailability = false;
        requiresRealTimeInventory = false;
        failedToGetRealTimeInventory = false;
        canAddAllToList = false;
        validationMessage: string;
        listPageUri: string;
        session: SessionModel;
        cartUri: string;
        isAddressSet: boolean;
        useCustomerFrom = "session";

        static $inject = ["cartService", "coreService", "spinnerService", "settingsService", "queryString", "addToWishlistPopupService", "sessionService", "selectSavedOrderAddressPopupService", "$scope"];

        constructor(
            protected cartService: cart.ICartService,
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService,
            protected settingsService: core.ISettingsService,
            protected queryString: common.IQueryStringService,
            protected addToWishlistPopupService: wishlist.AddToWishlistPopupService,
            protected sessionService: account.ISessionService,
            protected selectSavedOrderAddressPopupService: SelectSavedOrderAddressPopupService,
            protected $scope: ng.IScope) {
        }

        $onInit(): void {
            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });

            if (!this.session) {
                this.sessionService.getSession().then(
                    (session: SessionModel) => { this.getSessionCompleted(session); },
                    (error: any) => { this.getSessionFailed(error); });
            }

            this.cartService.expand = "cartlines,costcodes,hiddenproducts,restrictions";
            this.cartService.getCart(this.queryString.get("cartid"), true).then(
                (cart: CartModel) => { this.getCartCompleted(cart); },
                (error: any) => { this.getCartFailed(error); });

            this.$scope.$on("savedOrderCustomerWasSet",
                (event, data) => {
                    this.useCustomerFrom = data.useCustomerFrom;
                    this.isAddressSet = true;
                    this.placeSavedOrder(this.cartUri);
                });
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.showInventoryAvailability = settingsCollection.productSettings.showInventoryAvailability;
            this.requiresRealTimeInventory = settingsCollection.productSettings.realTimeInventory;
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;
        }

        protected getSessionFailed(error: any): void {
        }

        protected getCartCompleted(cart: CartModel): void {
            this.cartService.expand = "";
            this.cart = cart;
            this.cart.showTaxAndShipping = false;
            this.canAddAllToList = this.cart.cartLines.every(l => l.canAddToWishlist && !l.isRestricted);
            this.canAddToCart = this.cart.cartLines.some(this.canAddCartLineToCart);
            this.canAddAllToCart = this.cart.cartLines.every(this.canAddCartLineToCart);
            this.getRealTimeInventory();
        }

        protected getCartFailed(error: any): void {
            this.cartService.expand = "";
            this.coreService.redirectToPath(this.listPageUri);
        }

        getRealTimeInventory(): void {
            if (this.requiresRealTimeInventory) {
                this.cartService.getRealTimeInventory(this.cart).then(
                    (realTimeInventory: RealTimeInventoryModel) => this.getRealTimeInventoryCompleted(realTimeInventory),
                    (error: any) => this.getRealTimeInventoryFailed(error));
            }
        }

        protected getRealTimeInventoryCompleted(realTimeInventory: RealTimeInventoryModel): void {
        }

        protected getRealTimeInventoryFailed(error: any): void {
            this.failedToGetRealTimeInventory = true;
        }

        addAllToList(): void {
            let products = [];
            for (let i = 0; i < this.cart.cartLines.length; i++) {
                const cartLine = this.cart.cartLines[i];
                if (!cartLine.canAddToWishlist) {
                    continue;
                }
                const product = <ProductDto>{
                    id: cartLine.productId,
                    qtyOrdered: cartLine.qtyOrdered,
                    selectedUnitOfMeasure: cartLine.unitOfMeasure
                };
                products.push(product);
            }

            this.addToWishlistPopupService.display(products);
        }

        placeSavedOrder(cartUri: string): void {
            const availableLines = this.cart.cartLines.filter(this.canAddCartLineToCart);
            if (availableLines.length <= 0) {
                return;
            }

            if (!this.isAddressSet && this.cart.shipTo.id !== this.session.shipTo.id) {
                this.cartUri = cartUri;
                this.selectSavedOrderAddressPopupService.display({ cart: this.cart, session: this.session });
                return;
            }

            this.spinnerService.show();
            this.cartService.addLineCollection(availableLines, true, false).then(
                (cartLineCollection: CartLineCollectionModel) => { this.addLineCollectionCompleted(cartLineCollection, cartUri); },
                (error: any) => { this.addLineCollectionFailed(error); });
        }

        protected addLineCollectionCompleted(cartLineCollection: CartLineCollectionModel, cartUri: string): void {
            const currentCart = this.cartService.getLoadedCurrentCart();
            if (!currentCart.notes) {
                currentCart.notes = this.cart.notes;
            }
            if (!currentCart.requestedDeliveryDate) {
                currentCart.requestedDeliveryDate = this.cart.requestedDeliveryDate;
            }
            if (!currentCart.poNumber) {
                currentCart.poNumber = this.cart.poNumber;
            }
            if (this.isAddressSet && this.useCustomerFrom === "order") {
                currentCart.shipTo = this.cart.shipTo;
            }

            this.cartService.updateCart(currentCart).then(
                (cart: CartModel) => { this.placeSavedOrderCompleted(cart, cartUri); },
                (error: any) => { this.placeSavedOrderFailed(error); });
        }

        protected addLineCollectionFailed(error: any): void {
        }

        protected placeSavedOrderCompleted(cart: CartModel, cartUri: string): void {
            this.deleteSavedOrder(cartUri);
        }

        protected placeSavedOrderFailed(error: any): void {
        }

        deleteSavedOrder(redirectUri: string): void {
            this.cartService.removeCart(this.cart).then(
                (cart: CartModel) => { this.deleteSavedOrderCompleted(cart, redirectUri); },
                (error: any) => { this.deleteSavedOrderFailed(error); });
        }

        protected deleteSavedOrderCompleted(cart: CartModel, redirectUri: string): void {
            if (this.isAddressSet) {
                this.coreService.redirectToPathAndRefreshPage(redirectUri);
                this.isAddressSet = false;
            } else {
                this.coreService.redirectToPath(redirectUri);
            }
        }

        protected deleteSavedOrderFailed(error: any): void {
        }

        canAddCartLineToCart(cartLine: CartLineModel): boolean {
            return cartLine.canAddToCart && !cartLine.isRestricted && !cartLine.isDiscontinued && ((cartLine.availability as any).messageType !== 2 || cartLine.canBackOrder);
        }
    }

    angular
        .module("insite")
        .controller("SavedOrderDetailController", SavedOrderDetailController);
}