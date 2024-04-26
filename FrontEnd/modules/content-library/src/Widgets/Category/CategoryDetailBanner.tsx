import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CategoryDetailsPageContext } from "@insite/content-library/Pages/CategoryDetailsPage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import * as React from "react";

interface Props extends WidgetProps, HasCategoryContext {}

export interface CategoryDetailBannerStyles {
    container?: InjectableCss;
}

export const bannerStyles: CategoryDetailBannerStyles = {};

const styles = bannerStyles;

const CategoryDetailBanner = ({ category }: Props) => {
    if (!category || !category.htmlContent) {
        return null;
    }

    return <StyledWrapper {...styles.container}>{parse(category.htmlContent, parserOptions)}</StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: withCategory(CategoryDetailBanner),
    definition: {
        group: "Categories",
        icon: "Banner",
        allowedContexts: [CategoryDetailsPageContext],
    },
};

export default widgetModule;
