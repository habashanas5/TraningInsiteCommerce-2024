import { ApiParameter, request } from "@insite/client-framework/Services/ApiService";
import { ProductDto } from "@insite/client-framework/Types/ApiModels";

export interface BatchGetProductsApiParameter extends ApiParameter {
    extendedNames: string[];
}

const productsUrl = "/api/v1/products";

export function batchGetProducts(parameter: BatchGetProductsApiParameter) {
    return request<(ProductDto | null)[]>(
        `${productsUrl}/batchget`,
        "POST",
        { "Content-Type": "application/json" },
        JSON.stringify({ extendedNames: parameter.extendedNames }),
    );
}
