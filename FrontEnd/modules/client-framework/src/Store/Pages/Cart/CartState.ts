import { Dictionary } from "@insite/client-framework/Common/Types";

export default interface CartState {
    isClearingCart: boolean;
    isSavingOrder: boolean;
    isRemovingCartLine: Dictionary<boolean>;
    isUpdatingCartLine: boolean;
}
