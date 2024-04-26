import ShellState from "@insite/shell/Store/ShellState";
import { ShellDispatch } from "@insite/shell/Store/ShellThunkAction";
import { useDispatch, useSelector } from "react-redux";

export function useShellSelector<TSelected>(
    selector: (state: ShellState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
) {
    return useSelector(selector, equalityFn);
}

export function useShellDispatch() {
    return useDispatch<ShellDispatch>();
}
