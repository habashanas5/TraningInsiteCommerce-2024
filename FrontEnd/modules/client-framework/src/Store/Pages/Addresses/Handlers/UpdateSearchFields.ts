import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";

type HandlerType = Handler<GetShipTosApiParameter>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/Addresses/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateSearchFields = createHandlerChainRunner(chain, "UpdateSearchFields");
export default updateSearchFields;
