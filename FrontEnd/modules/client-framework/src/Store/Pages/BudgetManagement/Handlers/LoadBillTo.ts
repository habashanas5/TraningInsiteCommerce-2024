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
        id: API_URL_CURRENT_FRAGMENT,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        billToId: API_URL_CURRENT_FRAGMENT,
        expand: ["costCodes"],
    };
};

export const GetBillTo: HandlerType = async props => {
    props.apiResult = await getBillTo(props.apiParameter);
};

export const DispatchCompleteLoadBillTo: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/CompleteLoadBillTo",
        model: props.apiResult,
        isCurrent: true,
    });
};

export const chain = [DispatchBeginLoadBillTo, PopulateApiParameter, GetBillTo, DispatchCompleteLoadBillTo];

const loadBillTo = createHandlerChainRunnerOptionalParameter(chain, {}, "loadBillTo");
export default loadBillTo;
