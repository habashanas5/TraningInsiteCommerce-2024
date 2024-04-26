import * as React from "react";

export default function getBoldedText(text: string, highlight: string) {
    // Split on highlight term and include term into parts, ignore case
    const regex = new RegExp(`(${highlight})`, "gi");
    if (regex.exec(text)) {
        const parts = text.split(regex);
        return <span>{parts.map(part => (regex.exec(part) ? <b>{part}</b> : part))}</span>;
    }

    return <>{text}</>;
}
