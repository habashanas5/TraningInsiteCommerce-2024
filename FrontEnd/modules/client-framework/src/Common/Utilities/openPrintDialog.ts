import firefoxPrintFix from "@insite/client-framework/Common/Utilities/printFirefox";

const openPrintDialog = () => {
    const firefoxPrintCallback = firefoxPrintFix();
    if (document.queryCommandSupported("print")) {
        document.execCommand("print", false);
    } else {
        window.print();
    }
    firefoxPrintCallback();
};

export default openPrintDialog;
