import isApiError from "@insite/client-framework/Common/isApiError";
import {
    ApiParameter,
    API_URL_CURRENT_FRAGMENT,
    del,
    doesNotHaveExpand,
    get,
    HasPagingParameters,
    patch,
    post,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import {
    BillToModel,
    CartCollectionModel,
    CartLineCollectionModel,
    CartLineModel,
    CartModel,
    CreditCardDto,
    PaginationModel,
    ProductSubscriptionDto,
    PromotionCollectionModel,
    PromotionModel,
    SectionOptionDto,
    ShipToModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetCartApiParameter extends ApiParameter {
    cartId: string;
    forceRecalculation?: boolean;
    allowInvalidAddress?: boolean;
    expand?: (
        | "tax"
        | "shipping"
        | "creditCardBillingAddress"
        | "paymentOptions"
        | "carriers"
        | "shipTos"
        | "validation"
        | "cartLines"
        | "alsoPurchased"
        | "restrictions"
        | "hiddenproducts"
        | "costCodes"
    )[];
    additionalExpands?: string[];
    alsoPurchasedMaxResults?: number;
}

export interface GetCartsApiParameter extends ApiParameter, HasPagingParameters {
    shipToId?: string;
    billToId?: string;
    status?: string;
    orderNumber?: string;
    fromDate?: string;
    toDate?: string;
    orderTotalOperator?: string;
    orderTotal?: string;
    orderSubtotalOperator?: string;
    orderSubtotal?: string;
    vmiLocationId?: string;
}

export interface UpdateCartApiParameter extends ApiParameter {
    cart: Cart;
}

export interface GetCartPromotionsApiParameter extends ApiParameter {
    cartId: string;
}

export interface AddCartLinesApiParameter extends ApiParameter {
    cartId: string;
    cartLineCollection: CartLineCollectionModel;
}

export interface AddWishListToCartApiParameter extends ApiParameter {
    wishListId: string;
    changedSharedListLinesQuantities?: { [key: string]: number };
}

export interface ClearCartApiParameter extends ApiParameter {
    cartId: string;
}

export interface UpdateCartLineApiParameter extends ApiParameter {
    cartId: string;
    cartLine: CartLineModel;
}

export interface RemoveCartLineApiParameter extends ApiParameter {
    cartId: string;
    cartLineId: string;
}

export interface AddProductApiParameter extends ApiParameter {
    productId: string;
    qtyOrdered: number;
    unitOfMeasure: string;
    notes?: string;
    sectionOptions?: Partial<SectionOptionDto>[];
    subscription?: ProductSubscriptionDto;
}

export interface AddCartPromotionApiParameter extends ApiParameter {
    cartId: string;
    promotionCode: string;
}

export interface GetPaymetricResponsePacketApiParameter extends ApiParameter {
    accessToken: string;
}

export interface PaymetricResponseApiResult {
    success: boolean;
    message: string;
    creditCard: CreditCardDto;
}

const cartsUrl = "/api/v1/carts";

export const invalidAddressException = "Insite.Core.Exceptions.InvalidAddressException";

export type Cart = Omit<CartModel, "billTo" | "shipTo"> & {
    billToId?: string;
    shipToId?: string;
    collectionShipToLabel?: string;
};

export type CartResult = {
    cart: Cart;
    billTo?: BillToModel;
    shipTo?: ShipToModel;
};

export type CartCollectionResult = {
    carts?: Cart[];
    pagination: PaginationModel | null;
};

export async function getCart(parameter: GetCartApiParameter) {
    const newParameter = { ...parameter };
    delete newParameter.cartId;
    const cartModel = await get<CartModel>(`${cartsUrl}/${parameter.cartId}`, newParameter);
    const cartResult = cleanCart(cartModel, parameter);
    return cartResult;
}

export async function getCarts(parameter: GetCartsApiParameter): Promise<ServiceResult<CartCollectionResult>> {
    try {
        const carts = await get<CartCollectionModel>(cartsUrl, parameter);
        return {
            successful: true,
            result: cleanCarts(carts),
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

function cleanCarts(cartCollection: CartCollectionModel): CartCollectionResult {
    const cartCollectionResult = {
        pagination: cartCollection.pagination,
        carts: [],
    } as CartCollectionResult;

    cartCollection.carts?.forEach(cart => {
        delete cart.cartLines;
        cartCollectionResult.carts!.push({
            ...cart,
            orderDate: cart.orderDate && new Date(cart.orderDate),
            collectionShipToLabel: cart.shipToLabel,
        });
    });

    return cartCollectionResult;
}

export async function updateCart(parameter: UpdateCartApiParameter) {
    const { cart } = parameter;
    const { billToId, shipToId } = cart;
    const patchModel: CartModel = {
        ...cart,
        billTo: billToId ? ({ id: billToId } as BillToModel) : null,
        shipTo: shipToId ? ({ id: shipToId } as ShipToModel) : null,
    };

    const cartModel = await patch<CartModel>(`${cartsUrl}/${patchModel.id}`, patchModel);
    const cartResult = cleanCart(cartModel, { expand: ["paymentOptions"] });
    return cartResult;
}

export async function updateCartWithResult(parameter: UpdateCartApiParameter): Promise<ServiceResult<CartResult>> {
    const { cart } = parameter;
    const { billToId, shipToId } = cart;
    const patchModel: CartModel = {
        ...cart,
        billTo: billToId ? ({ id: billToId } as BillToModel) : null,
        shipTo: shipToId ? ({ id: shipToId } as ShipToModel) : null,
    };
    try {
        const cartModel = await patch<CartModel>(`${cartsUrl}/${patchModel.id}`, patchModel);
        const cartResult = cleanCart(cartModel, { expand: ["paymentOptions"] });
        return {
            successful: true,
            result: cartResult,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

function cleanCart(cartModel: CartModel, parameter?: { expand?: string[]; additionalExpands?: string[] }) {
    cartModel.orderDate = cartModel.orderDate! && new Date(cartModel.orderDate!);
    cartModel.requestedPickupDateDisplay =
        cartModel.requestedPickupDateDisplay! && new Date(cartModel.requestedPickupDateDisplay!);
    cartModel.requestedDeliveryDateDisplay =
        cartModel.requestedDeliveryDateDisplay! && new Date(cartModel.requestedDeliveryDateDisplay!);

    if (doesNotHaveExpand(parameter, "cartLines")) {
        delete cartModel.cartLines;
    }
    if (doesNotHaveExpand(parameter, "paymentOptions")) {
        delete cartModel.paymentMethod;
        delete cartModel.paymentOptions;
    }
    if (doesNotHaveExpand(parameter, "carriers")) {
        delete cartModel.carriers;
    }
    if (doesNotHaveExpand(parameter, "validation")) {
        delete cartModel.billTo?.validation;
        delete cartModel.shipTo?.validation;
    }
    const cartResult = {
        cart: cartModel as Cart,
        billTo: cartModel.billTo ? cartModel.billTo : undefined,
        shipTo: cartModel.shipTo ? cartModel.shipTo : undefined,
    };

    if (cartModel.billTo) {
        cartResult.cart.billToId = cartModel.billTo.id;
        delete (cartResult.cart as CartModel).billTo;
    }

    if (cartModel.shipTo) {
        cartResult.cart.shipToId = cartModel.shipTo.id;
        delete (cartResult.cart as CartModel).shipTo;
    }

    return cartResult;
}

export async function getCartPromotions(parameter: GetCartPromotionsApiParameter) {
    const newParameter = { ...parameter };
    delete newParameter.cartId;
    const promotionCollection = await get<PromotionCollectionModel>(
        `${cartsUrl}/${parameter.cartId}/promotions`,
        newParameter,
    );

    if (promotionCollection.promotions) {
        addCartLineToId(promotionCollection.promotions);
    }

    return promotionCollection;
}

function addCartLineToId(promotions: PromotionModel[]) {
    promotions.forEach(promo => {
        if (promo.orderLineId) {
            promo.id = `${promo.id}:${promo.orderLineId}`;
        }
    });
}

export function addLineCollection(parameter: AddCartLinesApiParameter) {
    return post(`${cartsUrl}/${parameter.cartId}/cartlines/batch`, parameter.cartLineCollection);
}

export function addProduct(parameter: AddProductApiParameter) {
    const cartLine = {
        productId: parameter.productId,
        qtyOrdered: parameter.qtyOrdered,
        unitOfMeasure: parameter.unitOfMeasure,
        notes: parameter.notes,
        sectionOptions: parameter.sectionOptions,
    } as CartLineModel;

    if (parameter.subscription) {
        cartLine.properties = {
            productSubscription: JSON.stringify(parameter.subscription),
        };
    }

    return post(`${cartsUrl}/${API_URL_CURRENT_FRAGMENT}/cartlines`, cartLine);
}

export async function addProductWithResult(parameter: AddProductApiParameter): Promise<ServiceResult<CartLineModel>> {
    const cartLine = {
        productId: parameter.productId,
        qtyOrdered: parameter.qtyOrdered,
        unitOfMeasure: parameter.unitOfMeasure,
        notes: parameter.notes,
        sectionOptions: parameter.sectionOptions,
    } as CartLineModel;

    if (parameter.subscription) {
        cartLine.properties = {
            productSubscription: JSON.stringify(parameter.subscription),
        };
    }

    try {
        const cartLineModel = await post(`${cartsUrl}/${API_URL_CURRENT_FRAGMENT}/cartlines`, cartLine);
        return {
            successful: true,
            result: cartLineModel,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        if (error.status === 403) {
            return {
                successful: false,
                errorMessage: error.errorMessage,
                statusCode: 403,
            };
        }
        throw error;
    }
}

export function addWishListToCart(parameter: AddWishListToCartApiParameter) {
    const { wishListId, ...data } = { ...parameter };
    return post<CartLineCollectionModel>(
        `${cartsUrl}/${API_URL_CURRENT_FRAGMENT}/cartlines/wishlist/${wishListId}`,
        data as any,
    );
}

export function clearCart(parameter: ClearCartApiParameter) {
    return del(`${cartsUrl}/${parameter.cartId}`);
}

export function updateCartLine(parameter: UpdateCartLineApiParameter) {
    return patch(`${cartsUrl}/${parameter.cartId}/cartlines/${parameter.cartLine.id}`, parameter.cartLine);
}

export async function updateCartLineWithResult(
    parameter: UpdateCartLineApiParameter,
): Promise<ServiceResult<CartLineModel>> {
    try {
        const cartLineModel = await updateCartLine(parameter);
        return {
            successful: true,
            result: cartLineModel,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        if (error?.status === 404) {
            return {
                successful: false,
                errorMessage: error.errorMessage,
            };
        }
        throw error;
    }
}

export function removeCartLine(parameter: RemoveCartLineApiParameter) {
    return del(`${cartsUrl}/${parameter.cartId}/cartlines/${parameter.cartLineId}`);
}

export async function removeCartLineWithResult(parameter: RemoveCartLineApiParameter): Promise<ServiceResult<void>> {
    try {
        const result = await removeCartLine(parameter);
        return {
            successful: true,
            result,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        if (error?.status === 404) {
            return {
                successful: false,
                errorMessage: error.errorMessage,
            };
        }
        throw error;
    }
}

export async function addCartPromotion(
    parameter: AddCartPromotionApiParameter,
): Promise<ServiceResult<PromotionModel>> {
    try {
        const promotionModel = await post<PromotionModel>(`${cartsUrl}/${parameter.cartId}/promotions`, {
            promotionCode: parameter.promotionCode,
        } as PromotionModel);
        return {
            successful: true,
            result: promotionModel,
        };
    } catch (error) {
        if ("status" in error && error.status === 400 && error.errorJson && error.errorJson.message) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export function getPaymetricResponsePacket(parameter: GetPaymetricResponsePacketApiParameter) {
    return get<PaymetricResponseApiResult>("/api/v1/paymetric/responsepacket", parameter);
}
