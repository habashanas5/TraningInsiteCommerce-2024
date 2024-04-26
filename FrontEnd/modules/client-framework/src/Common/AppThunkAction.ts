import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { AnyAction } from "@insite/client-framework/Store/Reducers";

/** Used as a hint on action creators so that its "dispatch" and "getState" params are correctly typed. */
export default interface AppThunkAction {
    (dispatch: (action: AnyAction) => void, getState: () => ApplicationState): void;
}
