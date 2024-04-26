import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { createPageElement } from "@insite/client-framework/Components/ContentItemStore";
import { HasShellContext, ShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { loadPageByType } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getLocation, getPageStateByType } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const headerState = getPageStateByType(state, "Header");
    return {
        preventLoading: !!parseQueryString<{ skipHeaderFooter: string }>(getLocation(state).search).skipHeaderFooter,
        header: headerState.value || nullPage,
        isLoading: headerState.isLoading,
    };
};

const mapDispatchToProps = {
    loadPageByType,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext;

class Header extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const props = this.props;
        if (!props.preventLoading && !props.isLoading && props.header.id === "") {
            props.loadPageByType("Header");
        }
    }

    render() {
        const {
            header,
            shellContext: { isInShell },
        } = this.props;
        if (header.id === "") {
            return null;
        }

        return (
            <ShellContext.Provider value={{ isInShell, pageId: header.id }}>
                {createPageElement(header.type, header)}
            </ShellContext.Provider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(Header));
