import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import ShareListModalState from "@insite/client-framework/Store/Components/ShareListModal/ShareListModalState";
import { Draft } from "immer";

const initialState: ShareListModalState = {
    isOpen: false,
    fromManage: false,
};

const reducer = {
    "Components/ShareListModal/CompleteSetIsOpen": (
        draft: Draft<ShareListModalState>,
        action: {
            isOpen: boolean;
            wishListId?: string;
            fromManage: boolean;
        },
    ) => {
        draft.isOpen = action.isOpen;
        if (action.isOpen) {
            draft.wishListId = action.wishListId;
            draft.fromManage = action.fromManage;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
