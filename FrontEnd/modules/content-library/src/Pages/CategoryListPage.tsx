import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCategoriesDataView } from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import loadCategories from "@insite/client-framework/Store/Data/Categories/Handlers/LoadCategories";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const categoriesDataView = getCategoriesDataView(state);
    return {
        shouldLoadCategories: !categoriesDataView.value && !categoriesDataView.isLoading,
    };
};

const mapDispatchToProps = {
    loadCategories,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

class CategoryListPage extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const { shouldLoadCategories, loadCategories } = this.props;
        if (shouldLoadCategories) {
            loadCategories();
        }
    }

    render() {
        return (
            <Page>
                <Zone contentId={this.props.id} zoneName="Content" />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CategoryListPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const CategoryListPageContext = "CategoryListPage";
