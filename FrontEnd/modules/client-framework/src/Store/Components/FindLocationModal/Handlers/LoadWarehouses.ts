import { ApiHandler, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";
import { getWarehouses, GetWarehousesApiParameter } from "@insite/client-framework/Services/WarehouseService";
import { WarehouseCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetWarehousesApiParameter, WarehouseCollectionModel>;

export const DispatchBeginLoadWarehouses: HandlerType = props => {
    props.dispatch({
        type: "Components/FindLocationModal/BeginLoadWarehouses",
        parameter: props.parameter,
    });
    props.dispatch({
        type: "Data/Warehouses/BeginLoadWarehouses",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getWarehouses(props.apiParameter);
};

export const DispatchCompleteLoadWarehouses: HandlerType = props => {
    props.dispatch({
        type: "Data/Warehouses/CompleteLoadWarehouses",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadWarehouses,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadWarehouses,
];

const loadWarehouses = createHandlerChainRunnerOptionalParameter(
    chain,
    {
        search: "",
        latitude: 0,
        longitude: 0,
        pageSize: 5,
    },
    "LoadWarehouses",
);
export default loadWarehouses;
