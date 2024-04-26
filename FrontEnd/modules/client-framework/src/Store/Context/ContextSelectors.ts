import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import translate from "@insite/client-framework/Translate";

export function getCurrencies(state: ApplicationState) {
    return state.context.website.currencies!.currencies;
}

export function getLanguages(state: ApplicationState) {
    return state.context.website.languages!.languages;
}

export function getSettingsCollection(state: ApplicationState) {
    return state.context.settings.settingsCollection;
}

export function getSelectedCategoryPath(state: ApplicationState) {
    return state.context.selectedCategoryPath;
}

export function getSelectedProductPath(state: ApplicationState) {
    return state.context.selectedProductPath;
}

export function getSelectedBrandPath(state: ApplicationState) {
    return state.context.selectedBrandPath;
}

export const getDefaultPageSize = (state: ApplicationState) =>
    state.context.settings.settingsCollection.websiteSettings.defaultPageSize ?? -1;

export const getCurrentUserIsGuest = (state: ApplicationState) =>
    state.context.session.isAuthenticated && state.context.session.isGuest;

export const getSession = (state: ApplicationState) => state.context.session;

export const getFulfillmentLabel = (state: ApplicationState) => {
    const { fulfillmentMethod, isAuthenticated, rememberMe, isGuest, shipToId, pickUpWarehouse } = getSession(state);
    const shipToState = getShipToState(state, shipToId);
    const { value: shipTo } = shipToState;
    let addressLabel = translate("Ship");
    if (fulfillmentMethod === FulfillmentMethod.Ship && (isAuthenticated || rememberMe) && !isGuest && shipTo) {
        addressLabel = translate("Ship to {0}", `${shipTo.companyName}, ${shipTo.fullAddress}`);
    } else if (fulfillmentMethod === FulfillmentMethod.PickUp) {
        addressLabel = translate(
            "Pick up {0}",
            pickUpWarehouse ? `at ${pickUpWarehouse.description || pickUpWarehouse.name}` : "",
        );
    }

    return addressLabel;
};

export const getIsPunchOutSession = (state: ApplicationState) => {
    return !!state.context.punchOutSessionId && !!state.context.session?.userName;
};

export const getSearchDataModeActive = (state: ApplicationState) => {
    return !!state.context.isSearchDataModeActive;
};
