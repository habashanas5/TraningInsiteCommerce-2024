import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const ClearFormErrors: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/SetShippingAddressFormErrors",
        formErrors: {},
    });
};

export const chain = [ClearFormErrors];

const resetShippingAddressFormValidation = createHandlerChainRunnerOptionalParameter(
    chain,
    {},
    "ResetShippingAddressFormValidation",
);
export default resetShippingAddressFormValidation;
