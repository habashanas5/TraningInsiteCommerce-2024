import { updateContext } from "@insite/client-framework/Context";
import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnComplete,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { Session, updateSession, UpdateSessionApiParameter } from "@insite/client-framework/Services/SessionService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        fulfillmentMethod: "Ship" | "PickUp";
    } & HasOnComplete<void>,
    UpdateSessionApiParameter,
    Session
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            fulfillmentMethod: props.parameter.fulfillmentMethod,
        } as Session,
    };
};

export const UpdateContext: HandlerType = props => {
    updateContext({
        fulfillmentMethod: props.parameter.fulfillmentMethod,
    });
};

export const UpdateSession: HandlerType = async props => {
    props.apiResult = await updateSession(props.apiParameter);
};

export const LoadCart: HandlerType = async props => {
    if (props.parameter.onComplete) {
        // if we want to wait until the operation is complete, the cart must first be loaded
        const awaitableLoadCurrentCart = makeHandlerChainAwaitable(loadCurrentCart);
        await awaitableLoadCurrentCart({})(props.dispatch, props.getState);
    } else {
        props.dispatch(loadCurrentCart());
    }
};

export const DispatchCompleteLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: props.apiResult,
    });
};

export const FireOnComplete: HandlerType = ({ parameter: { onComplete } }) => {
    onComplete?.();
};

export const chain = [
    PopulateApiParameter,
    UpdateContext,
    UpdateSession,
    LoadCart,
    DispatchCompleteLoadSession,
    FireOnComplete,
];

const setFulfillmentMethod = createHandlerChainRunner(chain, "SetFulfillmentMethod");
export default setFulfillmentMethod;
