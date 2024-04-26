export default interface CheckoutReviewAndSubmitState {
    cartId?: string;
    isPlacingOrder: boolean;
    isApplyingPromotion: boolean;
    promotionSuccessMessage?: string;
    promotionErrorMessage?: string;
    isCheckingOutWithPayPay: boolean;
    payPalRedirectUri?: string;
    requestedDeliveryDate?: Date | null;
    requestedPickupDate?: Date | null;
    placeOrderErrorMessage?: string;
    isPreloadingData: boolean;
}
