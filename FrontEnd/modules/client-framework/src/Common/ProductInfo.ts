import { ProductInventoryDto, ProductModel, ProductPriceDto } from "@insite/client-framework/Types/ApiModels";

export interface ProductInfo {
    productId: string;
    qtyOrdered: number;
    unitOfMeasure: string;
    pricing?: ProductPriceDto;
    inventory?: ProductInventoryDto;
    failedToLoadPricing?: true;
    failedToLoadInventory?: true;
    productDetailPath: string;
}

export function createFromProduct(product: ProductModel): ProductInfo {
    return {
        productId: product.id,
        qtyOrdered: Math.max(product.minimumOrderQty, 1),
        unitOfMeasure: product.unitOfMeasures?.find(o => o.isDefault)?.unitOfMeasure ?? "",
        productDetailPath: product.canonicalUrl,
    };
}
