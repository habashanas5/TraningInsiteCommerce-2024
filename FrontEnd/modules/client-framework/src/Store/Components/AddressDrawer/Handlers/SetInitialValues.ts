import { createHandlerChainRunner, Handler, makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import changeFulfillmentMethod from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/ChangeFulfillmentMethod";
import changePickUpWarehouse from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/ChangePickUpWarehouse";
import selectBillTo from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SelectBillTo";
import selectShipTo from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SelectShipTo";
import setAsDefault from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SetAsDefault";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadCurrentBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadCurrentBillTo";
import loadCurrentShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTo";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";

type HandlerType = Handler;

export const SetFulfillmentMethod: HandlerType = ({ dispatch, getState }) => {
    const { fulfillmentMethod } = getSession(getState());
    dispatch(changeFulfillmentMethod({ fulfillmentMethod }));
};

export const LoadCurrentBillTo: HandlerType = async ({ dispatch, getState }) => {
    const { isAuthenticated, isGuest } = getSession(getState());
    if (!isAuthenticated || isGuest) {
        return;
    }

    const { billToId } = getSession(getState());
    let currentBillToState = getBillToState(getState(), billToId);
    if (!currentBillToState.value && !currentBillToState.isLoading) {
        await makeHandlerChainAwaitable(loadCurrentBillTo)({})(dispatch, getState);
        currentBillToState = getBillToState(getState(), billToId);
        if (!currentBillToState.value) {
            throw new Error("Could not load current billto.");
        }
    }

    dispatch(selectBillTo({ billTo: currentBillToState.value }));
};

export const LoadCurrentShipTo: HandlerType = async ({ dispatch, getState }) => {
    const { isAuthenticated, isGuest } = getSession(getState());
    if (!isAuthenticated || isGuest) {
        return;
    }

    const { shipToId } = getSession(getState());
    let currentShipToState = getShipToState(getState(), shipToId);
    if (!currentShipToState.value && !currentShipToState.isLoading && shipToId) {
        await makeHandlerChainAwaitable(loadCurrentShipTo)({})(dispatch, getState);
        currentShipToState = getShipToState(getState(), shipToId);
        if (!currentShipToState.value) {
            throw new Error("Could not load current shipto.");
        }
    }

    dispatch(selectShipTo({ shipTo: currentShipToState.value }));
};

export const SetIsDefault: HandlerType = ({ dispatch }) => {
    dispatch(setAsDefault({ isDefault: false }));
};

export const SetPickUpWarehouse: HandlerType = ({ dispatch, getState }) => {
    const { pickUpWarehouse } = getSession(getState());
    if (pickUpWarehouse) {
        dispatch(changePickUpWarehouse({ warehouse: pickUpWarehouse }));
    }
};

export const chain = [SetFulfillmentMethod, LoadCurrentBillTo, LoadCurrentShipTo, SetIsDefault, SetPickUpWarehouse];

const setInitialValues = createHandlerChainRunner(chain, "SetInitialValues");
export default setInitialValues;
