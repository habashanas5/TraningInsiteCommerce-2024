import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import * as React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";

const enum fields {
    title = "title",
    carouselType = "carouselType",
    displayProductsFrom = "displayProductsFrom",
    selectedCategoryIds = "selectedCategoryIds",
    relatedProductType = "relatedProductType",
    numberOfProductsToDisplay = "numberOfProductsToDisplay",
    seedWithManuallyAssigned = "seedWithManuallyAssigned",
    maxNumberOfColumns = "maxNumberOfColumns",
    showImage = "showImage",
    showTitle = "showTitle",
    showPrice = "showPrice",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.title]: string;
        [fields.carouselType]: string;
        [fields.displayProductsFrom]: string;
        [fields.selectedCategoryIds]: string[];
        [fields.showImage]: boolean;
        [fields.showTitle]: boolean;
        [fields.showPrice]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    products: [
        { id: 1, name: "Product 1", price: "$15.00" },
        { id: 2, name: "Product 2", price: "$25.00" },
        { id: 3, name: "Product 3", price: "$35.00" },
    ],
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

interface ProductCarouselStyles {
    titleText?: TypographyPresentationProps;
    mainContainer?: GridContainerProps;
    carouselGridItem?: GridItemProps;
}

const productCarouselStyles: ProductCarouselStyles = {
    titleText: {
        variant: "h2",
        css: css`
            margin-left: 20px;
            margin-bottom: 10px;
            font-size: 1.6em;
        `,
    },
    mainContainer: {
        gap: 0,
        css: css`
            overflow: hidden;
        `,
    },
    carouselGridItem: {
        width: 10,
    },
};

const CarouselSlidesContainer = styled.div`
    display: flex;
`;

const CarouselSlide = styled.div`
    padding: 0;
    position: relative;
    flex: 0 0 auto;
`;

const CarouselSlideInner = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
`;

const ProductImage = styled.div`
    width: 145px;
    height: 145px;
    background-color: #e0e0e0;
`;

const styles = productCarouselStyles;

const ProductCarousel: React.FC<Props> = ({ id, fields, products }) => {
    const title =
        fields.title ||
        translate(carouselTypeOptions.find(o => o.value === fields.carouselType)?.displayName || "Product Carousel");

    return (
        <>
            <Typography {...styles.titleText}>{title}</Typography>
            <GridContainer {...styles.mainContainer}>
                <GridItem {...styles.carouselGridItem}>
                    <CarouselSlidesContainer>
                        {products.map(product => (
                            <CarouselSlide key={product.id}>
                                <CarouselSlideInner>
                                    <ProductImage></ProductImage>
                                    <Typography>{product.name}</Typography>
                                    {fields.showPrice && <Typography>{product.price}</Typography>}
                                </CarouselSlideInner>
                            </CarouselSlide>
                        ))}
                    </CarouselSlidesContainer>
                </GridItem>
            </GridContainer>
        </>
    );
};

const carouselTypeOptions = [
    { value: "crossSells", displayName: "Cross Sells" },
    { value: "featuredCategory", displayName: "Featured Category" },
    { value: "recentlyViewed", displayName: "Recently Viewed" },
    { value: "topSellers", displayName: "Top Sellers" },
];

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(ProductCarousel),
    definition: {
        group: "Mobile",
        icon: "Carousel",
        fieldDefinitions: [
            {
                name: fields.title,
                displayName: "Title",
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
                sortOrder: 0,
            },
            {
                name: fields.carouselType,
                displayName: "Select Carousel Type",
                editorTemplate: "DropDownField",
                options: carouselTypeOptions,
                defaultValue: "crossSells",
                fieldType: "General",
                sortOrder: 1,
                isRequired: true,
            },
            {
                name: fields.displayProductsFrom,
                displayName: "Display Products From",
                editorTemplate: "DropDownField",
                options: [
                    { value: "allCategories", displayName: "All Categories" },
                    { value: "selectedCategories", displayName: "Selected Categories" },
                    { value: "customerSegments", displayName: "Customer Segments" },
                ],
                defaultValue: "allCategories",
                fieldType: "General",
                isVisible: item => item.fields[fields.carouselType] === "topSellers",
                sortOrder: 2,
            },
            {
                name: fields.selectedCategoryIds,
                displayName: "Select Category",
                editorTemplate: "CategoriesField",
                defaultValue: [],
                fieldType: "General",
                isVisible: item =>
                    (item.fields[fields.carouselType] === "topSellers" &&
                        item.fields[fields.displayProductsFrom] === "selectedCategories") ||
                    item.fields[fields.carouselType] === "featuredCategory",
                singleCategorySelection: item => item.fields[fields.carouselType] === "featuredCategory",
                sortOrder: 3,
            },
            {
                name: fields.showImage,
                displayName: "Thumbnail Image",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                isEnabled: () => false,
                fieldType: "General",
                sortOrder: 4,
            },
            {
                name: fields.showTitle,
                displayName: "Description",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                isEnabled: () => false,
                fieldType: "General",
                sortOrder: 5,
            },
            {
                name: fields.showPrice,
                displayName: "Price",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 6,
            },
        ],
    },
};

export default widgetModule;
