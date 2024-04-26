import { Cart } from "@insite/client-framework/Services/CartService";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";

export interface CartsState extends DataViewState<Cart> {
    readonly currentId?: string;
    readonly cartLoadedTime?: number;
}
