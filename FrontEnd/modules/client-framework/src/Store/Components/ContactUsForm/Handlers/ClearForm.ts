import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const ClearForm: Handler = props => {
    props.dispatch({
        type: "Components/ContactUsForm/ClearForm",
    });
};

export const chain = [ClearForm];

const clearForm = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearForm");
export default clearForm;
