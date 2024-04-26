import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";

type HandlerType = Handler<GetWishListsApiParameter>;

export const DispatchUpdateGetWishListsParameter: HandlerType = props => {
    props.dispatch({
        type: "Components/AddToListModal/UpdateGetWishListsParameter",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateGetWishListsParameter];

const updateGetWishListsParameter = createHandlerChainRunner(chain, "UpdateGetWishListsParameter");
export default updateGetWishListsParameter;
