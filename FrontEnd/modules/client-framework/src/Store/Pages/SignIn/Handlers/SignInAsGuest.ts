import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { addAccount } from "@insite/client-framework/Services/AccountService";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import {
    stopWatchingForOtherTabSessionChange,
    watchForOtherTabSessionChange,
} from "@insite/client-framework/Services/SessionService";
import signIn from "@insite/client-framework/Store/Context/Handlers/SignIn";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";

type SignInAsGuestParameter = {
    returnUrl: string;
};

type HandlerType = ApiHandlerDiscreteParameter<
    SignInAsGuestParameter,
    Partial<AccountModel>,
    ServiceResult<AccountModel>
>;

type GuestAccountModel = Partial<AccountModel>;

export const DispatchBeginSignInAsGuest: HandlerType = props => {
    props.dispatch({
        type: "Pages/SignIn/BeginSignInAsGuest",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const { session } = props.getState().context;

    const guestAccount: GuestAccountModel = {
        isGuest: true,
        defaultFulfillmentMethod: session!.fulfillmentMethod,
    };

    if (session!.pickUpWarehouse) {
        guestAccount.defaultWarehouseId = session!.pickUpWarehouse.id;
    }

    props.apiParameter = guestAccount;
};

export const AddAccount: HandlerType = async props => {
    stopWatchingForOtherTabSessionChange();
    props.apiResult = await addAccount({ account: props.apiParameter });
    watchForOtherTabSessionChange();
};

export const SignIn: HandlerType = props => {
    if (!props.apiResult.successful) {
        throw new Error(`There was an issue signing in as a guest: ${props.apiResult.errorMessage}`);
    }
    const { userName, password } = props.apiResult.result;
    const { returnUrl } = props.parameter;
    props.dispatch(
        signIn({
            userName,
            password,
            rememberMe: false,
            returnUrl,
        }),
    );
};

export const DispatchCompleteSignInAsGuest: HandlerType = props => {
    props.dispatch({
        type: "Pages/SignIn/CompleteSignInAsGuest",
    });
};

export const chain = [
    DispatchBeginSignInAsGuest,
    PopulateApiParameter,
    AddAccount,
    SignIn,
    DispatchCompleteSignInAsGuest,
];

const signInAsGuest = createHandlerChainRunner(chain, "SignInAsGuest");
export default signInAsGuest;
