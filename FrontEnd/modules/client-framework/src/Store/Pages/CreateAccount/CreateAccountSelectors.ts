import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getReturnUrl } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getHomePageUrl, getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";

export function getCreateAccountReturnUrl(state: ApplicationState) {
    const returnUrl = getReturnUrl(state);
    const changeCustomerPageUrl = getPageLinkByPageType(state, "ChangeCustomerPage")?.url;
    const orderConfirmationPageUrl = getPageLinkByPageType(state, "OrderConfirmationPage")?.url;
    const referredFromOrderConfirmationUrl =
        orderConfirmationPageUrl && returnUrl && returnUrl.indexOf(orderConfirmationPageUrl) > -1;
    if (returnUrl === changeCustomerPageUrl || referredFromOrderConfirmationUrl) {
        return getHomePageUrl(state);
    }
    return returnUrl;
}
