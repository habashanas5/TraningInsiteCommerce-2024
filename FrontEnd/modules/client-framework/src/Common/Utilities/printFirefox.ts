/**
 * Firefox printing is finicky, and needs flex elements longer than the height of the page to be set to block display
 * this function uses element styles to apply a block display to elements on the page that fall into that category and
 * returns a callback to remove the block styles when printing is finished.
 * original referenced solution https://github.com/jscher2000/printable-print-doctor-extension/
 */
const firefoxPrintFix = () => {
    const blocks = document.querySelectorAll(
        "html,body,*:not(span):not(h1):not(h2):not(h3):not(h4):not(strong):not(em):not(font):not(img)",
    );
    let displayValue = "";
    const blocksToReturn: Element[] = [];
    blocks.forEach(element => {
        const elementStyle = getComputedStyle(element, null);
        if (parseInt(elementStyle.getPropertyValue("height"), 10) > 400) {
            displayValue = elementStyle.getPropertyValue("display");
            if (displayValue !== "block" && displayValue !== "none") {
                element.setAttribute("style", "display: block;");
                blocksToReturn.push(element);
            }
        }
    });
    return () => {
        blocksToReturn.forEach(element => element.removeAttribute("style"));
    };
};

export default firefoxPrintFix;
