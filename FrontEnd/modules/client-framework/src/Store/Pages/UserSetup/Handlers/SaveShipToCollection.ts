import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    applyAccountShipToCollection,
    ApplyAccountShipToCollectionApiParameter,
} from "@insite/client-framework/Services/AccountService";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import { AccountShipToCollectionModel, AccountShipToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        shipToCollection: AccountShipToModel[];
    } & HasOnError<string> &
        HasOnSuccess,
    ApplyAccountShipToCollectionApiParameter,
    ServiceResult<AccountShipToCollectionModel>
>;

export const PopulateApiParameter: HandlerType = props => {
    const userId = props.getState().pages.userSetup.userId;
    if (!userId) {
        return false;
    }

    props.apiParameter = {
        accountId: userId,
        shipToCollection: props.parameter.shipToCollection,
    };
};

export const CallApplyAccountShipToCollection: HandlerType = async props => {
    props.apiResult = await applyAccountShipToCollection(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.apiResult.successful) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.();
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (!props.apiResult.successful) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.apiResult.errorMessage);
    }
};

export const chain = [
    PopulateApiParameter,
    CallApplyAccountShipToCollection,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
];

const saveShipToCollection = createHandlerChainRunner(chain, "SaveShipToCollection");
export default saveShipToCollection;
