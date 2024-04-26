import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { getShipTos, GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { ShipToCollectionModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {},
    GetShipTosApiParameter,
    ShipToCollectionModel,
    {
        newShipTo?: ShipToModel;
        dataViewParameter: GetShipTosApiParameter;
    }
>;

export const DispatchBeginLoadShipTos: HandlerType = props => {
    props.dataViewParameter = props.getState().pages.addresses.getShipTosParameter;
    props.dispatch({
        type: "Data/ShipTos/BeginLoadShipTos",
        parameter: props.dataViewParameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.dataViewParameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getShipTos(props.apiParameter);
};

export const CleanupData: HandlerType = props => {
    const newShipTo = props.apiResult.shipTos!.find(o => o.isNew);
    props.apiResult.shipTos = props.apiResult.shipTos!.filter(o => !o.isNew);
    props.newShipTo = newShipTo;
};

export const DispatchSetNewShipTo: HandlerType = props => {
    props.dispatch({
        type: "Pages/Addresses/SetNewShipTo",
        newShipTo: props.newShipTo,
    });
};

export const DispatchCompleteLoadShipTos: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/CompleteLoadShipTos",
        collection: props.apiResult,
        parameter: props.dataViewParameter,
    });
};

export const chain = [
    DispatchBeginLoadShipTos,
    PopulateApiParameter,
    RequestDataFromApi,
    CleanupData,
    DispatchSetNewShipTo,
    DispatchCompleteLoadShipTos,
];

const loadShipTos = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadShipTos");
export default loadShipTos;
