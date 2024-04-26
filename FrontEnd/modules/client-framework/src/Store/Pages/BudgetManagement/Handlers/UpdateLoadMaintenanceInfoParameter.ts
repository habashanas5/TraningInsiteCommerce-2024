import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetBudgetApiParameter } from "@insite/client-framework/Services/BudgetService";

type HandlerType = Handler<GetBudgetApiParameter>;

export const DispatchUpdateLoadMaintenanceInfoParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/BudgetManagement/UpdateLoadMaintenanceInfoParameter",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLoadMaintenanceInfoParameter];

const updateLoadMaintenanceInfoParameter = createHandlerChainRunner(chain, "updateLoadMaintenanceInfoParameter");
export default updateLoadMaintenanceInfoParameter;
