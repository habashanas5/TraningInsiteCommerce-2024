import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import { updateVmiLocation, UpdateVmiLocationApiParameter } from "@insite/client-framework/Services/VmiLocationService";
import { VmiLocationModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<UpdateVmiLocationApiParameter, ServiceResult<VmiLocationModel>>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await updateVmiLocation(props.apiParameter);
};

export const DispatchResetVmiLocations: HandlerType = props => {
    if (props.apiResult.successful) {
        props.dispatch({
            type: "Data/VmiLocations/Reset",
        });
    }
};

export const chain = [PopulateApiParameter, RequestDataFromApi, DispatchResetVmiLocations];

const editVmiLocation = createHandlerChainRunner(chain, "EditVmiLocation");
export default editVmiLocation;
