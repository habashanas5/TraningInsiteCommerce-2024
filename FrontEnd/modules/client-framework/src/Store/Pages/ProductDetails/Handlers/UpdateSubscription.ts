import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { ProductSubscriptionDto } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{ subscription: ProductSubscriptionDto }>;

export const DispatchUpdateSubscription: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/UpdateSubscription",
        subscription: props.parameter.subscription,
    });
};

export const chain = [DispatchUpdateSubscription];

const updateSubscription = createHandlerChainRunner(chain, "UpdateSubscription");
export default updateSubscription;
