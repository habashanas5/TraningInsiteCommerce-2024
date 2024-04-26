import { DataView, DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

export interface WishListsDataView extends DataView {}

export interface WishListsState extends DataViewState<WishListModel, WishListsDataView> {}
