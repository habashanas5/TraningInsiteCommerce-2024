import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    ids: string[];
}>;

export const DispatchToggleLocationCheck: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiUsers/ToggleLocationCheck",
        ids: props.parameter.ids,
    });
};

export const chain = [DispatchToggleLocationCheck];

const toggleLocationCheck = createHandlerChainRunner(chain, "ToggleLocationCheck");
export default toggleLocationCheck;
