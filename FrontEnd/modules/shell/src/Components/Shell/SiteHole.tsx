import { FrameHole, setupSiteHole } from "@insite/client-framework/Common/FrameHole";
import { Dictionary } from "@insite/client-framework/Common/Types";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { Action, Dispatch, MiddlewareAPI } from "redux";

interface SiteHole {
    frameHole?: FrameHole;
}

let siteHole: SiteHole;

export const closeSiteHole = () => {
    (window as any).frameHoleIsReady = false; // makes sure our AUI tests won't try to access the iframe until it reestablishes the connection which indicates it is done loading.

    if (siteHole) {
        delete siteHole.frameHole;
    }
};

export const sendToSite = (message: any) => {
    if (!siteHole || !siteHole.frameHole) {
        addQueuedMessage(message);
        return;
    }

    siteHole.frameHole.send(message as any);
};

const queuedMessages: any[] = [];
let messageInterval: number | undefined;

function addQueuedMessage(message: any) {
    queuedMessages.push(message);
    clearInterval(messageInterval);
    messageInterval = setInterval(() => {
        if (!siteHole || !siteHole.frameHole) {
            return;
        }

        while (queuedMessages.length > 0) {
            siteHole.frameHole.send(queuedMessages.shift());
        }

        clearInterval(messageInterval);
    }, 50);
}

export const setSiteFrame = (frame: HTMLIFrameElement, handlers: Dictionary<(data: any) => void>) => {
    siteHole = {};
    setupSiteHole(frame, siteHole, handlers);
};

export const siteHoleMessenger =
    (store: MiddlewareAPI<Dispatch, ShellState>) => (next: Dispatch) => (action: Action) => {
        if (action.type && action.type.indexOf("SendToSite/") === 0) {
            sendToSite({
                ...action,
                type: action.type.replace("SendToSite/", ""),
            });
            return null;
        }

        return next(action);
    };
