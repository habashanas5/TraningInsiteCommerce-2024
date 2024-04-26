import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    ids: string[];
}>;

export const DispatchToggleLocationCheck: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocations/ToggleLocationCheck",
        ids: props.parameter.ids,
    });
};

export const chain = [DispatchToggleLocationCheck];

const selectVmiLocations = createHandlerChainRunner(chain, "SelectVmiLocations");
export default selectVmiLocations;
