import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { getBillTo, GetBillToApiParameter } from "@insite/client-framework/Services/CustomersService";
import { BillToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ billToId: string } & HasOnSuccess, GetBillToApiParameter, BillToModel>;

export const DispatchBeginLoadBillTo: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/BeginLoadBillTo",
        id: props.parameter.billToId,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        billToId: props.parameter.billToId,
        expand: ["validation", "shipTos"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getBillTo(props.apiParameter);
};

export const DispatchCompleteLoadOrder: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/CompleteLoadBillTo",
        model: props.apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => props.parameter.onSuccess?.();

export const chain = [
    DispatchBeginLoadBillTo,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadOrder,
    ExecuteOnSuccessCallback,
];

const loadBillTo = createHandlerChainRunner(chain, "LoadBillTo");
export default loadBillTo;
