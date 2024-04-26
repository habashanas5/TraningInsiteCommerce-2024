import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import { AddVmiLocationApiParameter, createVmiLocation } from "@insite/client-framework/Services/VmiLocationService";
import { VmiLocationModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<AddVmiLocationApiParameter, ServiceResult<VmiLocationModel>>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await createVmiLocation(props.apiParameter);
};

export const DispatchResetVmiLocations: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiLocations/Reset",
    });
};

export const chain = [PopulateApiParameter, RequestDataFromApi, DispatchResetVmiLocations];

const addVmiLocation = createHandlerChainRunner(chain, "AddVmiLocation");
export default addVmiLocation;
