import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetCartsApiParameter } from "@insite/client-framework/Services/CartService";
import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";

export default interface VmiLocationDetailsState {
    getVmiBinsParameter: GetVmiBinsApiParameter;
    getVmiOrdersParameter: GetCartsApiParameter;
    selectedVmiItems: SafeDictionary<SafeDictionary<boolean>>;
    isExportingVmiProducts: boolean;
    isExportingVmiOrders: boolean;
}
