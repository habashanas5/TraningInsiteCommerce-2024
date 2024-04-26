/* eslint-disable spire/export-styles */
import { getIsWebCrawler } from "@insite/client-framework/Common/WebCrawler";
import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CategoryDetailsPageContext } from "@insite/content-library/Pages/CategoryDetailsPage";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Typography from "@insite/mobius/Typography";
import * as React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    currentPage: getCurrentPage(state),
});

type Props = WidgetProps & HasCategoryContext & ReturnType<typeof mapStateToProps>;

const CategoryName = ({ category, currentPage }: Props) => {
    if (!category) {
        return null;
    }

    const isSearchCrawler = getIsWebCrawler();

    return (
        <Typography variant={isSearchCrawler && currentPage.type === "CategoryDetailsPage" ? "h1" : "h2"}>
            {category.name}
        </Typography>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withCategory(CategoryName)),
    definition: {
        group: "Categories",
        icon: "PageTitle",
        allowedContexts: [CategoryDetailsPageContext, ProductDetailsPageContext, ProductListPageContext],
    },
};

export default widgetModule;
