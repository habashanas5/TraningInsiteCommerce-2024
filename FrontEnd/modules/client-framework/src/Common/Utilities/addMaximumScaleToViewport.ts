export default function addMaximumScaleToViewport() {
    const metaViewportLine = document.querySelector("meta[name=viewport]");

    if (metaViewportLine !== null) {
        let content: any = metaViewportLine.getAttribute("content");
        const re = /maximum\-scale=[0-9\.]+/g;

        if (re.test(content)) {
            content = content.replace(re, "maximum-scale=1.0");
        } else {
            content = [content, "maximum-scale=1.0"].join(", ");
        }

        metaViewportLine.setAttribute("content", content);
    }
}
