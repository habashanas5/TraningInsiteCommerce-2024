import { ApiHandler, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";
import { getDealers, GetDealersApiParameter } from "@insite/client-framework/Services/DealerService";
import { DealerCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetDealersApiParameter, DealerCollectionModel>;

export const DispatchBeginLoadDealers: HandlerType = props => {
    props.dispatch({
        type: "Data/Dealers/BeginLoadDealers",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getDealers(props.apiParameter);
};

export const DispatchCompleteLoadDealers: HandlerType = props => {
    props.dispatch({
        type: "Data/Dealers/CompleteLoadDealers",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [DispatchBeginLoadDealers, PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadDealers];

const loadDealers = createHandlerChainRunnerOptionalParameter(
    chain,
    {
        name: "",
        latitude: 0,
        longitude: 0,
        pageSize: 5,
    },
    "LoadDealers",
);
export default loadDealers;
