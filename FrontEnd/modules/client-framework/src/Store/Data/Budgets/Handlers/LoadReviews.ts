import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getBudget, GetBudgetApiParameter } from "@insite/client-framework/Services/BudgetService";
import { BudgetModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<GetBudgetApiParameter, GetBudgetApiParameter, BudgetModel>;

export const DispatchBeginLoadReviews: HandlerType = props => {
    props.dispatch({
        type: "Data/Budget/BeginLoadBudget",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getBudget(props.apiParameter);
    } catch (e) {
        props.apiResult = {} as BudgetModel;
    }
};

export const DispatchCompleteLoadReviews: HandlerType = props => {
    props.dispatch({
        model: props.apiResult,
        parameter: props.parameter,
        type: "Data/Budget/CompleteLoadBudget",
    });
};

export const chain = [DispatchBeginLoadReviews, PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadReviews];

const loadReviews = createHandlerChainRunner(chain, "loadReviews");
export default loadReviews;
