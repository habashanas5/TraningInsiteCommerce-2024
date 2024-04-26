import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { useSelector } from "react-redux";

export default function useAppSelector<TSelected>(
    selector: (state: ApplicationState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
) {
    return useSelector(selector, equalityFn);
}
