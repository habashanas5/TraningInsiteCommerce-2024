import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiLocationDetails/VmiLocationDetailsReducer";

type HandlerType = Handler<{
    ids: string[];
    tabKey: TableTabKeys;
}>;

export const DispatchToggleVmiItemCheck: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/ToggleVmiItemCheck",
        tabKey: props.parameter.tabKey,
        ids: props.parameter.ids,
    });
};

export const chain = [DispatchToggleVmiItemCheck];

const selectVmiItems = createHandlerChainRunner(chain, "SelectVmiItems");
export default selectVmiItems;
