import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { addAccount as addAccountApi, AddAccountApiParameter } from "@insite/client-framework/Services/AccountService";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import { updateCart } from "@insite/client-framework/Services/CartService";
import {
    deleteSession,
    stopWatchingForOtherTabSessionChange,
    watchForOtherTabSessionChange,
} from "@insite/client-framework/Services/SessionService";
import { getCurrentUserIsGuest } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";
import cloneDeep from "lodash/cloneDeep";

export interface AddAccountParameter {
    userName: string;
    email: string;
    password: string;
    isSubscribed: boolean;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

type HandlerType = ApiHandlerDiscreteParameter<
    AddAccountParameter,
    AddAccountApiParameter,
    ServiceResult<AccountModel>
>;

export const UnassignCartFromGuest: HandlerType = async props => {
    const { value: cart } = getCurrentCartState(props.getState());
    const currentUserIsGuest = getCurrentUserIsGuest(props.getState());
    if (!currentUserIsGuest) {
        return;
    }
    if (!cart) {
        throw new Error("The cart is not loaded. Try reloading the page.");
    }

    if (cart.lineCount > 0) {
        const cartClone = cloneDeep(cart) as Draft<typeof cart>;
        cartClone.unassignCart = true;
        await updateCart({ cart: cartClone });
    }
};

export const SignOutGuest: HandlerType = async props => {
    const currentUserIsGuest = getCurrentUserIsGuest(props.getState());
    if (!currentUserIsGuest) {
        return;
    }

    await deleteSession();
    props.dispatch({
        type: "Context/DeleteSession",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        account: {
            ...props.parameter,
        } as AccountModel,
    };
};

export const AddAccount: HandlerType = async props => {
    stopWatchingForOtherTabSessionChange();
    props.apiResult = await addAccountApi(props.apiParameter);
    watchForOtherTabSessionChange();
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (!props.apiResult.successful) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.apiResult.errorMessage!);
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.apiResult.successful) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.();
    }
};

export const chain = [
    UnassignCartFromGuest,
    SignOutGuest,
    PopulateApiParameter,
    AddAccount,
    ExecuteOnErrorCallback,
    ExecuteOnSuccessCallback,
];

const addAccount = createHandlerChainRunner(chain, "AddAccount");
export default addAccount;
