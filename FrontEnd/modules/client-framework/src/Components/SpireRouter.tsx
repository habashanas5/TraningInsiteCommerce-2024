import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import PublicPage from "@insite/client-framework/Components/PublicPage";
import ShellHoleConnect from "@insite/client-framework/Components/ShellHoleConnect";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { loadPage } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getLocation, getPageStateByPath } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import { AnyAction } from "@insite/client-framework/Store/Reducers";
import Toaster from "@insite/mobius/Toast/Toaster";
import HistoryContext from "@insite/mobius/utilities/HistoryContext";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const currentPageState = getPageStateByPath(state, location.pathname);
    return {
        pageLinks: state.links.pageLinks,
        areLinksLoading: state.links.areLinksLoading,
        currentPage: currentPageState.value || nullPage,
        isCurrentPageLoading: currentPageState.isLoading,
        location,
    };
};

const setLocation = (location: Location): AnyAction => ({
    type: "Data/Pages/SetLocation",
    location,
});

const mapDispatchToProps = {
    loadPage,
    setBreadcrumbs,
    loadPageLinks,
    setLocation,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext;

const scrollPositionsKey = "scrollPositions";

class SpireRouter extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const {
            loadPage,
            loadPageLinks,
            pageLinks,
            currentPage,
            setBreadcrumbs,
            location,
            areLinksLoading,
            isCurrentPageLoading,
        } = this.props;

        const windowIfDefined = typeof window === "undefined" ? undefined : (window as any);
        if (windowIfDefined) {
            windowIfDefined.onpopstate = () => {
                const { search, pathname } = windowIfDefined.location;
                if (pathname !== location.pathname) {
                    loadPage({ pathname, search }, this.historyContext.history, () => {
                        setBreadcrumbs({ links: undefined });
                    });
                } else {
                    this.setLocation(pathname, search);
                }
            };
        }

        if (currentPage === nullPage && !isCurrentPageLoading) {
            loadPage(location, this.historyContext.history);
        }

        if (pageLinks.length === 0 && !areLinksLoading) {
            loadPageLinks();
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.location !== prevProps.location) {
            this.retainScrollPosition(this.props.location.pathname, prevProps.location.pathname);
            setTimeout(() => this.restoreScrollPosition());
        }
    }

    retainScrollPosition = (newPath: string, prevPath: string) => {
        const scrollPositions: SafeDictionary<number> = {};
        const scrollPos = JSON.parse(sessionStorage.getItem(scrollPositionsKey) || "{}");
        if (scrollPos && scrollPos[newPath]) {
            scrollPositions[newPath] = scrollPos[newPath];
        }

        scrollPositions[prevPath] = window.scrollY;
        sessionStorage.setItem(scrollPositionsKey, JSON.stringify(scrollPositions));
    };

    restoreScrollPosition = () => {
        const scrollPositions = JSON.parse(sessionStorage.getItem(scrollPositionsKey) || "{}");
        if (!scrollPositions || !scrollPositions[this.props.location.pathname]) {
            window.scrollTo(0, 0);
            return;
        }

        window.scrollTo(0, scrollPositions[this.props.location.pathname]);
    };

    updateLocation = (url: string, state: unknown, action: (state: unknown, title: string, url: string) => void) => {
        const { pathname, search } = convertToLocation(url);

        if (pathname === this.props.location.pathname) {
            action(state, "", url);
            this.setLocation(pathname, search);
        } else {
            this.props.loadPage({ pathname, search }, this.historyContext.history, () => {
                action(state, "", url);
                this.props.setBreadcrumbs({ links: undefined });
            });
        }
    };

    push = (url: string, state?: unknown) => {
        this.updateLocation(url, state, (state: unknown, title: string, url: string) =>
            window.history.pushState(state, title, url),
        );
    };

    replace = (url: string, state?: unknown) => {
        this.updateLocation(url, state, (state: unknown, title: string, url: string) =>
            window.history.replaceState(state, title, url),
        );
    };

    setLocation = (pathname: string, search: string) => {
        this.props.setLocation({
            pathname,
            search,
        });
    };

    historyContext = {
        history: {
            push: this.push,
            replace: this.replace,
        },
    };

    render() {
        return (
            <>
                {this.props.shellContext.isInShell && <ShellHoleConnect history={this.historyContext.history} />}
                <Toaster>
                    <HistoryContext.Provider value={this.historyContext}>
                        <PublicPage />
                    </HistoryContext.Provider>
                </Toaster>
            </>
        );
    }
}

export interface Location {
    pathname: string;
    search: string;
    state?: unknown;
}

export function convertToLocation(url: string): Location {
    const indexOf = url.indexOf("?");
    return {
        pathname: indexOf > -1 ? url.substring(0, indexOf) : url,
        search: indexOf > -1 ? url.substring(indexOf) : "",
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(SpireRouter));
