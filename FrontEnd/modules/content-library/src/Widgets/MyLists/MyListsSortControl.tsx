import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import updateLoadParameter from "@insite/client-framework/Store/Pages/MyLists/Handlers/UpdateLoadParameter";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyListsPageContext } from "@insite/content-library/Pages/MyListsPage";
import Select, { SelectProps } from "@insite/mobius/Select";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
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

export interface MyListsSortControlStyles {
    wrapper?: InjectableCss;
    select?: SelectProps;
}

export const sortControlStyles: MyListsSortControlStyles = {};

const styles = sortControlStyles;

const sortChangeHandler = (event: React.FormEvent<HTMLSelectElement>, props: Props) => {
    props.updateLoadParameter({ sort: event.currentTarget.value });
};

const MyListsSortControl: React.FunctionComponent<Props> = props => {
    return (
        <StyledWrapper {...styles.wrapper}>
            <Select
                data-test-selector="myListsSort"
                {...styles.select}
                onChange={(event: React.FormEvent<HTMLSelectElement>) => sortChangeHandler(event, props)}
            >
                <option value="ModifiedOn DESC">{translate("Last Updated")}</option>
                <option value="Name ASC">{translate("List Name: A-Z")}</option>
                <option value="Name DESC">{translate("List Name: Z-A")}</option>
            </Select>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsSortControl),
    definition: {
        group: "My Lists",
        displayName: "Sort Control",
        allowedContexts: [MyListsPageContext],
    },
};

export default widgetModule;
