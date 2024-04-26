import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetPagesByParentApiParameter } from "@insite/client-framework/Services/ContentService";

type HandlerType = Handler<GetPagesByParentApiParameter>;

export const DispatchUpdateLoadParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/NewsList/UpdateLoadParameter",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLoadParameter];

const updateLoadParameter = createHandlerChainRunner(chain, "UpdateLoadParameter");
export default updateLoadParameter;
