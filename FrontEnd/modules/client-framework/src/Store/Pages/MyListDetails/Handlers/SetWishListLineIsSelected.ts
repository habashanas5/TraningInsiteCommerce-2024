import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ wishListLineId: string; isSelected: boolean }>;

export const DispatchSetWishListLineIsSelected: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/SetWishListLineIsSelected",
        wishListLineId: props.parameter.wishListLineId,
        isSelected: props.parameter.isSelected,
    });
};

export const chain = [DispatchSetWishListLineIsSelected];

const setWishListLineIsSelected = createHandlerChainRunner(chain, "SetWishListLineIsSelected");
export default setWishListLineIsSelected;
