import {
    ApiHandler,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    updatePaymentProfile as updatePaymentProfileApi,
    UpdatePaymentProfileApiParameter,
} from "@insite/client-framework/Services/AccountService";
import { AccountPaymentProfileModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<UpdatePaymentProfileApiParameter & HasOnSuccess, AccountPaymentProfileModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await updatePaymentProfileApi(props.parameter);
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

const updatePaymentProfile = createHandlerChainRunner(chain, "UpdatePaymentProfile");
export default updatePaymentProfile;
