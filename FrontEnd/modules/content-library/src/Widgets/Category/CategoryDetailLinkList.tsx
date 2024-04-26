import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCategoryState } from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CategoryDetailsPageContext } from "@insite/content-library/Pages/CategoryDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps & HasCategoryContext;

export interface CategoryDetailLinkListStyles {
    container?: GridContainerProps;
    subCategoryNameLinkItem?: GridItemProps;
    subCategoryNameLink?: LinkPresentationProps;
}

export const categoryDetailLinkListStyles: CategoryDetailLinkListStyles = {
    container: {
        gap: 0,
    },
    subCategoryNameLinkItem: {
        width: 12,
        css: css`
            padding-bottom: 10px;
        `,
    },
};

const styles = categoryDetailLinkListStyles;

const CategoryDetailLinkList = ({ category }: Props) => {
    if (!category || !category.subCategoryIds || category.subCategoryIds.length === 0) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            {category.subCategoryIds.map(subCategoryId => (
                <GridItem key={subCategoryId.toString()} {...styles.subCategoryNameLinkItem}>
                    <SubCategoryLink subCategoryId={subCategoryId} />
                </GridItem>
            ))}
        </GridContainer>
    );
};

const mapStateToProps = (state: ApplicationState, ownProps: { subCategoryId: string }) => {
    return {
        category: getCategoryState(state, ownProps.subCategoryId).value,
    };
};

const SubCategoryLinkView = ({ category }: ReturnType<typeof mapStateToProps>) => {
    if (!category) {
        return null;
    }

    return (
        <Link
            href={category.path}
            {...styles.subCategoryNameLink}
            data-test-selector={`categoryDetailsLinkListLink_${category.id}`}
        >
            {category.shortDescription}
        </Link>
    );
};

const SubCategoryLink = connect(mapStateToProps)(SubCategoryLinkView);

const widgetModule: WidgetModule = {
    component: withCategory(CategoryDetailLinkList),
    definition: {
        group: "Categories",
        icon: "LinkList",
        allowedContexts: [CategoryDetailsPageContext],
    },
};

export default widgetModule;
