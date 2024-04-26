import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";

export const isSearchUserSelectDisabled = (state: ApplicationState) => {
    const billTo = getCurrentBillToState(state);
    return billTo.isLoading === false && billTo.value?.budgetEnforcementLevel === "Customer";
};

export const isShipToAddressSelectDisabled = (state: ApplicationState) => {
    const billTo = getCurrentBillToState(state);
    return billTo.isLoading === false && billTo.value?.budgetEnforcementLevel !== "ShipTo";
};
