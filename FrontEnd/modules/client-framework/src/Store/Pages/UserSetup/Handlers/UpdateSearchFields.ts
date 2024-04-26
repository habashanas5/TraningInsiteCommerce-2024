import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { GetAccountShipToCollectionApiParameter } from "@insite/client-framework/Services/AccountService";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";

type HandlerType = Handler<GetAccountShipToCollectionApiParameter & UpdateSearchFieldsType>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/UserSetup/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateSearchFields = createHandlerChainRunnerOptionalParameter(chain, {}, "UpdateSearchFields");
export default updateSearchFields;
