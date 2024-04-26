import {
    ApiHandler,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    deletePaymentProfile as deletePaymentProfileApi,
    DeletePaymentProfileApiParameter,
} from "@insite/client-framework/Services/AccountService";

type HandlerType = ApiHandler<DeletePaymentProfileApiParameter & HasOnSuccess, {}>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = props => {
    return deletePaymentProfileApi(props.parameter);
};

export const DispatchResetPaymentProfiles: HandlerType = props => {
    props.dispatch({
        type: "Data/PaymentProfiles/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [PopulateApiParameter, RequestDataFromApi, DispatchResetPaymentProfiles, ExecuteOnSuccessCallback];

const deletePaymentProfile = createHandlerChainRunner(chain, "DeletePaymentProfile");
export default deletePaymentProfile;
