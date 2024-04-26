import Logger from "@insite/client-framework/Logger";
import { getSessionCookies } from "@insite/client-framework/ServerSideRendering";
import { setupSetCookie } from "@insite/mobius/utilities/cookies";
import Cookies, { CookieAttributes } from "js-cookie";

export function getCookie(name: string) {
    if (IS_SERVER_SIDE) {
        const cookies = getSessionCookies();
        if (cookies) {
            const cookieValue = cookies[name];
            if (cookieValue) {
                return decodeCookie(cookieValue);
            }
        }
        return;
    }
    return getCookies().get(name);
}

export function setCookie(name: string, value: string, options?: CookieAttributes) {
    if (IS_SERVER_SIDE) {
        // if we do decide to support this and removeCookie
        // we would need to modify the collection that is returned from getSessionCookies, encode the value and then recall setSessionCookies
        Logger.error("setCookie is not currently supported during server side rendering.");
        return;
    }

    const isSecure = window.location.protocol === "https:";
    if (options) {
        options.secure = isSecure;
    } else {
        options = { secure: isSecure };
    }

    return getCookies().set(name, value, options);
}

setupSetCookie(setCookie);

export function removeCookie(name: string, options?: CookieAttributes) {
    if (IS_SERVER_SIDE) {
        Logger.error("removeCookie is not currently supported during server side rendering.");
        return;
    }
    return Cookies.remove(name, options);
}

function getCookies() {
    return Cookies.withConverter({
        read: decodeCookie,
        write: value => encodeCookie(value.toString()),
    });
}

// on the .net site we use HttpUtility.UrlEncode which encodes ' ' as '+'
export function decodeCookie(value: string) {
    return decodeURIComponent(value.replace(/\+/g, " "));
}

export function encodeCookie(value: string) {
    return encodeURIComponent(value.toString()).replace(/%20/g, "+");
}
