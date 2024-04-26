import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import CompareProductsDrawerState from "@insite/client-framework/Store/Components/CompareProductsDrawer/CompareProductsDrawerState";
import { Draft } from "immer";

const initialState: CompareProductsDrawerState = {
    isOpen: false,
    productsIds: [],
};

const reducer = {
    "Components/CompareProductsDrawer/SetIsOpen": (
        draft: Draft<CompareProductsDrawerState>,
        action: { isOpen: boolean },
    ) => {
        draft.isOpen = action.isOpen;
    },
    "Components/CompareProductsDrawer/SetProductIds": (
        draft: Draft<CompareProductsDrawerState>,
        action: { productIds: string[] },
    ) => {
        draft.productsIds = action.productIds;
    },
    "Components/CompareProductsDrawer/SetReturnUrl": (
        draft: Draft<CompareProductsDrawerState>,
        action: { returnUrl?: string },
    ) => {
        draft.returnUrl = action.returnUrl;
    },
    "CurrentPage/LoadPageComplete": (draft: Draft<CompareProductsDrawerState>) => {
        draft.isOpen = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
