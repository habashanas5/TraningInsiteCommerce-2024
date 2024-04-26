import AppThunkAction from "@insite/client-framework/Common/AppThunkAction";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import ShellState from "@insite/shell/Store/ShellState";
import { RouterAction } from "connected-react-router";

export type ShellDispatch = (action: AnyShellAction | ShellThunkAction | RouterAction | AppThunkAction) => void;

/** Used as a hint on action creators so that its "dispatch" and "getState" params are correctly typed. */
export default interface ShellThunkAction {
    (dispatch: ShellDispatch, getState: () => ShellState): void;
}
