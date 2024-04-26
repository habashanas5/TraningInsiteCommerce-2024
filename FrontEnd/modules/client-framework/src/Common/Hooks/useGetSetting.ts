import { SettingsCollectionModel } from "@insite/client-framework/Services/SettingsService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { useSelector } from "react-redux";

export default function useGetSetting<TSelected>(
    selector: (settings: SettingsCollectionModel) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
) {
    return useSelector((state: ApplicationState) => selector(getSettingsCollection(state)), equalityFn);
}
