import setPageMetadata from "@insite/client-framework/Common/Utilities/setPageMetadata";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getSelectedBrandPath, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    BrandCategoriesStateContext,
    BrandProductLinesStateContext,
    BrandStateContext,
    getBrandCategoriesDataView,
    getBrandProductLinesDataView,
    getBrandStateByPath,
} from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import loadBrandByPath from "@insite/client-framework/Store/Data/Brands/Handlers/LoadBrandByPath";
import loadBrandCategories from "@insite/client-framework/Store/Data/Brands/Handlers/LoadBrandCategories";
import loadBrandProductLines from "@insite/client-framework/Store/Data/Brands/Handlers/LoadBrandProductLines";
import {
    getAlternateLanguageUrls,
    getCurrentPage,
    getLocation,
} from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import { generateLinksFrom } from "@insite/content-library/Components/PageBreadcrumbs";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { pathname } = getLocation(state);
    const brandPath = getSelectedBrandPath(state) || pathname;
    const homePageUrl = getHomePageUrl(state);
    let shouldLoadBrandCategories;
    let shouldLoadBrandProductLine;

    const brandState = getBrandStateByPath(state, brandPath);
    const brandCategoriesParameter = {
        brandId: brandState.value?.id || "",
        page: 1,
        pageSize: 1000,
        sort: "name",
        maximumDepth: 2,
    };
    const brandCategoriesDataView = getBrandCategoriesDataView(state, brandCategoriesParameter);
    const brandProductLinesParameter = {
        brandId: brandState.value?.id || "",
        page: 1,
        pageSize: 1000,
        sort: "name",
        getFeatured: true,
    };
    const brandProductLinesDataView = getBrandProductLinesDataView(state, brandProductLinesParameter);
    const page = getCurrentPage(state);

    if (!brandState.isLoading && brandState.value) {
        shouldLoadBrandCategories = !brandCategoriesDataView.isLoading && !brandCategoriesDataView.value;
        shouldLoadBrandProductLine = !brandProductLinesDataView.isLoading && !brandProductLinesDataView.value;
    }

    return {
        brandState,
        brandCategoriesParameter,
        brandCategoriesDataView,
        brandProductLinesParameter,
        brandProductLinesDataView,
        brandPath,
        homePageUrl,
        parentNodeId: page.parentId,
        links: state.links,
        shouldLoadBrand: !brandState.isLoading && !brandState.value,
        breadcrumbLinks: state.components.breadcrumbs.links,
        shouldLoadBrandCategories,
        shouldLoadBrandProductLine,
        websiteName: state.context.website.name,
        websiteSettings: getSettingsCollection(state).websiteSettings,
        alternateLanguageUrls: getAlternateLanguageUrls(state, page.id),
    };
};

const mapDispatchToProps = {
    loadBrandByPath,
    loadBrandCategories,
    loadBrandProductLines,
    setBreadcrumbs,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & PageProps & ReturnType<typeof mapStateToProps>;

interface State {
    metadataSetForId?: string;
}

class BrandDetailsPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    private checkState(prevProps?: Props) {
        const {
            brandState,
            brandPath,
            shouldLoadBrand,
            shouldLoadBrandProductLine,
            shouldLoadBrandCategories,
            loadBrandCategories,
            loadBrandProductLines,
            loadBrandByPath,
            brandCategoriesParameter,
            brandProductLinesParameter,
            setBreadcrumbs,
            breadcrumbLinks,
        } = this.props;

        if (shouldLoadBrand && brandPath) {
            loadBrandByPath({ path: brandPath });
        }
        if (brandState.value && shouldLoadBrandCategories) {
            loadBrandCategories(brandCategoriesParameter);
        }
        if (brandState.value && shouldLoadBrandProductLine) {
            loadBrandProductLines(brandProductLinesParameter);
        }

        if (
            (brandState.value && !breadcrumbLinks) ||
            (prevProps && brandState.value?.id !== prevProps.brandState?.value?.id)
        ) {
            const links = generateLinksFrom(this.props.links, this.props.parentNodeId, this.props.homePageUrl);
            links.push({ children: this.props.brandState.value?.name });
            setBreadcrumbs({ links });
        }
    }

    UNSAFE_componentWillMount(): void {
        this.checkState();
        this.setMetadata();
    }

    componentDidUpdate(prevProps: Props) {
        this.checkState(prevProps);

        const { brandState } = this.props;
        if (brandState.value && brandState.value.id !== this.state.metadataSetForId) {
            this.setMetadata();
        }
    }

    setMetadata() {
        const {
            brandState: { value: brand },
            websiteName,
            brandPath,
            websiteSettings,
            alternateLanguageUrls,
        } = this.props;
        if (!brand) {
            return;
        }

        setPageMetadata(
            {
                metaDescription: brand.metaDescription,
                currentPath: brandPath,
                title: brand.pageTitle || brand.name,
                websiteName,
                alternateLanguageUrls,
            },
            websiteSettings,
        );

        this.setState({
            metadataSetForId: brand.id,
        });
    }

    render() {
        return (
            <Page>
                <BrandStateContext.Provider value={this.props.brandState}>
                    <BrandCategoriesStateContext.Provider value={this.props.brandCategoriesDataView}>
                        <BrandProductLinesStateContext.Provider value={this.props.brandProductLinesDataView}>
                            <Zone contentId={this.props.id} zoneName="Content" />
                        </BrandProductLinesStateContext.Provider>
                    </BrandCategoriesStateContext.Provider>
                </BrandStateContext.Provider>
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(BrandDetailsPage),
    definition: {
        hasEditableUrlSegment: false,
        hasEditableTitle: true,
        supportsBrandSelection: true,
        pageType: "System",
    },
};

export default pageModule;

export const BrandDetailsPageContext = "BrandDetailsPage";
