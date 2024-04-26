import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import ReCaptchaState from "@insite/client-framework/Store/Components/ReCaptcha/ReCaptchaState";
import { Draft } from "immer";

const initialState: ReCaptchaState = {
    errorMessage: "",
};

const reducer = {
    "Components/ReCaptcha/SetErrorMessage": (draft: Draft<ReCaptchaState>, action: { errorMessage: string }) => {
        draft.errorMessage = action.errorMessage;
    },
    "Components/ReCaptcha/Reset": (draft: Draft<ReCaptchaState>) => {
        return { ...initialState };
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
