import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { BrandCategoriesStateContext } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import translate from "@insite/client-framework/Translate";
import { BrandCategoryModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BrandDetailsPageContext } from "@insite/content-library/Pages/BrandDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps, LinkProps } from "@insite/mobius/Link";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    title = "title",
    showImages = "showImages",
    subCategoriesToShow = "subCategoriesToShow",
    gridType = "gridType",
}
interface OwnProps extends WidgetProps {
    fields: {
        [fields.title]: string;
        [fields.showImages]: boolean;
        [fields.subCategoriesToShow]: number;
        [fields.gridType]: string;
    };
}

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = {};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface BrandDetailsCategoriesStyles {
    title?: TypographyProps;
    container?: InjectableCss;
    categoryContainer?: GridContainerProps;
    categoryItemRow?: GridItemProps;
    categoryItemColumn?: GridItemProps;
    innerCategoryContainer?: GridContainerProps;
    categoryImageItem?: GridItemProps;
    categoryImageLink?: LinkPresentationProps;
    categoryImage?: LazyImageProps;
    categoryNameLinkItem?: GridItemProps;
    categoryNameLink?: LinkProps;
    subCategoryItem?: GridItemProps;
    subCategoryLink?: LinkProps;
    viewMoreLinkItem?: GridItemProps;
    viewMoreLink?: LinkProps;
}

export const categoriesStyles: BrandDetailsCategoriesStyles = {
    title: {
        as: "h4",
        variant: "headerSecondary",
        transform: "inherit",
        css: css`
            border-width: 20px;
        `,
    },
    container: {
        css: css`
            margin: 15px;
        `,
    },
    categoryContainer: {
        gap: 10,
    },
    innerCategoryContainer: {
        gap: 1,
        css: css`
            width: 100%;
        `,
    },
    categoryItemColumn: {
        width: [6, 6, 12, 12, 12],
        css: css`
            width: 100%;
        `,
    },
    categoryItemRow: {
        width: [6, 6, 4, 3, 2],
    },
    categoryImageItem: {
        width: 12,
        align: "middle",
        css: css`
            width: 100%;
            height: 160px;
            justify-content: center;
        `,
    },
    categoryNameLinkItem: {
        width: 12,
        css: css`
            padding-bottom: 5px;
        `,
    },
    categoryNameLink: {
        typographyProps: {
            weight: "bold",
            css: css`
                width: 100%;
                overflow-wrap: break-word;
                word-wrap: break-word;
            `,
        },
        color: "text.main",
        css: css`
            width: 100%;
        `,
    },
    subCategoryItem: {
        width: 12,
        css: css`
            padding-top: 2px;
            padding-bottom: 3px;
        `,
    },
    subCategoryLink: {
        typographyProps: {
            css: css`
                width: 100%;
                overflow-wrap: break-word;
                word-wrap: break-word;
            `,
        },
        css: css`
            width: 100%;
        `,
    },
    viewMoreLinkItem: {
        width: 12,
        css: css`
            padding-top: 5px;
        `,
    },
    viewMoreLink: {
        typographyProps: {
            weight: "bold",
            ellipsis: true,
        },
    },
};

const styles = categoriesStyles;

const BrandDetailsCategories: FC<Props> = ({ fields }) => {
    const { isLoading, value: brandCategories } = useContext(BrandCategoriesStateContext);
    if (isLoading || !brandCategories) {
        return null;
    }
    const { title, showImages, gridType, subCategoriesToShow } = fields;
    const categoryItemStyles = gridType === "row" ? styles.categoryItemRow : styles.categoryItemColumn;

    const renderViewMoreLink = (category: BrandCategoryModel) => {
        if (subCategoriesToShow === 0 || (category.subCategories || []).length <= subCategoriesToShow) {
            return null;
        }
        return (
            <GridItem {...styles.viewMoreLinkItem}>
                <Link href={category.productListPagePath} {...styles.viewMoreLink}>
                    {translate("View More")}
                </Link>
            </GridItem>
        );
    };

    return (
        <StyledWrapper {...styles.container} data-test-selector="brandCategories">
            <Typography {...styles.title} data-test-selector="brandCategoriesTitle">
                {title}
            </Typography>
            <GridContainer {...styles.categoryContainer}>
                {brandCategories!.map(category => (
                    <GridItem key={category.categoryId} {...categoryItemStyles}>
                        <GridContainer {...styles.innerCategoryContainer}>
                            {showImages && (
                                <GridItem {...styles.categoryImageItem}>
                                    <Link href={category.productListPagePath} {...styles.categoryImageLink}>
                                        <LazyImage
                                            src={category.featuredImagePath}
                                            altText={category.featuredImageAltText}
                                            {...styles.categoryImage}
                                        />
                                    </Link>
                                </GridItem>
                            )}
                            <GridItem {...styles.categoryNameLinkItem}>
                                <Link
                                    href={category.productListPagePath}
                                    {...styles.categoryNameLink}
                                    data-test-selector={`brandCategoriesCategoryLink_${category.categoryId}`}
                                >
                                    {category.categoryShortDescription}
                                </Link>
                            </GridItem>
                            {category.subCategories?.slice(0, subCategoriesToShow).map(subCategory => (
                                <GridItem key={subCategory.categoryId} {...styles.subCategoryItem}>
                                    <Link
                                        href={subCategory.productListPagePath}
                                        {...styles.subCategoryLink}
                                        data-test-selector={`brandCategoriesSubCategoryLink_${subCategory.categoryId}`}
                                    >
                                        {subCategory.categoryName}
                                    </Link>
                                </GridItem>
                            ))}
                            {renderViewMoreLink(category)}
                        </GridContainer>
                    </GridItem>
                ))}
            </GridContainer>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(BrandDetailsCategories),
    definition: {
        group: "Brand Details",
        displayName: "Categories",
        allowedContexts: [BrandDetailsPageContext],
        fieldDefinitions: [
            {
                name: fields.title,
                displayName: "Title",
                editorTemplate: "TextField",
                defaultValue: "Shop By Category",
                fieldType: "Translatable",
            },
            {
                name: fields.showImages,
                displayName: "Show Images",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
            },
            {
                name: fields.subCategoriesToShow,
                displayName: "Sub Categories To Show",
                editorTemplate: "IntegerField",
                defaultValue: 4,
                fieldType: "General",
            },
            {
                name: fields.gridType,
                displayName: "Grid Type",
                editorTemplate: "DropDownField",
                defaultValue: "row",
                fieldType: "General",
                options: [
                    { value: "row", displayName: "Row" },
                    { value: "column", displayName: "Column" },
                ],
            },
        ],
    },
};

export default widgetModule;
