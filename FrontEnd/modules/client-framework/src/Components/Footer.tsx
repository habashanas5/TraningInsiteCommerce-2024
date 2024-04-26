import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { createPageElement } from "@insite/client-framework/Components/ContentItemStore";
import { HasShellContext, ShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { loadPageByType } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getFooter, getLocation, getPageStateByType } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const footerState = getPageStateByType(state, "Footer");
    return {
        preventLoading: !!parseQueryString<{ skipHeaderFooter: string }>(getLocation(state).search).skipHeaderFooter,
        footer: footerState.value || nullPage,
        isLoading: footerState.isLoading,
    };
};
const mapDispatchToProps = {
    loadPageByType,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext;

class Footer extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const props = this.props;
        if (!props.preventLoading && !props.isLoading && props.footer.id === "") {
            props.loadPageByType("Footer");
        }
    }

    render() {
        const {
            footer,
            shellContext: { isInShell },
        } = this.props;
        if (footer.id === "") {
            return null;
        }

        return (
            <ShellContext.Provider value={{ isInShell, pageId: footer.id }}>
                {createPageElement(footer.type, footer)}
            </ShellContext.Provider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(Footer));
