import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import {
    getSession,
    Session,
    updateSession,
    UpdateSessionApiParameter,
} from "@insite/client-framework/Services/SessionService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";

type UpdatePickUpWarehouseParameter = {
    pickUpWarehouse: WarehouseModel;
} & HasOnSuccess;

type HandlerType = ApiHandlerDiscreteParameter<UpdatePickUpWarehouseParameter, UpdateSessionApiParameter, Session>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            pickUpWarehouse: { id: props.parameter.pickUpWarehouse.id } as WarehouseModel,
            customerWasUpdated: true,
        } as Session,
    };
};

export const UpdateSession: HandlerType = async props => {
    // Since the updateSession response is not reliable we have to make a request to getSession.
    await updateSession(props.apiParameter);
    props.apiResult = await getSession({});
};

export const DispatchCompleteLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: props.apiResult,
    });
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    UpdateSession,
    DispatchCompleteLoadSession,
    LoadCart,
    ExecuteOnSuccessCallback,
];

const updatePickUpWarehouse = createHandlerChainRunner(chain, "UpdatePickUpWarehouse");
export default updatePickUpWarehouse;
