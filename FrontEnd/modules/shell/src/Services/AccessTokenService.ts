import { getShellContext } from "@insite/shell/Services/ContentAdminService";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import { Dispatch } from "react";

const accessTokenExpiresOn = "admin-accessToken-expires";
const refreshTokenName = "admin-refreshToken";
const lastActiveTimeName = "admin-lastActiveTime";

const thirtySeconds = 30000;
const fifteenMinutes = 900000;
const twelveMinutes = 720000;

const startInactivityInterval = () => {
    const lastActiveTimeText = localStorage.getItem(lastActiveTimeName);
    const timeDelta = Date.now() - (lastActiveTimeText ? new Date(lastActiveTimeText).getTime() : Date.now());

    if (!lastActiveTimeText) {
        setLastActiveTime();
    }

    if (!dispatch) {
        return;
    }

    if (timeDelta >= fifteenMinutes) {
        dispatch({
            type: "ShellContext/LogOut",
        });
        window.location.reload();
        return;
    }

    if (timeDelta >= twelveMinutes) {
        dispatch({ type: "LogoutWarningModal/ShowModal" });
        return;
    }

    checkAccessToken();
};

const checkAccessToken = () => {
    const expiresOn = +(localStorage.getItem(accessTokenExpiresOn) || 0);
    if (!expiresOn) {
        return;
    }

    const now = Date.now();
    if (now > expiresOn) {
        localStorage.removeItem(adminAccessTokenName);
        window.location.reload(true);
        return;
    }

    const fiveMinutesFromNow = now + 5 * 60 * 1000;
    if (fiveMinutesFromNow > expiresOn) {
        localStorage.removeItem(accessTokenExpiresOn);
        refreshAccessToken();
    }
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem(refreshTokenName);
    if (refreshToken && shellContext) {
        const response = await fetch("/identity/connect/token", {
            method: "POST",
            body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&client_id=${
                shellContext.adminClientId
            }&client_secret=${shellContext.adminClientSecret}`,
            headers: new Headers({
                "content-type": "application/x-www-form-urlencoded",
            }),
        });

        if (response.status !== 200) {
            return;
        }

        const result = await (response.json() as Promise<{
            readonly access_token: string;
            readonly refresh_token: string;
            readonly expires_in: number;
        }>);

        localStorage.setItem(adminAccessTokenName, result.access_token);
        localStorage.setItem(refreshTokenName, result.refresh_token);
        localStorage.setItem(accessTokenExpiresOn, (Date.now() + result.expires_in * 1000).toString());
    } else {
        window.location.reload(true);
    }
};

const setLastActiveTime = () => {
    localStorage.setItem(lastActiveTimeName, new Date().toISOString());
};

let dispatch: Dispatch<AnyShellAction> | undefined;
let inactivityInterval: number;
let shellContext: any;

export const trackUserEvents = async (storeDispatch: typeof dispatch) => {
    if (inactivityInterval) {
        return;
    }

    dispatch = storeDispatch;
    shellContext = await getShellContext();
    inactivityInterval = setInterval(startInactivityInterval, thirtySeconds);

    setLastActiveTime();
    document.addEventListener("keypress", setLastActiveTime);
    document.addEventListener("mousedown", setLastActiveTime);
    document.addEventListener("ontouchstart", setLastActiveTime);
};

export const getAccessTokenFromLocalStorage = () => {
    if (typeof localStorage === "undefined") {
        return null; // Server-side
    }

    return localStorage.getItem(adminAccessTokenName);
};

export const adminAccessTokenName = "admin-accessToken";
