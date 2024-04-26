import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { AccountShipToModel, PaginationModel } from "@insite/client-framework/Types/ApiModels";

export interface AccountShipTosState {
    readonly dataViews: SafeDictionary<DataView>;
}

interface DataView {
    readonly isLoading: boolean;
    pagination: PaginationModel | null;
    value?: AccountShipToModel[];
}
