import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { getBillTo, GetBillToApiParameter } from "@insite/client-framework/Services/CustomersService";
import { BillToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetBillToApiParameter, BillToModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        billToId: API_URL_CURRENT_FRAGMENT,
        expand: ["validation"],
    };
};

export const DispatchBeginLoadBillTo: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/BeginLoadBillTo",
        id: API_URL_CURRENT_FRAGMENT,
    });
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

export const chain = [PopulateApiParameter, DispatchBeginLoadBillTo, GetBillTo, DispatchCompleteLoadBillTo];

const loadCurrentBillTo = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCurrentBillTo");
export default loadCurrentBillTo;
