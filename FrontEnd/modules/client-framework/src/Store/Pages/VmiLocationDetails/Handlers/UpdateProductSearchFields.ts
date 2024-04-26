import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";

type HandlerType = Handler<GetVmiBinsApiParameter>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/UpdateProductSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateProductSearchFields = createHandlerChainRunner(chain, "UpdateProductSearchFields");
export default updateProductSearchFields;
