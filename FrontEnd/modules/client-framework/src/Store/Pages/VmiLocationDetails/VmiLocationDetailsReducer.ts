import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetCartsApiParameter } from "@insite/client-framework/Services/CartService";
import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import VmiLocationDetailsState from "@insite/client-framework/Store/Pages/VmiLocationDetails/VmiLocationDetailsState";
import { Draft } from "immer";

const initialState: VmiLocationDetailsState = {
    getVmiBinsParameter: {},
    getVmiOrdersParameter: {
        sort: "OrderDate DESC",
    },
    selectedVmiItems: {},
    isExportingVmiProducts: false,
    isExportingVmiOrders: false,
};

export const enum TableTabKeys {
    Products = "Products",
    Users = "Users",
    Orders = "Orders",
}

const reducer = {
    "Pages/VmiLocationDetails/UpdateProductSearchFields": (
        draft: Draft<VmiLocationDetailsState>,
        action: { parameter: GetVmiBinsApiParameter },
    ) => {
        draft.getVmiBinsParameter = { ...draft.getVmiBinsParameter, ...action.parameter };
    },
    "Pages/VmiLocationDetails/ToggleVmiItemCheck": (
        draft: Draft<VmiLocationDetailsState>,
        action: { ids: string[]; tabKey: TableTabKeys },
    ) => {
        if (!draft.selectedVmiItems[action.tabKey]) {
            draft.selectedVmiItems[action.tabKey] = {};
        }
        const selectedVmiItems = draft.selectedVmiItems[action.tabKey]!;
        for (const id of action.ids) {
            if (selectedVmiItems[id]) {
                delete selectedVmiItems[id];
            } else {
                selectedVmiItems[id] = true;
            }
        }
    },
    "Pages/VmiLocationDetails/ClearVmiItemChecks": (
        draft: Draft<VmiLocationDetailsState>,
        action: { tabKey: TableTabKeys },
    ) => {
        draft.selectedVmiItems[action.tabKey] = {};
    },
    "Pages/VmiLocationDetails/UpdateOrderSearchFields": (
        draft: Draft<VmiLocationDetailsState>,
        action: { parameter: GetCartsApiParameter },
    ) => {
        draft.getVmiOrdersParameter = { ...draft.getVmiOrdersParameter, ...action.parameter };
    },
    "Pages/VmiLocationDetails/BeginExportVmiProducts": (draft: Draft<VmiLocationDetailsState>) => {
        draft.isExportingVmiProducts = true;
    },
    "Pages/VmiLocationDetails/CompleteExportVmiProducts": (draft: Draft<VmiLocationDetailsState>) => {
        draft.isExportingVmiProducts = false;
    },
    "Pages/VmiLocationDetails/BeginExportVmiOrders": (draft: Draft<VmiLocationDetailsState>) => {
        draft.isExportingVmiOrders = true;
    },
    "Pages/VmiLocationDetails/CompleteExportVmiOrders": (draft: Draft<VmiLocationDetailsState>) => {
        draft.isExportingVmiOrders = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
