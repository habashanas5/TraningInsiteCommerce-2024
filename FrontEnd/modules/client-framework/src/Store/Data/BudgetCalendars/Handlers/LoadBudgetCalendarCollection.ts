import {
    ApiHandlerNoParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { getBudgetCalendarCollection } from "@insite/client-framework/Services/BudgetCalendarService";
import { BudgetCalendarCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerNoParameter<BudgetCalendarCollectionModel>;

export const DispatchBeginLoadBudgetCalendarCollection: HandlerType = props => {
    props.dispatch({
        type: "Data/Budget/BeginLoadBudgetCalendarCollection",
        parameter: props.parameter,
    });
};

export const GetBudgetCalendarCollection: HandlerType = async props => {
    props.apiResult = await getBudgetCalendarCollection();
};

export const DispatchCompleteLoadBudgetCalendarCollection: HandlerType = props => {
    props.dispatch({
        type: "Data/Budget/CompleteLoadBudgetCalendarCollection",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadBudgetCalendarCollection,
    GetBudgetCalendarCollection,
    DispatchCompleteLoadBudgetCalendarCollection,
];

const loadBudgetCalendarCollection = createHandlerChainRunnerOptionalParameter(
    chain,
    {},
    "loadBudgetCalendarCollection",
);
export default loadBudgetCalendarCollection;
