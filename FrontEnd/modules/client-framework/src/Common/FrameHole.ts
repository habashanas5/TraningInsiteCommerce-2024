import sleep from "@insite/client-framework/Common/Sleep";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { loadMobileComponents } from "@insite/client-framework/Internal";
import logger from "@insite/client-framework/Logger";

const Handshake = "Handshake";
const HandshakeReply = "Handshake-Reply";
const HandshakeAcknowledge = "Handshake-Acknowledge";
const StopListener = "StopListener";

export interface FrameHole {
    send: (message: FrameHoleMessage) => void;
}

export interface FrameHoleMessage {
    type: string;
}

export interface AddWidgetData {
    parentId: string;
    zoneName: string;
    sortOrder: number;
    addRow?: boolean;
}

const log = (message: string) => {
    logger.debug(message);
};

export interface HasFrameHole {
    frameHole?: FrameHole;
}

let siteHoleListener: (event: MessageEvent) => void;

export const setupSiteHole = async function (
    siteFrame: HTMLIFrameElement,
    siteHole: HasFrameHole,
    handlers: Dictionary<(data: any) => void>,
): Promise<void> {
    if (IS_SERVER_SIDE) {
        return;
    }

    const sendMessage = function (type: string, data?: {}) {
        if (siteFrame.contentWindow === null) {
            logger.warn(
                `Site frame has no content window, message not sent; shell type: ${type} data ${JSON.stringify(data)}`,
            );
            return;
        }

        log(`sending message to site - ${type} data: ${JSON.stringify(data)}`);

        siteFrame.contentWindow.postMessage(
            { id: "shell", type, data },
            `${window.location.protocol}//${window.location.host}`,
        );
    };

    let completedHandshake = false;
    window.removeEventListener("message", siteHoleListener);
    siteHoleListener = (event: MessageEvent) => {
        if (isValidMessage(event)) {
            if (event.data.type === StopListener) {
                // if we haven't yet completed the handshake and we stop the listener, then we will never complete the handshake.
                // this can occur if the shell is ready before the site tries to establish communication
                if (completedHandshake) {
                    window.removeEventListener("message", siteHoleListener);
                }
            } else if (event.data.type === Handshake) {
                sendMessage(HandshakeReply);
            } else if (event.data.type === HandshakeAcknowledge) {
                completedHandshake = true;
                // needed so our AUI tests can know the frameHole is ready
                (window as any).frameHoleIsReady = true;
            } else {
                const handler = handlers[event.data.type];
                if (handler) {
                    handler(event.data.data);
                } else {
                    throw new Error(`Did not have a handler on the shell for the message type ${event.data.type}`);
                }
            }
        }
    };
    window.addEventListener("message", siteHoleListener);

    let attempts = 0;
    // 150 * 200ms = 30s
    while (!completedHandshake && attempts < 150) {
        attempts = attempts + 1;
        await sleep(200);
    }

    if (!siteFrame.isConnected) {
        return;
    }

    if (!completedHandshake) {
        throw new Error("FrameHole could not establish connection to the site");
    }

    siteHole.frameHole = {
        send: (data: FrameHoleMessage) => {
            const type = data.type;
            delete data.type;
            sendMessage(type, data);
        },
    };
};

export function canSetupShellHole(): boolean {
    return !IS_SERVER_SIDE && !!window.parent;
}

let shellHoleListener: (event: MessageEvent) => void;

export const setupShellHole = async function (handlers: Dictionary<(data: any) => void>): Promise<FrameHole | void> {
    if (!canSetupShellHole()) {
        return;
    }

    await loadMobileComponents();

    let completedHandshake = false;

    const sendMessage = function (type: string, data?: {}) {
        log(`sending message to shell - ${type} data: ${JSON.stringify(data)}`);
        window.parent.postMessage({ id: "shell", type, data }, `${window.location.protocol}//${window.location.host}`);
    };

    sendMessage(StopListener);

    window.removeEventListener("message", shellHoleListener);
    shellHoleListener = (event: MessageEvent) => {
        if (isValidMessage(event)) {
            if (event.data.type === HandshakeReply) {
                completedHandshake = true;
            } else {
                log(`Receiving message on site - ${event.data.type} data: ${JSON.stringify(event.data.data)}`);
                const handler = handlers[event.data.type];
                if (handler) {
                    handler(event.data.data);
                } else {
                    throw new Error(`Did not have a handler on the site for the message type ${event.data.type}`);
                }
            }
        }
    };
    window.addEventListener("message", shellHoleListener);

    let attempts = 0;
    while (!completedHandshake && attempts < 100) {
        attempts = attempts + 1;
        sendMessage(Handshake);
        await sleep(200);
    }

    if (!completedHandshake) {
        return;
    }

    sendMessage(HandshakeAcknowledge);

    return {
        send: (data: FrameHoleMessage) => {
            const type = data.type;
            delete data.type;
            sendMessage(type, data);
        },
    };
};

function isValidMessage(event: MessageEvent) {
    return event.data.id && event.data.id === "shell";
}
