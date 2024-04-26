import findTabbable from "@insite/mobius/Overlay/helpers/tabbable";

const focusLaterElements: HTMLElement[] = [];
let modalElement: HTMLElement | null = null;
let needToFocus = false;

export function handleBlur() {
    needToFocus = true;
}

export function handleFocus() {
    if (needToFocus) {
        needToFocus = false;
        if (!modalElement) {
            return;
        }
        // need to see how jQuery shims document.on('focusin') so we don't need the
        // setTimeout, firefox doesn't support focusin, if it did, we could focus
        // the element outside of a setTimeout. Side-effect of this implementation
        // is that the document.body gets focus, and then we focus our element right
        // after, seems fine.
        setTimeout(() => {
            if (modalElement?.contains(document.activeElement)) {
                return;
            }
            const el = findTabbable(modalElement as HTMLElement)[0] || modalElement;
            el?.focus();
        }, 0);
    }
}

export function markForFocusLater() {
    document.activeElement && focusLaterElements.push(document.activeElement as HTMLElement);
}

export function returnFocus() {
    let toFocus = null;
    let currentlyFocusedElement = null;
    for (let i = focusLaterElements.length - 1; i >= 0; i--) {
        toFocus = focusLaterElements.pop();
        toFocus?.focus();
        currentlyFocusedElement = document.activeElement;
        if (currentlyFocusedElement === toFocus) {
            return;
        }
    }
    if (toFocus) {
        // eslint-disable-next-line no-console
        console.warn(["You tried to return focus to", toFocus, "but it is not in the DOM anymore"].join(" "));
    }
}

export function setupScopedFocus(element: HTMLElement) {
    modalElement = element;

    if (window.addEventListener) {
        window.addEventListener("blur", handleBlur, false);
        document.addEventListener("focus", handleFocus, true);
    } else {
        (<any>window).attachEvent("onBlur", handleBlur);
        (<any>document).attachEvent("onFocus", handleFocus);
    }
}

export function teardownScopedFocus() {
    modalElement = null;

    if (window.addEventListener) {
        window.removeEventListener("blur", handleBlur);
        document.removeEventListener("focus", handleFocus);
    } else {
        (<any>window).detachEvent("onBlur", handleBlur);
        (<any>document).detachEvent("onFocus", handleFocus);
    }
}
