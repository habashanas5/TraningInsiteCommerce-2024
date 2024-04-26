import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";

type HandlerType = Handler<Partial<GetWishListLinesApiParameter>>;

export const DispatchUpdateLoadWishListLinesParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/UpdateLoadWishListLinesParameter",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLoadWishListLinesParameter];

const updateLoadWishListLinesParameter = createHandlerChainRunner(chain, "UpdateLoadWishListLinesParameter");
export default updateLoadWishListLinesParameter;
