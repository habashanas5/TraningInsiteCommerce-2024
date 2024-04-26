import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

export interface SetAllWishListLinesIsSelectedParameter {
    isSelected: boolean;
    wishListLineIds?: string[];
}

type HandlerType = Handler<SetAllWishListLinesIsSelectedParameter>;

export const DispatchSetAllWishListLinesIsSelected: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/SetAllWishListLinesIsSelected",
        isSelected: props.parameter.isSelected,
        wishListLineIds: props.parameter.wishListLineIds,
    });
};

export const chain = [DispatchSetAllWishListLinesIsSelected];

const setAllWishListLinesIsSelected = createHandlerChainRunner(chain, "SetAllWishListLinesIsSelected");
export default setAllWishListLinesIsSelected;
