import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { initializeSiteHole } from "@insite/client-framework/Components/ShellHole";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    selectBrand,
    selectCategory,
    selectProduct,
    setCMSPermissions,
    setSearchDataModeActive,
} from "@insite/client-framework/Store/Context/ContextActionCreators";
import setLanguage from "@insite/client-framework/Store/Context/Handlers/SetLanguage";
import {
    beginDraggingWidget,
    endDraggingWidget,
    resetPageDataViews,
    setPageDefinitions,
    updatePage,
} from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import { PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { cleanupAfterDragging } from "@insite/client-framework/WidgetReordering";
import { History } from "@insite/mobius/utilities/HistoryContext";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    history: History;
}

const mapStateToProps = (state: ApplicationState) => ({
    page: getCurrentPage(state),
});

const mapDispatchToProps = {
    beginDraggingWidget,
    endDraggingWidget,
    setLanguage,
    selectProduct,
    selectCategory,
    selectBrand,
    loadPageLinks,
    setCMSPermissions,
    setPageDefinitions,
    resetPageDataViews,
    setSearchDataModeActive,
    updatePage,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

interface MainNavigation {
    close: () => void;
    openMenu: (index: number) => void;
}

let mainNavigation: MainNavigation;

export const setMainNavigation = (value: MainNavigation) => {
    mainNavigation = value;
};

class ShellHoleProvider extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        initializeSiteHole({
            LoadUrl: ({ url }: { url: string }) => {
                props.history.push(url);
            },
            UpdatePage: ({ page }: { page: PageModel }) => {
                this.props.updatePage(page);
            },
            BeginDraggingWidget: ({ id }: { id: string }) => {
                this.props.beginDraggingWidget(id);
            },
            EndDraggingWidget: () => {
                cleanupAfterDragging();
                this.props.endDraggingWidget();
            },
            ChangeLanguage: ({ languageId }: { languageId: string }) => {
                this.props.setLanguage({ languageId });
            },
            SelectProduct: ({ productPath }: { productPath: string }) => {
                this.props.selectProduct(productPath);
            },
            SelectCategory: ({ categoryPath }: { categoryPath: string }) => {
                this.props.selectCategory(categoryPath);
            },
            SelectBrand: ({ brandPath }: { brandPath: string }) => {
                this.props.selectBrand(brandPath);
            },
            CloseMainNavigation: () => {
                mainNavigation?.close();
            },
            OpenMainNavigation: ({ index }: { index: number }) => {
                mainNavigation?.openMenu(index);
            },
            Reload: () => {
                window.location.reload();
            },
            ReloadPageLinks: () => {
                this.props.loadPageLinks();
            },
            ResetPageDataViews: () => {
                this.props.resetPageDataViews();
            },
            CMSPermissions: ({
                permissions,
                canChangePage,
            }: {
                permissions: PermissionsModel;
                canChangePage: boolean;
            }) => {
                this.props.setCMSPermissions(permissions, canChangePage);
            },
            PageDefinitions: ({
                pageDefinitionsByType,
            }: {
                pageDefinitionsByType: SafeDictionary<Pick<PageDefinition, "pageType">>;
            }) => {
                this.props.setPageDefinitions(pageDefinitionsByType);
            },
            SearchDataModeActive: ({ active }: { active: boolean }) => {
                this.props.setSearchDataModeActive(active);
            },
        });
    }

    render() {
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShellHoleProvider);
