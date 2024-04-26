import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";
import AddToListModalState from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalState";
import { Draft } from "immer";

const initialState: AddToListModalState = {
    isOpen: false,
    getWishListsParameter: {
        filter: "availableToAdd",
        pageSize: 100,
    },
};

const reducer = {
    "Components/AddToListModal/CompleteSetIsOpen": (
        draft: Draft<AddToListModalState>,
        action: {
            isOpen: boolean;
            productInfos?: Omit<ProductInfo, "productDetailPath">[];
        },
    ) => {
        if (!action.isOpen) {
            return initialState;
        }

        draft.isOpen = action.isOpen;
        draft.productInfos = action.productInfos;
    },
    "CurrentPage/LoadPageComplete": () => {
        return initialState;
    },
    "Components/AddToListModal/UpdateGetWishListsParameter": (
        draft: Draft<AddToListModalState>,
        action: { parameter: Partial<GetWishListsApiParameter> },
    ) => {
        draft.getWishListsParameter = action.parameter;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
