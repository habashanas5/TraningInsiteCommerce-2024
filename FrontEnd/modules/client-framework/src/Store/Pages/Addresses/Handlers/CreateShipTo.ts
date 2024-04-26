import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import {
    createShipTo as createShipToApi,
    CreateShipToApiParameter,
} from "@insite/client-framework/Services/CustomersService";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<CreateShipToApiParameter, ShipToModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const CreateShipTo: HandlerType = async props => {
    props.apiResult = await createShipToApi(props.apiParameter);
};

export const DispatchShipTosReset: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/ResetDataViews",
    });
};

export const chain = [PopulateApiParameter, CreateShipTo, DispatchShipTosReset];

const createShipTo = createHandlerChainRunner(chain, "CreateShipTo");
export default createShipTo;
