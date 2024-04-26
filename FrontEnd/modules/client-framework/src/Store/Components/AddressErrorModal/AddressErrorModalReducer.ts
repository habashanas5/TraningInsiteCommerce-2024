import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import AddressErrorModalState from "@insite/client-framework/Store/Components/AddressErrorModal/AddressErrorModalState";
import { Draft } from "immer";

const initialState: AddressErrorModalState = {
    isOpen: false,
};

const reducer = {
    "Components/AddressErrorModal/SetIsOpen": (
        draft: Draft<AddressErrorModalState>,
        action: {
            isOpen: boolean;
        },
    ) => {
        draft.isOpen = action.isOpen;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
