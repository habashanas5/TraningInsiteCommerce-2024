import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ExternalProviderLinkModel } from "@insite/client-framework/Services/IdentityService";
import SignInState from "@insite/client-framework/Store/Pages/SignIn/SignInState";
import { Draft } from "immer";

const initialState: SignInState = {
    isSigningInAsGuest: false,
};

const reducer = {
    "Pages/SignIn/BeginSignInAsGuest": (draft: Draft<SignInState>) => {
        draft.isSigningInAsGuest = true;
    },
    "Pages/SignIn/CompleteSignInAsGuest": (draft: Draft<SignInState>) => {
        draft.isSigningInAsGuest = false;
    },
    "Pages/SignIn/CompleteLoadExternalProviders": (
        draft: Draft<SignInState>,
        action: { externalProviders?: ExternalProviderLinkModel[] },
    ) => {
        draft.externalProviders = action.externalProviders;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
