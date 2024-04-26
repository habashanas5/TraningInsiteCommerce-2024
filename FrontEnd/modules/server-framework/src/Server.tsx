import { Dictionary } from "@insite/client-framework/Common/Types";
import { getFontContent } from "@insite/client-framework/Common/Utilities/fontProcessing";
import { checkIsWebCrawler, setIsWebCrawler } from "@insite/client-framework/Common/WebCrawler";
import {
    serverSiteMessageResolver,
    serverTranslationResolver,
    setDomain,
    setHeaders,
    setIsShareEntity,
    setUrl,
} from "@insite/client-framework/ServerSideRendering";
import { getPageUrlByType } from "@insite/client-framework/Services/ContentService";
import { setResolver } from "@insite/client-framework/SiteMessage";
import { setTranslationResolver } from "@insite/client-framework/Translate";
import diagnostics from "@insite/server-framework/diagnostics";
import getTemplate, { getTemplatePaths } from "@insite/server-framework/getTemplate";
import healthCheck from "@insite/server-framework/healthCheck";
import { pageRenderer } from "@insite/server-framework/PageRenderer";
import { getRelayEndpoints, relayRequest } from "@insite/server-framework/Relay";
import robots from "@insite/server-framework/Robots";
import { shellRenderer } from "@insite/server-framework/ShellRenderer";
import { getAutoUpdatedPageTypes } from "@insite/server-framework/SiteGeneration/PageCreators";
import { Request, Response } from "express";

setResolver(serverSiteMessageResolver);
setTranslationResolver(serverTranslationResolver);

export const shareEntityRoute = "/.spire/shareEntity";

const classicToSpirePageMapping: Dictionary<string> = {
    MyAccountAddressPage: "AddressesPage",
    BrandDetailPage: "BrandDetailsPage",
    BudgetPage: "BudgetManagementPage",
    ChangeAccountPasswordPage: "ChangePasswordPage",
    ReviewAndPayPage: "CheckoutReviewAndSubmitPage",
    CheckoutAddressPage: "CheckoutShippingPage",
    DealerPage: "DealerDetailsPage",
    InvoiceDetailPage: "InvoiceDetailsPage",
    InvoicesPage: "InvoiceHistoryPage",
    DealerLocatorPage: "LocationFinderPage",
    MyListDetailPage: "MyListsDetailsPage",
    OrderApprovalDetailPage: "OrderApprovalDetailsPage",
    OrderDetailPage: "OrderDetailsPage",
    OrdersPage: "OrderHistoryPage",
    ProductComparisonPage: "ProductComparePage",
    ProductDetailPage: "ProductDetailsPage",
    RequisitionPage: "RequisitionsPage",
    JobQuoteDetailsPage: "RfqJobQuoteDetailsPage",
    MyJobQuotesPage: "RfqJobQuotesPage",
    SavedOrderDetailPage: "SavedOrderDetailsPage",
    MySavedPaymentsPage: "SavedPaymentsPage",
    ErrorPage: "UnhandledErrorPage",
};

const redirectTo = async ({ originalUrl, path }: Request, response: Response) => {
    let pageType = path.substr("/RedirectTo/".length);

    const classicToSpirePageMappingKey = Object.keys(classicToSpirePageMapping).find(
        o => o.toLowerCase() === pageType.toLowerCase(),
    );
    if (classicToSpirePageMappingKey) {
        pageType = classicToSpirePageMapping[classicToSpirePageMappingKey];
    }

    const destination = (await getPageUrlByType(pageType)) || "/";
    response.redirect(destination + originalUrl.substring(path.length));
};

type RouteHandler = (request: Request, response: Response) => Promise<void>;

const routes: { path: string | RegExp; handler: RouteHandler; makeLowerCase: boolean }[] = [];

function addRoute(path: RegExp | string, handler: RouteHandler, makeLowerCase = true) {
    routes.push({
        path: typeof path === "string" ? path.toLowerCase() : path,
        handler,
        makeLowerCase,
    });
}

addRoute("/.spire/autoUpdatedPageTypes", getAutoUpdatedPageTypes);
addRoute("/.spire/health", healthCheck);
addRoute("/.spire/diagnostics", diagnostics);
addRoute("/robots.txt", robots, false);
addRoute("/.spire/content/getTemplatePaths", getTemplatePaths);
addRoute("/.spire/content/getTemplate", getTemplate);
addRoute(/^\/sitemap.*\.xml/i, relayRequest);
for (const endpoint of getRelayEndpoints()) {
    addRoute(new RegExp(`^/${endpoint}(\\/|$)`, "i"), relayRequest);
}
addRoute(/^\/redirectTo\//i, redirectTo);
addRoute(/^\/contentAdmin/i, shellRenderer);
addRoute(shareEntityRoute, (request: Request, response: Response) => {
    const tempUrl = new URL(request.body.urlPathToLoadForAttachmentHtml, "https://example.com");
    request.url = tempUrl.pathname + tempUrl.search;
    return pageRenderer(request, response);
});
addRoute("/.spire/fonts/getFont", getFontContent);

export default function server(request: Request, response: Response, domain: Parameters<typeof setDomain>[0]) {
    setupSSR(request, domain);
    setSecurityHeaders(response);

    const loweredPath = request.path.toLowerCase();
    for (const route of routes) {
        if (
            (typeof route.path === "string" && route.path === (route.makeLowerCase ? loweredPath : request.path)) ||
            (typeof route.path !== "string" && loweredPath.match(route.path))
        ) {
            return route.handler(request, response);
        }
    }

    return pageRenderer(request, response);
}

function setupSSR(request: Request, domain: Parameters<typeof setDomain>[0]) {
    setDomain(domain);

    const { headers } = request;
    const ip =
        (headers["x-forwarded-for"] || "").toString().split(",").pop()?.trim() ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress;
    headers["x-forwarded-for"] = ip;
    if (request.originalUrl === shareEntityRoute) {
        setIsShareEntity(true);
        // This request is being "hijacked" and a different request (with a different body) is being sent instead.
        // Because of this, this header needs to be deleted so it's not inaccurate. If it's inaccurate, the web server
        // will throw an exception while trying to parse the body.
        delete headers["content-length"];
    }
    setHeaders(headers);

    setIsWebCrawler(checkIsWebCrawler(headers["user-agent"] as string));

    const protocol = headers["x-forwarded-proto"]?.toString().toLowerCase() === "https" ? "https" : request.protocol;
    setUrl(`${protocol}://${request.get("host")}${request.originalUrl}`);
}

function setSecurityHeaders(response: Response) {
    response.setHeader("X-Content-Type-Options", "nosniff");
}
