import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";

type HandlerType = Handler<{ userId: string }>;

export const DispatchSetInitialValues: HandlerType = props => {
    const user = getAccountState(props.getState(), props.parameter.userId).value;
    if (!user) {
        throw new Error("There was no user and we were trying to set initial values for the user setup page.");
    }

    props.dispatch({
        type: "Pages/UserSetup/SetInitialValues",
        user,
    });
};

export const chain = [DispatchSetInitialValues];

const setInitialValues = createHandlerChainRunner(chain, "SetInitialValues");
export default setInitialValues;
