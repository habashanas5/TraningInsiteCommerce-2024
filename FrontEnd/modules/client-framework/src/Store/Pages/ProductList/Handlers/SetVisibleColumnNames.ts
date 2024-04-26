import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ visibleColumnNames: string[] }>;

export const DispatchSetVisibleColumnNames: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/SetVisibleColumnNames",
        visibleColumnNames: props.parameter.visibleColumnNames,
    });
};

export const chain = [DispatchSetVisibleColumnNames];

const setVisibleColumnNames = createHandlerChainRunner(chain, "SetVisibleColumnNames");

export default setVisibleColumnNames;
