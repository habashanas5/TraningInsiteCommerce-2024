import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<void>;

export const ClearFormErrors: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/SetBillingAddressFormErrors",
        formErrors: {},
    });
};

export const chain = [ClearFormErrors];

const resetBillingAddressFormValidation = createHandlerChainRunner(chain, "ResetBillingAddressFormValidation");
export default resetBillingAddressFormValidation;
