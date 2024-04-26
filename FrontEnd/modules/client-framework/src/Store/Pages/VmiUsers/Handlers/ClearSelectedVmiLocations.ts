import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const DispatchClearSelectedVmiLocations: Handler = props => {
    props.dispatch({
        type: "Pages/VmiUsers/ClearSelectedVmiLocations",
    });
};

export const chain = [DispatchClearSelectedVmiLocations];

const clearSelectedVmiLocations = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearSelectedVmiLocations");
export default clearSelectedVmiLocations;
