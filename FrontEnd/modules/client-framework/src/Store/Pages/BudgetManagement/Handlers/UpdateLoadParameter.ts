import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetBudgetApiParameter } from "@insite/client-framework/Services/BudgetService";

type HandlerType = Handler<GetBudgetApiParameter>;

export const DispatchUpdateLoadParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/BudgetManagement/UpdateLoadParameter",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLoadParameter];

const updateLoadParameter = createHandlerChainRunner(chain, "updateLoadParameter");
export default updateLoadParameter;
