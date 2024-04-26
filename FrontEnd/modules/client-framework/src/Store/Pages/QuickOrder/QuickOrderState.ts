import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";

export default interface QuickOrderState {
    productInfos: ProductInfo[];
    total: number;
}
