import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";

export default interface ProductInfoListState {
    productInfoListById: SafeDictionary<{
        productInfoByProductId: SafeDictionary<ProductInfo>;
    }>;
    errorMessageById: SafeDictionary<string>;
}
