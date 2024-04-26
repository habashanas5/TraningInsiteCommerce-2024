import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { GetDealersApiParameter } from "@insite/client-framework/Services/DealerService";
import { DealerCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<GetDealersApiParameter, DealerCollectionModel>;

export const DispatchBeginLoadDealers: HandlerType = props => {
    props.dispatch({
        type: "Pages/LocationFinder/BeginLoadDealers",
        parameter: props.parameter,
    });
};

export const chain = [DispatchBeginLoadDealers];

const setParameter = createHandlerChainRunnerOptionalParameter(
    chain,
    {
        name: "",
        latitude: 0,
        longitude: 0,
        pageSize: 5,
    },
    "LocationFinderSetParameter",
);
export default setParameter;
