import { removeCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import {
    stopWatchingForOtherTabSessionChange,
    watchForOtherTabSessionChange,
} from "@insite/client-framework/Services/SessionService";

export interface UpdateContextModel {
    languageId?: string | null;
    currencyId?: string | null;
    fulfillmentMethod?: string | null;
    billToId?: string | null;
    shipToId?: string | null;
}

export function updateContext(context: UpdateContextModel) {
    stopWatchingForOtherTabSessionChange(); // Prevent reload from the changes we're doing here.

    if (typeof context.languageId !== "undefined") {
        if (context.languageId === null) {
            removeCookie("CurrentLanguageId");
        } else {
            setCookie("CurrentLanguageId", context.languageId, { path: "/" });
        }
    }

    if (typeof context.currencyId !== "undefined") {
        if (context.currencyId === null) {
            removeCookie("CurrentCurrencyId");
        } else {
            setCookie("CurrentCurrencyId", context.currencyId, { path: "/" });
        }
    }

    if (typeof context.fulfillmentMethod !== "undefined") {
        if (context.fulfillmentMethod === null) {
            removeCookie("CurrentFulfillmentMethod");
        } else {
            setCookie("CurrentFulfillmentMethod", context.fulfillmentMethod, { path: "/" });
        }
    }

    if (typeof context.billToId !== "undefined") {
        if (context.billToId === null) {
            removeCookie("CurrentBillToId");
        } else {
            setCookie("CurrentBillToId", context.billToId.toString(), { path: "/" });
        }
    }

    if (typeof context.shipToId !== "undefined") {
        if (context.shipToId === null) {
            removeCookie("CurrentShipToId");
        } else {
            setCookie("CurrentShipToId", context.shipToId.toString(), { path: "/" });
        }
    }

    watchForOtherTabSessionChange(); // Restart the watcher with the updated "current" state.
}
