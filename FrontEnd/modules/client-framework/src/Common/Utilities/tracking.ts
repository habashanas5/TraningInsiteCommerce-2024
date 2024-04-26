import { Session } from "@insite/client-framework/Services/SessionService";
import { SettingsModel } from "@insite/client-framework/Services/SettingsService";
import { BillToModel, CartModel } from "@insite/client-framework/Types/ApiModels";

let lastTrackedUrl = "";
let lastTrackedSearchTerm = "";

export function getHeadTrackingScript(settings?: SettingsModel, session?: Session) {
    if (!settings?.settingsCollection || !session) {
        return;
    }

    const { googleTrackingTypeComputed, googleTrackingAccountId } = settings.settingsCollection.websiteSettings;
    if (googleTrackingTypeComputed === "GoogleAnalytics") {
        return `
            (function (i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1 * new Date(); a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)})
                (window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
            ga('create', '${googleTrackingAccountId}', 'auto');
            ga('send', 'pageview');
        `;
    }

    if (googleTrackingTypeComputed === "GoogleTagManager") {
        const userId = session && session.userProfileId;
        return `
            dataLayer = [{
                'Authentication State': '${userId ? "Logged In" : "Not Logged In"}',
                'User ID': '${userId || ""}'
            }];
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window, document, 'script', 'dataLayer', '${googleTrackingAccountId}');
            `;
    }

    return null;
}

export function getNoscriptTrackingScript(settings: SettingsModel) {
    if (!settings?.settingsCollection) {
        return;
    }

    const { googleTrackingTypeComputed, googleTrackingAccountId } = settings.settingsCollection.websiteSettings;

    if (googleTrackingTypeComputed === "GoogleTagManager") {
        return `<iframe src="//www.googletagmanager.com/ns.html?id='${googleTrackingAccountId}'" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    }

    return null;
}

// get global for google tag manager
function getDataLayer() {
    return (window as any).dataLayer;
}

// get global for google analytics
function getGa() {
    return (window as any).ga;
}

export function trackPageChange() {
    if (IS_SERVER_SIDE) {
        return;
    }

    const url = window.location.pathname + window.location.search;
    if (url === lastTrackedUrl) {
        return;
    }

    lastTrackedUrl = url;

    const dataLayer = getDataLayer();

    if (dataLayer) {
        dataLayer.push({
            event: "virtualPageView",
            page: {
                title: window.document.title,
                url,
            },
        });
    } else {
        const ga = getGa();
        if (ga) {
            ga("set", "location", url);
            ga("set", "page", window.location.pathname + window.location.search);
            ga("send", "pageview");
        }
    }
}

export function trackSearchResultEvent(searchTerm: string, resultCount: number, correctedSearchTerm?: string) {
    if (IS_SERVER_SIDE || lastTrackedSearchTerm === searchTerm) {
        return;
    }

    lastTrackedSearchTerm = searchTerm;

    const dataLayer = getDataLayer();

    if (dataLayer && searchTerm) {
        dataLayer.push({
            event: "searchResults",
            searchQuery: searchTerm,
            correctedQuery: correctedSearchTerm,
            numSearchResults: resultCount,
            // Clear/Reset data for this layer
            searchTerm: null,
            /* eslint-disable */
            product_numSearchResults: null,
            categories_numSearchResults: null,
            content_numSearchResults: null,
            brands_numSearchResults: null,
            /* eslint-enable */
        });
    }
}

export function trackAutocompleteSearchResultEvent(
    searchEvent: string,
    searchTerm: string,
    resultCount: number,
    productCount?: number,
    categoryCount?: number,
    contentCount?: number,
    brandCount?: number,
) {
    if (IS_SERVER_SIDE || lastTrackedSearchTerm === searchTerm) {
        return;
    }

    lastTrackedSearchTerm = searchTerm;

    const dataLayer = getDataLayer();

    if (dataLayer && searchEvent && searchTerm) {
        dataLayer.push({
            event: searchEvent,
            searchTerm,
            searchQuery: searchTerm,
            correctedQuery: null,
            // It is all products, categories, content, and brands
            numSearchResults: resultCount,
            /* eslint-disable */
            product_numSearchResults: productCount,
            categories_numSearchResults: categoryCount,
            content_numSearchResults: contentCount,
            brands_numSearchResults: brandCount,
            /* eslint-enable */
        });
    }
}

interface TransactionData {
    event: string;
    transactionId: string;
    transactionAffiliation?: string;
    transactionTotal: number;
    transactionTax: number;
    transactionShipping: number;
    transactionProducts: { sku: string; name: string; price?: number; quantity: number | null }[];
}
export function trackCompletedOrder(cart: CartModel, billTo?: BillToModel) {
    if (IS_SERVER_SIDE) {
        return;
    }

    const dataLayer = getDataLayer();
    if (!dataLayer) {
        return;
    }

    const data: TransactionData = {
        event: "transactionComplete",
        transactionId: cart.orderNumber,
        transactionAffiliation: billTo?.companyName,
        transactionTotal: cart.orderGrandTotal,
        transactionTax: cart.totalTax,
        transactionShipping: cart.shippingAndHandling,
        transactionProducts: [],
    };

    cart.cartLines?.forEach(cartLine => {
        data.transactionProducts.push({
            sku: cartLine.erpNumber,
            name: cartLine.shortDescription,
            price: cartLine.pricing?.unitNetPrice,
            quantity: cartLine.qtyOrdered,
        });
    });

    dataLayer.push(data);
}
