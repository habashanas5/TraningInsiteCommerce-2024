import { contentModeCookieName, isSiteInShellCookieName } from "@insite/client-framework/Common/ContentMode";
import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import { getValueCaseInsensitive, SafeDictionary } from "@insite/client-framework/Common/Types";
import { checkIsWebCrawler, setIsWebCrawler } from "@insite/client-framework/Common/WebCrawler";
import { ShellContext } from "@insite/client-framework/Components/IsInShell";
import PreviewLogin from "@insite/client-framework/Components/PreviewLogin";
import SessionLoader from "@insite/client-framework/Components/SessionLoader";
import SpireRouter from "@insite/client-framework/Components/SpireRouter";
import logger from "@insite/client-framework/Logger";
import { getContentByVersionPath, getTheme } from "@insite/client-framework/Services/ContentService";
import { setResolver } from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { configureStore } from "@insite/client-framework/Store/ConfigureStore";
import { theme as defaultTheme } from "@insite/client-framework/Theme";
import { postStyleGuideTheme, preStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration";
import translate, { setTranslationResolver } from "@insite/client-framework/Translate";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import merge from "lodash/merge";
import * as React from "react";
import { hydrate, render, Renderer } from "react-dom";
import { Provider } from "react-redux";
import "whatwg-fetch";

/**
 * To debug potentially unnecessary rendering, import "@welldone-software/why-did-you-render": "^4.2.5" in
 * client-framework and frontend. Then attach why-did-you-render to your component as follows:
 *    * class component, inside the component add `static whyDidYouRender = true;`
 *    * functional component, after the component add `ComponentName.whyDidYouRender = true;`
 */
// if (process.env.NODE_ENV !== "production") {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const whyDidYouRender = require("@welldone-software/why-did-you-render");
//     whyDidYouRender(React, { exclude: [/^ConnectFunction/], trackHooks: true });
// }

type customWindow = {
    siteMessages: SafeDictionary<string>;
    translationDictionaries: SafeDictionary<string>;
    initialReduxState: ApplicationState;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const theWindow = window as any as customWindow;

setResolver(messageName => getValueCaseInsensitive(theWindow.siteMessages, messageName));
setTranslationResolver(keyword => getValueCaseInsensitive(theWindow.translationDictionaries, keyword));

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = theWindow.initialReduxState;
const store = configureStore(initialState);

async function renderApp(renderer: Renderer = render) {
    let WrappingContext: React.FC = ({ children }) => <>{children}</>;
    let isInShell = false;
    try {
        isInShell =
            !!window && window.parent && window.parent.location.toString().toLowerCase().indexOf("/contentadmin/") > 0;
    } catch (error) {
        // ignore this, it means we can't access the parent which means we aren't in CMS
    }

    if (isInShell) {
        logger.debug("CMS shell detected.");
        if (window.location.pathname.startsWith(getContentByVersionPath)) {
            logger.debug("Suppressing shell wrapper due to GetContentByVersion request.");
        } else {
            setCookie(isSiteInShellCookieName, "true");
            const isEditing = getCookie(contentModeCookieName) === "Editing";

            const ShellWrappingContext: React.FC = ({ children }) => (
                <ShellContext.Provider value={{ isEditing, isCurrentPage: true, isInShell: true }}>
                    {children}
                </ShellContext.Provider>
            );

            WrappingContext = ShellWrappingContext;
        }
    } else if (getCookie(isSiteInShellCookieName)) {
        if (window.location.pathname === "/") {
            // TODO ISC-12274 get rid of this to see if the problem exists
            window.location.href = "/ContentAdmin/Page";
        } else {
            window.location.href = `/ContentAdmin/Page/SwitchTo${window.location.pathname}${window.location.search}`;
        }
        renderer(<></>, document.getElementById("react-app"));
    } else {
        setIsWebCrawler(checkIsWebCrawler(navigator.userAgent));
    }

    const theme = await fetchThenMergeTheme();
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.
    // Changes here must be mirrored to the storefront section in Server.tsx so the render output matches.
    renderer(
        <Provider store={store}>
            <WrappingContext>
                <ThemeProvider theme={theme} createGlobalStyle={true} createChildGlobals={false} translate={translate}>
                    <SessionLoader location={{ pathname: window.location.pathname, search: window.location.search }}>
                        <PreviewLogin>
                            <SpireRouter />
                        </PreviewLogin>
                    </SessionLoader>
                </ThemeProvider>
            </WrappingContext>
        </Provider>,
        document.getElementById("react-app"),
    );
}

renderApp(initialState ? hydrate : render);

/**
 * The theme object must be put together on the frontend because running JSON.stringify() serverside was ignoring components passed to iconSrcByMessage,
 * which is a property found on the Toast component.
 * This function's returned theme object replaces the intialTheme, which was serverside and later accessed on the global window object on the browser
 */
async function fetchThenMergeTheme(): Promise<BaseTheme> {
    try {
        return merge({}, defaultTheme, preStyleGuideTheme, await getTheme(), postStyleGuideTheme);
    } catch (e) {
        logger.error(e);
    }
    return defaultTheme;
}
