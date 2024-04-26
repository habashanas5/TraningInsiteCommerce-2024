import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";

type HandlerType = Handler<GetVmiLocationsApiParameter>;

export const DispatchUpdateLocationsSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiUsers/UpdateLocationsSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLocationsSearchFields];

const updateLocationsSearchFields = createHandlerChainRunner(chain, "UpdateLocationsSearchFields");
export default updateLocationsSearchFields;
