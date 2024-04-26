import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { ProductListViewType } from "@insite/client-framework/Store/Pages/ProductList/ProductListState";

type HandlerType = Handler<{ view: ProductListViewType }>;

export const DispatchSetView: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/SetView",
        parameter: props.parameter,
    });
};

export const chain = [DispatchSetView];

const setView = createHandlerChainRunner(chain, "SetView");

export default setView;
