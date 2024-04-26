import { contentModeCookieName, isSiteInShellCookieName } from "@insite/client-framework/Common/ContentMode";
import { encodeCookie } from "@insite/client-framework/Common/Cookies";
import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { loadAndParseFontCss } from "@insite/client-framework/Common/Utilities/fontProcessing";
import { getHeadTrackingScript, getNoscriptTrackingScript } from "@insite/client-framework/Common/Utilities/tracking";
import { ShellContext } from "@insite/client-framework/Components/IsInShell";
import PreviewLogin from "@insite/client-framework/Components/PreviewLogin";
import SessionLoader from "@insite/client-framework/Components/SessionLoader";
import SpireRouter, { convertToLocation } from "@insite/client-framework/Components/SpireRouter";
import logger from "@insite/client-framework/Logger";
import {
    getPageMetadata,
    getRedirectTo,
    getStatusCode,
    getTrackedPromises,
    setInitialPage,
    setPromiseAddedCallback,
    setServerSiteMessages,
    setServerTranslations,
    setSessionCookies,
} from "@insite/client-framework/ServerSideRendering";
import { rawRequest } from "@insite/client-framework/Services/ApiService";
import {
    getContentByVersionPath,
    getTheme,
    RetrievePageResult,
} from "@insite/client-framework/Services/ContentService";
import { getSiteMessages, getTranslationDictionaries } from "@insite/client-framework/Services/WebsiteService";
import { processSiteMessages } from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { configureStore as publicConfigureStore } from "@insite/client-framework/Store/ConfigureStore";
import { theme as defaultTheme } from "@insite/client-framework/Theme";
import { postStyleGuideTheme, preStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration";
import translate, { processTranslationDictionaries } from "@insite/client-framework/Translate";
import { LayoutSectionRenderingContext } from "@insite/client-framework/Types/LayoutSectionInjector";
import BodyEnd from "@insite/content-library/LayoutSections/BodyEnd";
import BodyStart from "@insite/content-library/LayoutSections/BodyStart";
import HeadEnd from "@insite/content-library/LayoutSections/HeadEnd";
import HeadStart from "@insite/content-library/LayoutSections/HeadStart";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { shareEntityGenerateFromWebpage } from "@insite/server-framework/InternalService";
import { shareEntityRoute } from "@insite/server-framework/Server";
import { generateSiteIfNeeded } from "@insite/server-framework/SiteGeneration";
import { generateTranslations } from "@insite/server-framework/TranslationGeneration";
import { Request, Response } from "express";
import merge from "lodash/merge";
import qs from "qs";
import * as React from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import setCookie from "set-cookie-parser";
import { ServerStyleSheet } from "styled-components";

let checkedForSiteGeneration = false;
let triedToGenerateTranslations = false;

export async function pageRenderer(request: Request, response: Response) {
    const { websiteIsClassic } = await generateDataIfNeeded(request);
    if (websiteIsClassic) {
        response.send(
            "The current website is configured to be a Classic website and cannot return Spire CMS pages. This data is cached.",
        );
        return;
    }

    const isSiteInShell =
        (request.headers.referer && request.headers.referer.toLowerCase().indexOf("/contentadmin") > 0) ||
        (request.cookies && request.cookies[isSiteInShellCookieName] === "true" && request.query?.editor !== "off");

    let isEditing = false;
    if (isSiteInShell) {
        if (!request.cookies[contentModeCookieName]) {
            response.cookie(contentModeCookieName, "Viewing");
        } else {
            isEditing = request.cookies[contentModeCookieName] === "Editing";
        }

        response.cookie(isSiteInShellCookieName, "true");
    } else {
        response.clearCookie(isSiteInShellCookieName);
    }

    let sheet: ServerStyleSheet | undefined;

    const safeRequest = <T extends unknown>(func: () => Promise<T>, defaultValue: T) => {
        return (async () => {
            try {
                return await func();
            } catch (e) {
                logger.error(e);
            }
            return defaultValue;
        })();
    };

    const getThemePromiseOrDefault = safeRequest(
        async () =>
            request.originalUrl.startsWith(shareEntityRoute)
                ? defaultTheme
                : merge({}, defaultTheme, preStyleGuideTheme, await getTheme(), postStyleGuideTheme),
        defaultTheme,
    );

    const responseCookies = await loadPageAndSetInitialCookies(request, response);

    // in the case of a first page load with no request cookies, we get the default language code from the first response
    let languageCode =
        request.cookies.SetContextLanguageCode ??
        (responseCookies && responseCookies.find(o => o.name === "SetContextLanguageCode")?.value);

    const isGetContentRequest = request.path.startsWith(getContentByVersionPath);
    if (isGetContentRequest) {
        languageCode = qs.parse(request.query).languageId;
    }

    const getSiteMessagesPromise = safeRequest(async () => {
        return processSiteMessages(
            (
                await getSiteMessages({
                    // this null is used to "get base messages" by the api
                    languageCode: languageCode ? `${languageCode},null` : undefined,
                })
            ).siteMessages,
            undefined, // undefined is necessary because languageCode may be a guid or code
        );
    }, {});

    const getTranslationDictionariesPromise = safeRequest(async () => {
        return processTranslationDictionaries(
            (
                await getTranslationDictionaries({
                    languageCode: languageCode || undefined,
                    source: "Label",
                    pageSize: 131072, // 2 ** 17
                })
            ).translationDictionaries,
            undefined, // undefined is necessary because languageCode may be a guid or code
        );
    }, {});

    // Do some work while the API calls above are running.
    let rawHtml = "";
    const store = publicConfigureStore();

    const disableSSR = !!Object.keys(request.query).find(o => o.toLowerCase() === "disablessr");
    const hasAccessToken = !!Object.keys(request.query).find(o => o.toLowerCase() === "access_token");
    const renderStorefrontServerSide = !disableSSR && !hasAccessToken && !isGetContentRequest;

    // Out of other work, wait for API results.
    const [theme, siteMessages, translationDictionaries] = await Promise.all([
        getThemePromiseOrDefault,
        getSiteMessagesPromise,
        getTranslationDictionariesPromise,
    ]);

    const fontFamilyImportUrl = await safeRequest(
        () => loadAndParseFontCss(theme.typography.fontFamilyImportUrl, request.headers["user-agent"]),
        theme.typography.fontFamilyImportUrl,
    );

    if (siteMessages) {
        setServerSiteMessages(siteMessages);
    }

    if (translationDictionaries) {
        setServerTranslations(translationDictionaries);
    }

    if (renderStorefrontServerSide) {
        const renderRawAndStyles = () => {
            sheet = new ServerStyleSheet();

            const value = { isEditing, isCurrentPage: true, isInShell: isSiteInShell };

            // Changes here must be mirrored to the storefront ClientApp.tsx so the render output matches.
            const rawStorefront = (
                <Provider store={store}>
                    <ShellContext.Provider value={value}>
                        <ThemeProvider
                            theme={theme}
                            createGlobalStyle={true}
                            createChildGlobals={false}
                            translate={translate}
                        >
                            <SessionLoader location={convertToLocation(request.url)}>
                                <PreviewLogin>
                                    <SpireRouter />
                                </PreviewLogin>
                            </SessionLoader>
                        </ThemeProvider>
                    </ShellContext.Provider>
                </Provider>
            );

            rawHtml = renderToString(sheet.collectStyles(rawStorefront));
        };

        const redirect = await renderUntilPromisesResolved(request, renderRawAndStyles);

        const statusCode = getStatusCode();
        if (statusCode) {
            response.status(statusCode);
        }

        if (redirect) {
            const redirectStatusCode = statusCode && statusCode >= 300 && statusCode < 400 ? statusCode : 302;
            response.redirect(redirectStatusCode, redirect);
            return;
        }
    }

    const metadata = getPageMetadata();
    const state = store.getState() as ApplicationState;
    const noscriptTrackingScript = getNoscriptTrackingScript(state.context?.settings);
    const headTrackingScript = getHeadTrackingScript(state.context?.settings, state.context?.session);
    const favicon = state.context?.website.websiteFavicon;

    const layoutSectionRenderingContext: LayoutSectionRenderingContext = {
        isInShell: isSiteInShell,
    };

    const app = (rawHtml: string) => (
        <html lang={languageCode}>
            <head>
                {HeadStart(layoutSectionRenderingContext)}
                {/* eslint-disable react/no-danger */}
                {headTrackingScript && <script dangerouslySetInnerHTML={{ __html: headTrackingScript }}></script>}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
                <title>{metadata?.title}</title>
                {favicon && <link rel="icon" href={favicon} type="image/x-icon" />}
                <meta property="og:type" content="website" />
                <meta id="ogTitle" property="og:title" content={metadata?.openGraphTitle} />
                <meta id="ogImage" property="og:image" content={metadata?.openGraphImage} />
                <meta id="ogUrl" property="og:url" content={metadata?.openGraphUrl} />
                <meta name="keywords" content={metadata?.metaKeywords} />
                <meta name="description" content={metadata?.metaDescription} />
                <link rel="canonical" href={metadata?.canonicalUrl} />
                {metadata?.alternateLanguageUrls &&
                    Object.entries(metadata.alternateLanguageUrls).map(([key, value]) => (
                        <link key={key} rel="alternate" hrefLang={key} href={value} />
                    ))}
                <base href="/" />
                <link href={fontFamilyImportUrl} rel="stylesheet" />
                {sheet?.getStyleElement()}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `if (document.domain === "localhost") { document.domain = "localhost"; }`,
                    }}
                ></script>
                <script>{`if (window.parent !== window) {
    try {
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    }
    catch (ex) { }
}`}</script>
                {HeadEnd(layoutSectionRenderingContext)}
                {isGetContentRequest && (
                    <style>
                        #react-app {"{"} pointer-events: none; {"}"}
                    </style>
                )}
            </head>
            <body>
                {BodyStart(layoutSectionRenderingContext)}
                {noscriptTrackingScript && (
                    <noscript dangerouslySetInnerHTML={{ __html: noscriptTrackingScript }}></noscript>
                )}
                <div id="react-app" dangerouslySetInnerHTML={{ __html: rawHtml }}></div>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `try{eval("(async()=>{})()");}catch(e){alert((typeof siteMessages !== 'undefined' && siteMessages.Browser_UnsupportedWarning) || 'This site does not support your current browser. Please update your browser to the most recent version of Chrome, Edge, Safari or Firefox.');}`,
                    }}
                ></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                var translationDictionaries = ${JSON.stringify(translationDictionaries)};
                var siteMessages = ${JSON.stringify(siteMessages)};`,
                    }}
                ></script>
                {renderStorefrontServerSide && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `var initialReduxState = ${JSON.stringify(state)
                                .replace(new RegExp("</", "g"), "<\\/")
                                .replace(new RegExp("<", "g"), "\\u003C")
                                .replace(new RegExp(">", "g"), "\\u003E")}`,
                        }}
                    ></script>
                )}
                {/* eslint-enable react/no-danger */}
                <script async defer src={`/dist/public.js?v=${BUILD_DATE}`} />
                {BodyEnd(layoutSectionRenderingContext)}
            </body>
        </html>
    );

    const renderedApp = `<!DOCTYPE html>${renderToStaticMarkup(app(rawHtml))}`;

    if (request.originalUrl.startsWith(shareEntityRoute)) {
        const { shareEntityModel } = request.body;
        const res = await shareEntityGenerateFromWebpage({
            emailTo: shareEntityModel.emailTo,
            emailFrom: shareEntityModel.emailFrom,
            subject: shareEntityModel.subject,
            message: shareEntityModel.message,
            entityId: shareEntityModel.entityId,
            entityName: shareEntityModel.entityName,
            html: renderedApp,
        });
        response.status(res.status);
        response.send();
    } else {
        response.send(renderedApp);
    }
}

async function renderUntilPromisesResolved(request: Request, renderRawAndStyles: () => void) {
    let redirectToUrl: string | undefined;

    const renderSite = () => {
        renderRawAndStyles();
        redirectToUrl = getRedirectTo();
    };

    const trackedPromises = getTrackedPromises() ?? [];
    let renderLoop = 0;

    renderSite();

    while (trackedPromises.length !== 0 && renderLoop < 10 && !redirectToUrl) {
        renderLoop += 1;
        if (renderLoop > 5) {
            if (renderLoop === 6) {
                setPromiseAddedCallback(stack =>
                    logger.warn(
                        `During SSR of ${request.url} there was a new promise added on loop ${renderLoop}.
