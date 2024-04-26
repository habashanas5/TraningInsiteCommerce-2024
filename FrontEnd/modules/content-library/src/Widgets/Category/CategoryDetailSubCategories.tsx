import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCategoryState } from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CategoryDetailsPageContext } from "@insite/content-library/Pages/CategoryDetailsPage";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const enum fields {
    showImages = "showImages",
}

interface Props extends WidgetProps, HasCategoryContext {}

export interface CategoryDetailSubCategoriesStyles {
    container?: GridContainerProps;
    subCategoryItem?: GridItemProps;
    innerContainer?: GridContainerProps;
    subCategoryImageItem?: GridItemProps;
    subCategoryImageClickable?: ClickablePresentationProps;
    subCategoryImage?: LazyImageProps;
    subCategoryNameLinkItem?: GridItemProps;
    subCategoryNameLink?: LinkPresentationProps;
}

export const categoryDetailSubCategoriesStyles: CategoryDetailSubCategoriesStyles = {
    container: {
        gap: 0,
    },
    subCategoryItem: {
        width: [12, 12, 4, 4, 2],
        css: css`
            padding-bottom: 30px;
        `,
    },
    innerContainer: {
        gap: 0,
    },
    subCategoryImageItem: {
        width: [2, 2, 12, 12, 12],
        css: css`
            width: 100%;
            padding: 0 8px 8px 8px;
        `,
    },
    subCategoryImageClickable: {
        css: css`
            width: 100%;
        `,
    },
    subCategoryImage: {
        css: css`
            img {
                height: 100%;
            }
        `,
    },
    subCategoryNameLinkItem: {
        width: [10, 10, 12, 12, 12],
        css: css`
            padding-bottom: 8px;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    null,
                    null,
                    css`
                        justify-content: center;
                    `,
                    css`
                        justify-content: center;
                    `,
                    css`
                        justify-content: center;
                    `,
                ])}
        `,
    },
    subCategoryNameLink: {
        css: css`
            width: 100%;
        `,
        color: "text.main",
        typographyProps: {
            weight: "bold",
            css: css`
                width: 100%;
                text-align: center;
                word-wrap: break-word;
            `,
        },
    },
};

const styles = categoryDetailSubCategoriesStyles;

const CategoryDetailSubCategories = ({ category, fields: { showImages } }: Props) => {
    if (!category || !category.subCategoryIds || category.subCategoryIds.length === 0) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            {category.subCategoryIds.map(subCategoryId => (
                <GridItem key={subCategoryId} {...styles.subCategoryItem}>
                    <SubCategoryLink categoryId={subCategoryId} showImages={showImages} />
                </GridItem>
            ))}
        </GridContainer>
    );
};

const SubCategoryLinkView = ({
    category,
    showImages,
}: ReturnType<typeof mapStateToProps> & { showImages: boolean }) => {
    if (!category) {
        return null;
    }

    return (
        <GridContainer {...styles.innerContainer}>
            {showImages && (
                <GridItem {...styles.subCategoryImageItem}>
                    {category.smallImagePath && (
                        <Clickable href={category.path} {...styles.subCategoryImageClickable}>
                            <LazyImage
                                src={category.smallImagePath}
                                altText={category.imageAltText}
                                {...styles.subCategoryImage}
                            />
                        </Clickable>
                    )}
                </GridItem>
            )}
            <GridItem {...styles.subCategoryNameLinkItem}>
                <Link
                    href={category.path}
                    {...styles.subCategoryNameLink}
                    data-test-selector={`categoryDetailsSubCategoriesLink_${category.id}`}
                >
                    {category.shortDescription}
                </Link>
            </GridItem>
        </GridContainer>
    );
};

const mapStateToProps = (state: ApplicationState, ownProps: { categoryId: string }) => ({
    category: getCategoryState(state, ownProps.categoryId).value,
});

const SubCategoryLink = connect(mapStateToProps)(SubCategoryLinkView);

const widgetModule: WidgetModule = {
    component: withCategory(CategoryDetailSubCategories),
    definition: {
        group: "Categories",
        icon: "LinkList",
        fieldDefinitions: [
            {
                name: fields.showImages,
                displayName: "Show Images",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 1,
            },
        ],
        allowedContexts: [CategoryDetailsPageContext],
    },
};

export default widgetModule;
