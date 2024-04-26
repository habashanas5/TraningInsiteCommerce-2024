import { ApiHandler, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";
import { getBillTos, GetBillTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { BillToCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetBillTosApiParameter, BillToCollectionModel>;

export const DispatchBeginLoadBillTos: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/BeginLoadBillTos",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getBillTos(props.apiParameter);
};

export const DispatchCompleteLoadBillTos: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/CompleteLoadBillTos",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [DispatchBeginLoadBillTos, PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadBillTos];

const loadBillTos = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadBillTos");
export default loadBillTos;
