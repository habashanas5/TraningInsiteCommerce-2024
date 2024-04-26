import findTabbable from "@insite/mobius/Overlay/helpers/tabbable";

export default function scopeTab(node: HTMLElement, event: React.KeyboardEvent<HTMLDivElement>) {
    const tabbable: HTMLElement[] = findTabbable(node);

    if (!tabbable.length) {
        // Do nothing, since there are no elements that can receive focus.
        event.preventDefault();
        return;
    }

    const { shiftKey } = event;
    const head: HTMLElement = tabbable[0];
    const tail: HTMLElement = tabbable[tabbable.length - 1];

    let target;
    // proceed with default browser behavior on tab.
    // Focus on last element on shift + tab.
    if (node === document.activeElement) {
        if (!shiftKey) {
            return;
        }
        target = tail;
    }

    if (tail === document.activeElement && !shiftKey) {
        target = head;
    }

    if (head === document.activeElement && shiftKey) {
        target = tail;
    }

    if (target) {
        event.preventDefault();
        target.focus();
        return;
    }

    // Safari radio issue.
    //
    // Safari does not move the focus to the radio button,
    // so we need to force it to really walk through all elements.
    //
    // This is very error prone, since we are trying to guess
    // if it is a safari browser from the first occurence between
    // chrome or safari.
    //
    // The chrome user agent contains the first ocurrence
    // as the 'chrome/version' and later the 'safari/version'.
    const checkSafari = /(\bChrome\b|\bSafari\b)\//.exec(navigator.userAgent);
    const isSafariDesktop =
        checkSafari != null && checkSafari[1] !== "Chrome" && /\biPod\b|\biPad\b/g.exec(navigator.userAgent) == null;

    // If we are not in safari desktop, let the browser control
    // the focus
    if (!isSafariDesktop) {
        return;
    }

    let x = document.activeElement ? tabbable.indexOf(document.activeElement as HTMLElement) : 0;

    if (x > -1) {
        x += shiftKey ? -1 : 1;
    }

    // If the tabbable element does not exist,
    // focus head/tail based on shiftKey
    if (typeof tabbable[x] === "undefined") {
        event.preventDefault();
        target = shiftKey ? tail : head;
        target.focus();
        return;
    }

    event.preventDefault();

    tabbable[x].focus();
}
