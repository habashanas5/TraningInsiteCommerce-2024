/* eslint-disable spire/export-styles */
import { CategoryContext } from "@insite/client-framework/Components/CategoryContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getSelectedCategoryPath } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCatalogPageStateByPath } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesSelectors";
import loadCatalogPageByPath from "@insite/client-framework/Store/Data/CatalogPages/Handlers/LoadCatalogPageByPath";
import { getCategoryState } from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const categoryPath =
        getSelectedCategoryPath(state) ||
        (location.pathname.toLowerCase().startsWith("/content/") ? "" : location.pathname);
    const catalogPageState = getCatalogPageStateByPath(state, categoryPath);

    return {
        catalogPageState,
        category: getCategoryState(
            state,
            catalogPageState.value?.categoryIdWithBrandId ?? catalogPageState.value?.categoryId,
        ).value,
        categoryPath,
        breadcrumbLinks: state.components.breadcrumbs.links,
        location: getLocation(state),
    };
};

const mapDispatchToProps = {
    loadCatalogPageByPath,
    setBreadcrumbs,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class CurrentCategory extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const { categoryPath, catalogPageState } = this.props;
        if (!catalogPageState.value) {
            if (categoryPath && !catalogPageState.isLoading) {
                this.props.loadCatalogPageByPath({ path: categoryPath });
            }
        } else if (
            this.props.breadcrumbLinks?.map(o => o.children?.toString()).join(",") !==
            catalogPageState.value.breadCrumbs?.map(o => o.text).join(",")
        ) {
            this.setBreadcrumbs();
        }
    }

    componentDidUpdate(prevProps: Props): void {
        const { categoryPath, catalogPageState } = this.props;
        if (!catalogPageState.value) {
            if (categoryPath && !catalogPageState.isLoading) {
                this.props.loadCatalogPageByPath({ path: categoryPath });
            }
        } else if (
            catalogPageState.value.breadCrumbs &&
            (prevProps.catalogPageState.value !== catalogPageState.value || !this.props.breadcrumbLinks)
        ) {
            this.setBreadcrumbs();
        }
    }

    setBreadcrumbs() {
        this.props.setBreadcrumbs({
            links: this.props.catalogPageState.value!.breadCrumbs!.map(o => ({ children: o.text, href: o.url })),
        });
    }

    render() {
        if (!this.props.catalogPageState.value) {
            return this.props.children;
        }

        return <CategoryContext.Provider value={this.props.category}>{this.props.children}</CategoryContext.Provider>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentCategory);
