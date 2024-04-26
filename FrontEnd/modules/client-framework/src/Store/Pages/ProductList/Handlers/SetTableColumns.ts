import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { AttributeTypeFacetModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{ tableColumns: AttributeTypeFacetModel[] }>;

export const DispatchSetTableColumns: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/SetTableColumns",
        tableColumns: props.parameter.tableColumns,
    });
};

export const chain = [DispatchSetTableColumns];

const setTableColumns = createHandlerChainRunner(chain, "SetTableColumns");

export default setTableColumns;
