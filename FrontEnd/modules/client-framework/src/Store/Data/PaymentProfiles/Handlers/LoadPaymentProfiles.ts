import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getPaymentProfiles, GetPaymentProfilesApiParameter } from "@insite/client-framework/Services/AccountService";
import { AccountPaymentProfileCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetPaymentProfilesApiParameter, AccountPaymentProfileCollectionModel>;

export const DispatchBeginLoadPaymentProfiles: HandlerType = props => {
    props.dispatch({
        type: "Data/PaymentProfiles/BeginLoadPaymentProfiles",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getPaymentProfiles(props.apiParameter);
};

export const DispatchCompleteLoadPaymentProfiles: HandlerType = props => {
    props.dispatch({
        type: "Data/PaymentProfiles/CompleteLoadPaymentProfiles",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadPaymentProfiles,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadPaymentProfiles,
];

const loadPaymentProfiles = createHandlerChainRunner(chain, "LoadPaymentProfiles");
export default loadPaymentProfiles;
