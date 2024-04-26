import { BrandAlphabetLetterModel } from "@insite/client-framework/Types/ApiModels";
import LoadedState from "@insite/client-framework/Types/LoadedState";

export default interface BrandsState {
    brandAlphabetState: LoadedState<BrandAlphabetLetterModel[]>;
}
