import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { BudgetModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{ value?: BudgetModel }>;

export const DispatchUpdateMaintenanceInfo: HandlerType = props => {
    props.dispatch({
        type: "Pages/BudgetManagement/UpdateMaintenanceInfo",
        maintenanceInfo: props.parameter.value,
    });
};

export const chain = [DispatchUpdateMaintenanceInfo];

const updateMaintenanceInfo = createHandlerChainRunner(chain, "updateMaintenanceInfo");
export default updateMaintenanceInfo;
