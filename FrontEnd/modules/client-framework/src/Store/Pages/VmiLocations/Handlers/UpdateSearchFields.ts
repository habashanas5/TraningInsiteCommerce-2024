import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";

type HandlerType = Handler<GetVmiLocationsApiParameter>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocations/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateSearchFields = createHandlerChainRunner(chain, "UpdateSearchFields");
export default updateSearchFields;
