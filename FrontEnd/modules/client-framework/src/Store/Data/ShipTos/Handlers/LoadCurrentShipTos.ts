import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { getShipTos, GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { ShipToCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetShipTosApiParameter, ShipToCollectionModel>;

export const currentShipTosApiParameter: GetShipTosApiParameter = Object.freeze({
    billToId: API_URL_CURRENT_FRAGMENT,
    expand: ["validation"], // because we include validation, we have to specifically exclude createNew
    exclude: ["createNew"],
});

export const DispatchBeginLoadShipTos: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/BeginLoadShipTos",
        parameter: currentShipTosApiParameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...currentShipTosApiParameter };
};

export const GetShipTos: HandlerType = async props => {
    props.apiResult = await getShipTos(props.apiParameter);
};

export const DispatchCompleteLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/CompleteLoadShipTos",
        parameter: currentShipTosApiParameter,
        collection: props.apiResult,
    });
};

export const chain = [DispatchBeginLoadShipTos, PopulateApiParameter, GetShipTos, DispatchCompleteLoadCart];

const loadCurrentShipTos = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCurrentShipTos");
export default loadCurrentShipTos;
