import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";

type HandlerType = Handler<GetWishListsApiParameter>;

export const DispatchUpdateLoadParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyLists/UpdateLoadParameter",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLoadParameter];

const updateLoadParameter = createHandlerChainRunner(chain, "UpdateLoadParameter");
export default updateLoadParameter;
