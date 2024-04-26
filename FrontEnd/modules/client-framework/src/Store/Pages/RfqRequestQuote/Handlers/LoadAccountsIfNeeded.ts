import {
    createHandlerChainRunnerOptionalParameter,
    HandlerWithResult,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import loadAccounts from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccounts";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<{}, AccountModel[]>;

export const LoadCartIfNeeded: HandlerType = async props => {
    const currentCart = getCurrentCartState(props.getState()).value;
    if (!currentCart || !currentCart.cartLines || currentCart.cartLines.length > 0) {
        const awaitableLoadCurrentCart = makeHandlerChainAwaitable(loadCurrentCart);
        await awaitableLoadCurrentCart({})(props.dispatch, props.getState);
    }
};

export const ExitIfNotASalesRep: HandlerType = props => {
    const currentCart = getCurrentCartState(props.getState()).value;
    if (currentCart && !currentCart.isSalesperson) {
        return false;
    }
};

export const LoadAccounts: HandlerType = async props => {
    const awaitableLoadAccounts = makeHandlerChainAwaitable(loadAccounts);
    await awaitableLoadAccounts({})(props.dispatch, props.getState);
};

export const FilterAndSortAccounts: HandlerType = props => {
    const accounts = getAccountsDataView(props.getState(), {});
    if (accounts.value) {
        const userName = props.getState().context.session.userName;
        props.result = accounts.value
            .filter(o => o.userName !== userName)
            .sort((user1, user2) => user1.userName.localeCompare(user2.userName));
    }
};

export const DispatchCompleteLoadAccounts: HandlerType = props => {
    props.dispatch({
        type: "Pages/RfqRequestQuote/CompleteLoadAccounts",
        collection: props.result,
    });
};

export const chain = [
    LoadCartIfNeeded,
    ExitIfNotASalesRep,
    LoadAccounts,
    FilterAndSortAccounts,
    DispatchCompleteLoadAccounts,
];

const loadAccountsIfNeeded = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadAccountsIfNeeded");
export default loadAccountsIfNeeded;
