import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import { AddVmiBinApiParameter, createVmiBin } from "@insite/client-framework/Services/VmiBinsService";
import { VmiBinModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<AddVmiBinApiParameter, ServiceResult<VmiBinModel>>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await createVmiBin(props.apiParameter);
};

export const DispatchResetVmiBins: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiBins/Reset",
    });
};

export const chain = [PopulateApiParameter, RequestDataFromApi, DispatchResetVmiBins];

const addVmiBin = createHandlerChainRunner(chain, "AddVmiBin");
export default addVmiBin;