This usually indicates a problem with react state management that will affect performance.
The new promise was added at the following location:
${stack}`,
                    ),
                );
            }
        }

        const awaitedPromises: typeof trackedPromises = [];
        while (trackedPromises.length > 0) {
            awaitedPromises.push(trackedPromises.shift()!);
        }

        await Promise.all(awaitedPromises);

        renderSite();
    }
    return redirectToUrl;
}

export interface GenerateDataResponse {
    /** When true, the website is operating in "Classic" mode and can't be used with the Spire CMS. */
    websiteIsClassic?: true;
}

export async function generateDataIfNeeded(request: Request): Promise<GenerateDataResponse> {
    if (
        !checkedForSiteGeneration ||
        !IS_PRODUCTION ||
        request.url.toLowerCase().indexOf("generateIfNeeded=true".toLowerCase()) >= 0
    ) {
        try {
            const generateDataResponse = await generateSiteIfNeeded();
            if (generateDataResponse?.websiteIsClassic) {
                return generateDataResponse;
            }
        } catch (error) {
            if (IS_PRODUCTION) {
                logger.error(`Site generation failed:`, error);
            } else {
                throw error;
            }
        }
        checkedForSiteGeneration = true;
    }

    if (!triedToGenerateTranslations && IS_PRODUCTION) {
        try {
            await generateTranslations();
        } catch (error) {
            logger.error(`Translation generation failed:`, error);
        }
        triedToGenerateTranslations = true;
    }

    return {};
}

let pageByUrlResult: RetrievePageResult;

async function loadPageAndSetInitialCookies(request: Request, response: Response) {
    let pageByUrlResponse;
    try {
        const bypassFilters = request.url.startsWith("/Content/Page/");
        const endpoint = `/api/v2/content/pageByUrl?url=${encodeURIComponent(request.url)}${
            bypassFilters ? "&bypassfilters=true" : ""
        }`;
        const headers: Dictionary<string> = {};
        if (request.headers.referer) {
            headers.referer = request.headers.referer;
        }
        pageByUrlResponse = await rawRequest(endpoint, "GET", headers, undefined);
    } catch (ex) {
        // if this fails just log and continue, the regular way to retrieve the page will deal with sending the user to the unhandled error page.
        logger.error(ex);
    }

    if (pageByUrlResponse) {
        pageByUrlResult = await pageByUrlResponse.json();
        setInitialPage(pageByUrlResult, request.url);

        const existingCookies = request.cookies as SafeDictionary<string>;
        Object.keys(existingCookies).forEach((cookieName: string | number) => {
            existingCookies[cookieName] = encodeCookie(existingCookies[cookieName]!);
        });

        // getAll does exist and is needed to get more than a single set-cookie value
        const responseCookies = setCookie.parse((pageByUrlResponse.headers as any).getAll("set-cookie"));
        const xFrameOptions = pageByUrlResponse.headers.get("X-Frame-Options");
        if (xFrameOptions) {
            response.header("X-Frame-Options", xFrameOptions);
        }
        for (const cookie of responseCookies) {
            const options = {
                path: cookie.path,
                expires: cookie.expires,
                secure: cookie.secure,
                encode: encodeCookie,
            };

            response.cookie(cookie.name, cookie.value, options);
            existingCookies[cookie.name] = cookie.value;
        }

        setSessionCookies(existingCookies);

        return responseCookies;
    }
}
