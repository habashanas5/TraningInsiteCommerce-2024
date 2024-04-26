import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { getBillTo, GetBillToApiParameter } from "@insite/client-framework/Services/CustomersService";
import { BillToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetBillToApiParameter, BillToModel>;

export const DispatchBeginLoadBillTo: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/BeginLoadBillTo",
        id: "current",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        billToId: API_URL_CURRENT_FRAGMENT,
        expand: ["accountsReceivable", "validation"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getBillTo(props.apiParameter);
};

export const DispatchCompleteLoadBillTo: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/CompleteLoadBillTo",
        model: props.apiResult,
        isCurrent: true,
    });
};

export const chain = [DispatchBeginLoadBillTo, PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadBillTo];

const loadAccountsReceivable = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadAccountsReceivable");
export default loadAccountsReceivable;
