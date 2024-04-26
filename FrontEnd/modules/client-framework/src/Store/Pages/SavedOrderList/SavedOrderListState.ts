import { GetCartsApiParameter } from "@insite/client-framework/Services/CartService";

export default interface SavedOrderListState {
    getCartsApiParameter: GetCartsApiParameter;
    isFilterOpen: boolean;
}
