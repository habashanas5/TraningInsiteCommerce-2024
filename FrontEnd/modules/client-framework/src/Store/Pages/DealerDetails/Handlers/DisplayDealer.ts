import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
} from "@insite/client-framework/HandlerCreator";
import { GetDealerApiParameter } from "@insite/client-framework/Services/DealerService";
import { getDealerState } from "@insite/client-framework/Store/Data/Dealers/DealersSelectors";
import loadDealer from "@insite/client-framework/Store/Data/Dealers/Handlers/LoadDealer";
import { DealerModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        dealerId: string;
    } & HasOnError,
    GetDealerApiParameter,
    DealerModel
>;

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const dealerState = getDealerState(state, props.parameter.dealerId);
    if (!dealerState.value && !dealerState.isLoading) {
        props.apiParameter = { id: props.parameter.dealerId };
    }
};

export const DispatchSetDealerId: HandlerType = props => {
    props.dispatch({
        type: "Pages/SavedOrderDetails/SetDealerId",
        dealerId: props.parameter.dealerId,
    });
};

export const DispatchLoadDealerIfNeeded: HandlerType = props => {
    if (props.apiParameter) {
        props.dispatch(loadDealer(props.apiParameter));
    }
};

export const chain = [PopulateApiParameter, DispatchSetDealerId, DispatchLoadDealerIfNeeded];

const displayDealer = createHandlerChainRunner(chain, "DisplayDealer");
export default displayDealer;
