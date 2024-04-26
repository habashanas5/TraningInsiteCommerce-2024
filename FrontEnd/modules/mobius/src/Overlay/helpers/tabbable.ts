/*!
 * Adapted from jQuery UI core
 *
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

type InterrogatableNode = Node & ParentNode & Partial<HTMLElement>;

const tabbableNode = /input|select|textarea|button|object/;

function hidesContents(element: Node & ParentNode & HTMLElement) {
    const zeroSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;

    // If the node is empty, this is good enough
    if (zeroSize && !element.innerHTML) {
        return true;
    }

    // Otherwise we need to check some styles
    const style = window.getComputedStyle(element);
    return zeroSize ? style.getPropertyValue("overflow") !== "visible" : style.getPropertyValue("display") === "none";
}

function visible(element: InterrogatableNode) {
    let parentElement: InterrogatableNode | null = element;
    while (parentElement) {
        if (parentElement === document.body) {
            break;
        }
        if (hidesContents(parentElement as HTMLElement)) {
            return false;
        }
        parentElement = parentElement.parentNode;
    }
    return true;
}

function focusable(element: InterrogatableNode & { disabled: boolean; href: string }, isTabIndexNotNaN: boolean) {
    const nodeName = element.nodeName.toLowerCase();
    const res =
        (tabbableNode.test(nodeName) && !element.disabled) ||
        (nodeName === "a" ? element.href || isTabIndexNotNaN : isTabIndexNotNaN);
    return res && visible(element);
}

function tabbable(element: HTMLElement) {
    let tabIndex = element.getAttribute("tabindex");
    if (tabIndex === null) {
        tabIndex = null;
    }
    const isTabIndexNaN = typeof tabIndex !== "number" || Number.isNaN(tabIndex);
    return (
        (isTabIndexNaN || Number(tabIndex) >= 0) &&
        focusable(element as InterrogatableNode & { disabled: boolean; href: string }, !isTabIndexNaN)
    );
}

export default function findTabbableDescendants(element: HTMLElement) {
    return [].slice.call(element.querySelectorAll("*"), 0).filter(tabbable);
}
