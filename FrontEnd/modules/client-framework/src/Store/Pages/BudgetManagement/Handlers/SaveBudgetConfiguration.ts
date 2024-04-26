import {
    createHandlerChainRunner,
    Handler,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    updateBudgetCalendar,
    UpdateBudgetCalendarApiParameter,
} from "@insite/client-framework/Services/BudgetCalendarService";
import {
    updateEnforcementLevel,
    UpdateEnforcementLevelApiParameter,
} from "@insite/client-framework/Services/CustomersService";
import { BillToModel, BudgetCalendarModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<
    {
        updateEnforcementLevelApiParameter: UpdateEnforcementLevelApiParameter;
        updateBudgetCalendarApiParameter: UpdateBudgetCalendarApiParameter;
        onSuccess?: () => void;
    },
    {
        updateEnforcementLevelApiResult: BillToModel;
        updateBudgetCalendarApiResult: BudgetCalendarModel;
        hadError: boolean;
    }
>;

export const CallUpdateEnforcementLevelApi: HandlerType = async props => {
    props.updateEnforcementLevelApiResult = await updateEnforcementLevel(
        props.parameter.updateEnforcementLevelApiParameter,
    );
    props.hadError = !props.updateEnforcementLevelApiResult;
};

export const CallUpdateBudgetCalendarApi: HandlerType = async props => {
    if (!props.hadError) {
        props.updateBudgetCalendarApiResult = await updateBudgetCalendar(
            props.parameter.updateBudgetCalendarApiParameter,
        );
        props.hadError = !props.updateBudgetCalendarApiResult;
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.hadError) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.();
    }
};

export const DispatchCompleteUpdateBillTo: HandlerType = props => {
    props.dispatch({
        model: props.updateEnforcementLevelApiResult,
        type: "Data/BillTos/CompleteUpdateBillTo",
    });
};

export const DispatchCompleteSaveBudgetConfiguration: HandlerType = props => {
    props.dispatch({
        budgetCalendar: props.updateBudgetCalendarApiResult,
        type: "Pages/BudgetManagement/CompleteSaveBudgetConfiguration",
    });
};

export const chain = [
    CallUpdateEnforcementLevelApi,
    CallUpdateBudgetCalendarApi,
    ExecuteOnSuccessCallback,
    DispatchCompleteUpdateBillTo,
    DispatchCompleteSaveBudgetConfiguration,
];

const saveBudgetConfiguration = createHandlerChainRunner(chain, "saveBudgetConfiguration");
export default saveBudgetConfiguration;
