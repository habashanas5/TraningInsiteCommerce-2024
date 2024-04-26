import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getDealer, GetDealerApiParameter } from "@insite/client-framework/Services/DealerService";
import { DealerModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetDealerApiParameter, DealerModel>;

export const DispatchBeginLoadDealers: HandlerType = props => {
    props.dispatch({
        type: "Data/Dealers/BeginLoadDealer",
        id: props.parameter.id,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getDealer(props.apiParameter);
};

export const DispatchCompleteLoadDealers: HandlerType = props => {
    props.dispatch({
        type: "Data/Dealers/CompleteLoadDealer",
        model: props.apiResult,
    });
};

export const chain = [DispatchBeginLoadDealers, PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadDealers];

const loadDealer = createHandlerChainRunner(chain, "LoadDealer");
export default loadDealer;
