import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import ContactUsFormState from "@insite/client-framework/Store/Components/ContactUsForm/ContactUsFormState";
import { Draft } from "immer";

const initialState: ContactUsFormState = {
    fieldValues: {},
};

const reducer = {
    "Components/ContactUsForm/ClearForm": (draft: Draft<ContactUsFormState>) => {
        draft.fieldValues = {};
    },
    "Components/ContactUsForm/SetFieldValue": (
        draft: Draft<ContactUsFormState>,
        action: { key: string; value: string },
    ) => {
        draft.fieldValues[action.key] = action.value;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
