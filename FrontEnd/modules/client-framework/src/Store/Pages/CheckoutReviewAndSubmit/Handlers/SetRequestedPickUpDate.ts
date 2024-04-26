import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ requestedPickUpDate?: Date }>;

export const DispatchSetRequestedPickUpDate: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/SetRequestedPickUpDate",
        requestedPickUpDate: props.parameter.requestedPickUpDate,
    });
};

export const chain = [DispatchSetRequestedPickUpDate];

const setRequestedPickUpDate = createHandlerChainRunner(chain, "SetRequestedPickUpDate");
export default setRequestedPickUpDate;
