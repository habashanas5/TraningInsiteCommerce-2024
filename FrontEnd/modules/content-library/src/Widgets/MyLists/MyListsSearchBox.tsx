import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import updateLoadParameter from "@insite/client-framework/Store/Pages/MyLists/Handlers/UpdateLoadParameter";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyListsPageContext } from "@insite/content-library/Pages/MyListsPage";
import Search from "@insite/mobius/Icons/Search";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => {
    return {
        query: state.pages.myLists.getWishListsParameter.query,
    };
};

const mapDispatchToProps = {
    updateLoadParameter,
    loadWishLists,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface MyListsSearchBoxStyles {
    search?: TextFieldProps;
}

export const searchBoxStyles: MyListsSearchBoxStyles = {
    search: {
        iconProps: { src: Search },
    },
};

interface MyListsSearchBoxState {
    query?: string;
}

const styles = searchBoxStyles;

class MyListsSearchBox extends React.Component<Props, MyListsSearchBoxState> {
    searchTimeoutId: number | undefined;

    constructor(props: Props) {
        super(props);
        this.state = {
            query: props.query,
        };
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>, props: Props) => {
        if (typeof this.searchTimeoutId === "number") {
            clearTimeout(this.searchTimeoutId);
        }

        const query = event.currentTarget.value;
        this.setState({ query });

        this.searchTimeoutId = setTimeout(() => {
            props.updateLoadParameter({ query });
        }, 250);
    };

    render() {
        return (
            <TextField
                data-test-selector="myListsSearchByName"
                placeholder={translate("Search lists by name")}
                {...styles.search}
                value={this.state.query}
                onChange={(event: React.FormEvent<HTMLInputElement>) => this.handleChange(event, this.props)}
            ></TextField>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsSearchBox),
    definition: {
        group: "My Lists",
        displayName: "Search Box",
        allowedContexts: [MyListsPageContext],
    },
};

export default widgetModule;
