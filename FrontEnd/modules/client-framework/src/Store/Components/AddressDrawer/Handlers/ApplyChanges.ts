import {
    createHandlerChainRunner,
    Handler,
    HasOnError,
    HasOnSuccess,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import changeCustomerContext from "@insite/client-framework/Store/Context/Handlers/ChangeCustomerContext";
import { getLocationPathAndQuery } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

type HandlerType = Handler<HasOnSuccess & HasOnError<string>>;

export const DispatchBeginApplyChanges: HandlerType = ({ dispatch }) => {
    dispatch({
        type: "Components/AddressDrawer/BeginApplyChanges",
    });
};

export const ChangeCustomerContext: HandlerType = async ({ dispatch, getState, parameter: { onError } }) => {
    const { fulfillmentMethod, selectedBillTo, selectedShipTo, isDefault, pickUpWarehouse } =
        getState().components.addressDrawer;

    const awaitableChangeCustomerContext = makeHandlerChainAwaitable(changeCustomerContext);

    await awaitableChangeCustomerContext({
        billToId: selectedBillTo?.id,
        shipToId: selectedShipTo?.id,
        fulfillmentMethod,
        pickUpWarehouse,
        isDefault,
        returnUrl: getLocationPathAndQuery(getState()),
        onError: (errorMessage: string) => {
            onError?.(errorMessage);
            dispatch({
                type: "Components/AddressDrawer/CompleteApplyChanges",
            });
        },
    })(dispatch, getState);
};

export const DispatchCompleteApplyChanges: HandlerType = ({ dispatch }) => {
    dispatch({
        type: "Components/AddressDrawer/CompleteApplyChanges",
    });
};

export const FireOnSuccess: HandlerType = ({ parameter: { onSuccess } }) => {
    onSuccess?.();
};

export const chain = [DispatchBeginApplyChanges, ChangeCustomerContext, DispatchCompleteApplyChanges, FireOnSuccess];

const applyChanges = createHandlerChainRunner(chain, "ApplyChanges");
export default applyChanges;
