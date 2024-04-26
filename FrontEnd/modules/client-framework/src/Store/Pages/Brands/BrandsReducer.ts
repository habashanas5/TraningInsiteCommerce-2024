import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import BrandsState from "@insite/client-framework/Store/Pages/Brands/BrandsState";
import { BrandAlphabetLetterModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: BrandsState = {
    brandAlphabetState: {
        isLoading: false,
    },
};

const reducer = {
    "Pages/Brands/BeginLoadBrandAlphabet": (draft: Draft<BrandsState>) => {
        draft.brandAlphabetState = {
            isLoading: true,
        };
    },
    "Pages/Brands/CompleteLoadBrandAlphabet": (
        draft: Draft<BrandsState>,
        action: { result: BrandAlphabetLetterModel[] },
    ) => {
        draft.brandAlphabetState = {
            isLoading: false,
            value: action.result,
        };
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
