import { canUseDOM } from "exenv";
import warning from "tiny-warning";

let globalElement: string | HTMLElement | null = null;

export function assertNodeList(nodeList: { length: number }, selector: string) {
    if (!nodeList || !nodeList.length) {
        throw new Error(`mobius: No elements were found for selector ${selector}.`);
    }
}

export function setElement(element: string) {
    let useElement: string | HTMLElement = element;
    if (typeof useElement === "string" && canUseDOM) {
        const el = document.querySelectorAll(useElement);
        assertNodeList(el, useElement);
        useElement = "length" in el ? (el[0] as HTMLElement) : el;
    }
    globalElement = useElement || globalElement;
    return globalElement;
}

export function validateElement(appElement: HTMLElement) {
    if (!appElement && !globalElement) {
        warning(
            false,
            [
                "mobius: Overlay app element is not defined.",
                "Please use `Overlay.setAppElement(el)` or set `appElement={el}`.",
                "This is needed so screen readers don't see main content",
                "when modal is opened.",
            ].join(" "),
        );

        return false;
    }

    return true;
}

export function hide(appElement: HTMLElement) {
    if (validateElement(appElement)) {
        (appElement || globalElement).setAttribute("aria-hidden", "true");
        document.querySelector("body")?.setAttribute("style", "overflow: hidden;");
    }
}

export function show(appElement: HTMLElement) {
    if (validateElement(appElement)) {
        (appElement || globalElement).removeAttribute("aria-hidden");
        document.querySelector("body")?.removeAttribute("style");
    }
}
