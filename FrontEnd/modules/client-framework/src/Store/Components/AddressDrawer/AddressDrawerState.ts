import { BillToModel, ShipToModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";

export default interface AddressDrawerState {
    isOpen: boolean;
    navDrawerIsOpen?: boolean;
    fulfillmentMethod: string;
    selectedBillTo: BillToModel | undefined;
    selectedShipTo: ShipToModel | undefined;
    isDefault: boolean;
    pickUpWarehouse: WarehouseModel | null;
    isApplyingChanges: boolean;
}
