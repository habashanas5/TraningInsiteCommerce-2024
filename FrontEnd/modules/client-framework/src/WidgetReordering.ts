import * as React from "react";

let placeholder: HTMLElement | undefined;

export function dropWidgetOnZone(event: React.DragEvent<HTMLElement>, handleDrop: (index: number) => void) {
    let index = 0;
    let previousSibling = placeholder!.previousSibling as HTMLElement;
    while (previousSibling) {
        // we need to skip over the one that we are actually dragging when we calculate index to move the widget to.
        if (previousSibling.getAttribute("data-dragging") === null) {
            index++;
        }

        previousSibling = previousSibling.previousSibling as HTMLElement;
    }

    cleanupAfterDragging();

    event.stopPropagation();
    handleDrop(index);
}

export function cleanupAfterDragging() {
    if (placeholder) {
        placeholder.parentNode!.removeChild(placeholder as HTMLElement);
        placeholder = undefined;
    }
}

let inZone = false;

export function dragLeaveZone(event: React.DragEvent<HTMLElement>) {
    inZone = false;
    setTimeout(() => {
        if (!inZone) {
            placeholder!.style.display = "none";
        }
    }, 100);
}

export function dragWidgetOverZone(event: React.DragEvent<HTMLElement>) {
    inZone = true;
    event.preventDefault();
    event.stopPropagation();

    if (typeof placeholder === "undefined") {
        placeholder = document.createElement("div");
        placeholder.style.position = "relative";
        placeholder.style.width = "100%";
        placeholder.style.pointerEvents = "none";
        const placeholderChild = document.createElement("div");
        placeholderChild.style.backgroundColor = "#888888";
        placeholderChild.style.height = "8px";
        placeholderChild.style.left = "2px";
        placeholderChild.style.right = "2px";
        placeholderChild.style.position = "absolute";
        placeholder.append(placeholderChild);
    }

    placeholder!.style.display = "";

    const theTarget = event.target as HTMLElement;

    const closest = theTarget.closest("[data-widget], [data-zoneplaceholder], [data-zone]") as HTMLElement;
    if (closest) {
        if (closest.getAttribute("data-widget")) {
            const rect = closest.getBoundingClientRect();
            const relY = event.clientY - rect.top;
            const height = (rect.bottom - rect.top) / 2;
            const parent = closest.parentNode as HTMLElement;

            if (relY > height) {
                parent.insertBefore(placeholder, closest.nextElementSibling);
            } else if (relY < height) {
                parent.insertBefore(placeholder, closest);
            }
            return;
        }
        if (closest.getAttribute("data-zone")) {
            for (let x = 0; x < closest.children.length; x++) {
                if (closest.children[x].getAttribute("data-zoneplaceholder")) {
                    closest.childNodes[0].before(placeholder);
                    return;
                }
            }
        }
        closest.appendChild(placeholder);
    }
}
