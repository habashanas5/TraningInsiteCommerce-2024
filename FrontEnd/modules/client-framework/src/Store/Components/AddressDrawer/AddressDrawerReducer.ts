import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import AddressDrawerState from "@insite/client-framework/Store/Components/AddressDrawer/AddressDrawerState";
import { BillToModel, ShipToModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: AddressDrawerState = {
    isOpen: false,
    navDrawerIsOpen: undefined,
    fulfillmentMethod: FulfillmentMethod.Ship,
    selectedBillTo: undefined,
    selectedShipTo: undefined,
    isDefault: false,
    isApplyingChanges: false,
    pickUpWarehouse: null,
};

const reducer = {
    "Components/AddressDrawer/SetIsOpen": (draft: Draft<AddressDrawerState>, action: { isOpen: boolean }) => {
        draft.isOpen = action.isOpen;
    },
    "Components/AddressDrawer/SetNavDrawerIsOpen": (
        draft: Draft<AddressDrawerState>,
        action: { navDrawerIsOpen?: boolean },
    ) => {
        draft.navDrawerIsOpen = action.navDrawerIsOpen;
    },
    "Components/AddressDrawer/ChangeFulfillmentMethod": (
        draft: Draft<AddressDrawerState>,
        action: { fulfillmentMethod: string },
    ) => {
        draft.fulfillmentMethod = action.fulfillmentMethod;
    },
    "Components/AddressDrawer/SelectBillTo": (
        draft: Draft<AddressDrawerState>,
        action: { billTo: BillToModel | undefined },
    ) => {
        draft.selectedBillTo = action.billTo;
    },
    "Components/AddressDrawer/SelectShipTo": (
        draft: Draft<AddressDrawerState>,
        action: { shipTo: ShipToModel | undefined },
    ) => {
        draft.selectedShipTo = action.shipTo;
    },
    "Components/AddressDrawer/SetAsDefault": (draft: Draft<AddressDrawerState>, action: { isDefault: boolean }) => {
        draft.isDefault = action.isDefault;
    },
    "Components/AddressDrawer/SetPickUpWarehouse": (
        draft: Draft<AddressDrawerState>,
        action: { pickUpWarehouse: WarehouseModel | null },
    ) => {
        draft.pickUpWarehouse = action.pickUpWarehouse;
    },
    "Components/AddressDrawer/BeginApplyChanges": (draft: Draft<AddressDrawerState>) => {
        draft.isApplyingChanges = true;
    },
    "Components/AddressDrawer/CompleteApplyChanges": (draft: Draft<AddressDrawerState>) => {
        draft.isApplyingChanges = false;
    },
    "CurrentPage/LoadPageComplete": (draft: Draft<AddressDrawerState>) => {
        draft.isOpen = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
