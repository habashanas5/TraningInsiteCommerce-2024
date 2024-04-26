import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";

export default interface AddressesState {
    newShipTo?: ShipToModel;
    getShipTosParameter: GetShipTosApiParameter;
}
