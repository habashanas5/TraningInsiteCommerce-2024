import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ wishListId?: string; modalIsOpen: boolean }>;

/** @deprecated Not needed anymore */
export const LoadWishListIfNeeded: HandlerType = () => {};

export const DispatchCompleteSetIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Components/ManageShareListModal/CompleteSetIsOpen",
        isOpen: props.parameter.modalIsOpen,
        wishListId: props.parameter.wishListId,
    });
};

export const chain = [DispatchCompleteSetIsOpen];

const setManageShareListModalIsOpen = createHandlerChainRunner(chain, "SetManageShareListModalIsOpen");
export default setManageShareListModalIsOpen;
