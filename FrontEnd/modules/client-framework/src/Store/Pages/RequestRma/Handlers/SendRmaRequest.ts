import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import { addRma as addRmaApi, AddRmaApiParameter } from "@insite/client-framework/Services/OrderService";
import { RmaLineDto, RmaModel } from "@insite/client-framework/Types/ApiModels";

type SendRmaRequestParameter = {
    orderNumber: string;
    onError?: (errorMessage: string) => void;
} & HasOnSuccess<RmaModel>;

type HandlerType = ApiHandlerDiscreteParameter<SendRmaRequestParameter, AddRmaApiParameter, ServiceResult<RmaModel>>;

export const DispatchBeginSendRmaRequest: HandlerType = props => {
    props.dispatch({
        type: "Pages/RequestRma/BeginSendRmaRequest",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const orderLines = state.pages.requestRma.orderLines;
    if (orderLines.length === 0) {
        return false;
    }

    props.apiParameter = {
        rmaModel: {
            orderNumber: props.parameter.orderNumber,
            notes: state.pages.requestRma.returnNotes || "",
            rmaLines: orderLines
                .map(orderLine => {
                    return {
                        line: orderLine.lineNumber,
                        rmaQtyRequested: orderLine.rmaQtyRequested,
                        rmaReasonCode: orderLine.returnReason,
                    } as RmaLineDto;
                })
                .filter(x => x.rmaQtyRequested > 0),
        } as RmaModel,
    };
};

export const CallAddRmaApi: HandlerType = async props => {
    props.apiResult = await addRmaApi(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.apiResult.successful) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.(props.apiResult.result);
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (!props.apiResult.successful) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.apiResult.errorMessage);
    }
};

export const DispatchCompleteSendRmaRequest: HandlerType = props => {
    props.dispatch({
        type: "Pages/RequestRma/CompleteSendRmaRequest",
        result: props.apiResult.successful ? props.apiResult.result : undefined,
    });
};

export const chain = [
    DispatchBeginSendRmaRequest,
    PopulateApiParameter,
    CallAddRmaApi,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
    DispatchCompleteSendRmaRequest,
];

const sendRmaRequest = createHandlerChainRunner(chain, "SendRmaRequest");
export default sendRmaRequest;
