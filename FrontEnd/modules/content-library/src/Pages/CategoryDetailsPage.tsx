import setPageMetadata from "@insite/client-framework/Common/Utilities/setPageMetadata";
import { trackPageChange } from "@insite/client-framework/Common/Utilities/tracking";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getSelectedCategoryPath,
    getSettingsCollection,
} from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCatalogPageStateByPath } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesSelectors";
import { getCategoryState } from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import CurrentCategory from "@insite/content-library/Components/CurrentCategory";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect } from "react-redux";

interface State {
    metadataSetForId?: string;
}

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
        location,
        websiteName: state.context.website.name,
        websiteSettings: getSettingsCollection(state).websiteSettings,
    };
};

type Props = PageProps & ReturnType<typeof mapStateToProps>;

class CategoryDetailsPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    UNSAFE_componentWillMount() {
        this.setMetadata();
    }

    componentDidUpdate() {
        const { category } = this.props;
        if (category && category.id !== this.state.metadataSetForId) {
            trackPageChange();
            this.setMetadata();
        }
    }

    setMetadata() {
        const { catalogPageState, category, websiteName, location, websiteSettings } = this.props;
        if (!catalogPageState?.value || !category) {
            return;
        }

        const { metaDescription, metaKeywords, openGraphImage, openGraphTitle, openGraphUrl, title } =
            catalogPageState.value;

        setPageMetadata(
            {
                metaDescription,
                metaKeywords,
                openGraphImage,
                openGraphTitle,
                openGraphUrl,
                currentPath: location.pathname,
                canonicalPath: catalogPageState.value.canonicalPath,
                alternateLanguageUrls: catalogPageState.value.alternateLanguageUrls ?? undefined,
                title: title || category.name,
                websiteName,
            },
            websiteSettings,
        );

        this.setState({
            metadataSetForId: category.id,
        });
    }

    render() {
        return (
            <Page>
                <CurrentCategory>
                    <Zone contentId={this.props.id} zoneName="Content" />
                </CurrentCategory>
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps)(CategoryDetailsPage),
    definition: {
        hasEditableUrlSegment: false,
        hasEditableTitle: true,
        supportsCategorySelection: true,
        pageType: "System",
    },
};

export default pageModule;

export const CategoryDetailsPageContext = "CategoryDetailsPage";
