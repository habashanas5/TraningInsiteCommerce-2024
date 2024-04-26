import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { BrandProductLinesStateContext } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BrandDetailsPageContext } from "@insite/content-library/Pages/BrandDetailsPage";
import Button, { ButtonProps } from "@insite/mobius/Button";
import { ClickablePresentationProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkProps } from "@insite/mobius/Link";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useContext, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    title = "title",
    showImages = "showImages",
    maxToShow = "maxToShow",
    gridType = "gridType",
}
interface OwnProps extends WidgetProps {
    fields: {
        [fields.title]: string;
        [fields.showImages]: boolean;
        [fields.maxToShow]: number;
        [fields.gridType]: string;
    };
}

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = {};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface BrandDetailsProductLinesStyles {
    titleItem?: GridItemProps;
    title?: TypographyProps;
    container?: InjectableCss;
    productLineContainer?: GridContainerProps;
    productLineItemRow?: GridItemProps;
    productLineItemColumn?: GridItemProps;
    innerProductLineContainer?: GridContainerProps;
    productLineImageItem?: GridItemProps;
    productLineImage?: LazyImageProps;
    /** @deprecated item is no longer used for syntatic correctness */
    productLineNameLinkItem?: GridItemProps;
    productLineNameItem?: GridItemProps;
    productLineNameLink?: LinkProps;
    productLineName?: TypographyProps;
    viewAllButtonItem?: GridItemProps;
    viewAllButton?: ButtonProps;
    /** @deprecated Clickable component is no longer used for syntatic correctness */
    productLineImageClickable?: ClickablePresentationProps;
}

export const productLinesStyles: BrandDetailsProductLinesStyles = {
    titleItem: {
        width: 12,
        css: css`
            width: 100%;
            justify-content: center;
        `,
    },
    title: {
        variant: "h3",
        css: css`
            margin-bottom: 0;
        `,
    },
    container: {
        css: css`
            margin: 15px;
        `,
    },
    productLineContainer: {
        gap: 10,
    },
    innerProductLineContainer: {
        gap: 0,
        css: css`
            width: 100%;
        `,
    },
    productLineItemColumn: {
        width: [6, 6, 12, 12, 12],
    },
    productLineItemRow: {
        width: [6, 6, 4, 3, 2],
    },
    productLineImageItem: {
        width: 12,
        align: "middle",
        css: css`
            width: 100%;
            height: 160px;
            justify-content: center;
        `,
    },
    productLineImage: {
        css: css`
            img {
                height: 100%;
            }
        `,
    },
    productLineNameItem: {
        width: 12,
        css: css`
            width: 100%;
            padding-bottom: 5px;
        `,
    },
    productLineNameLink: {
        color: "text.main",
        typographyProps: {
            weight: "bold",
            css: css`
                width: 100%;
                overflow-wrap: break-word;
                word-wrap: break-word;
                text-align: center;
                font-weight: bold;
            `,
        },
    },
    productLineName: {
        weight: "bold",
        css: css`
            width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
            text-align: center;
            font-weight: bold;
        `,
        color: "text.main",
    },
    viewAllButtonItem: {
        width: 12,
        css: css`
            padding-top: 5px;
            width: 100%;
            justify-content: center;
        `,
    },
    viewAllButton: {
        typographyProps: {
            weight: "bold",
            ellipsis: true,
        },
    },
};

const styles = productLinesStyles;

const BrandDetailsProductLines: FC<Props> = ({ fields }) => {
    const { isLoading, value: brandProductLines } = useContext(BrandProductLinesStateContext);
    const { title, showImages, gridType, maxToShow } = fields;
    const productLineItemStyles = gridType === "row" ? styles.productLineItemRow : styles.productLineItemColumn;
    const [viewCount, setViewCount] = React.useState(maxToShow);
    useEffect(() => {
        setViewCount(maxToShow);
    }, [maxToShow]);
    if (isLoading || (brandProductLines && brandProductLines!.length === 0)) {
        return null;
    }

    const handleShowAllClicked = () => {
        setViewCount(brandProductLines?.length || maxToShow);
    };
    const renderShowAllLink = () => {
        if (maxToShow === 0 || (brandProductLines || []).length <= viewCount) {
            return null;
        }
        return (
            <GridItem {...styles.viewAllButtonItem}>
                <Button
                    onClick={handleShowAllClicked}
                    {...styles.viewAllButton}
                    data-test-selector="brandProductLineShowAllLink"
                >
                    {translate("Show All")}
                </Button>
            </GridItem>
        );
    };

    return (
        <StyledWrapper {...styles.container} data-test-selector="brandProductLines">
            <GridContainer {...styles.productLineContainer}>
                <GridItem {...styles.titleItem}>
                    <Typography {...styles.title} data-test-selector="brandProductLinesTitle">
                        {title}
                    </Typography>
                </GridItem>
                {brandProductLines?.slice(0, viewCount).map(productLine => (
                    <GridItem key={productLine.id} {...productLineItemStyles}>
                        <GridContainer {...styles.innerProductLineContainer}>
                            {showImages ? (
                                <Link href={productLine.productListPagePath}>
                                    <GridItem {...styles.productLineImageItem}>
                                        <LazyImage
                                            src={productLine.featuredImagePath}
                                            altText={productLine.featuredImageAltText}
                                            {...styles.productLineImage}
                                            data-test-selector={`brandProductLineImage_${productLine.id}`}
                                        />
                                    </GridItem>
                                    <GridItem {...styles.productLineNameItem}>
                                        <Typography
                                            {...styles.productLineName}
                                            data-test-selector={`brandProductLineLink_${productLine.id}`}
                                        >
                                            {productLine.name}
                                        </Typography>
                                    </GridItem>
                                </Link>
                            ) : (
                                <GridItem {...styles.productLineNameItem}>
                                    <Link
                                        href={productLine.productListPagePath}
                                        {...styles.productLineNameLink}
                                        data-test-selector={`brandProductLineLink_${productLine.id}`}
                                    >
                                        {productLine.name}
                                    </Link>
                                </GridItem>
                            )}
                        </GridContainer>
                    </GridItem>
                ))}
                {renderShowAllLink()}
            </GridContainer>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(BrandDetailsProductLines),
    definition: {
        group: "Brand Details",
        displayName: "Brand Product Lines",
        allowedContexts: [BrandDetailsPageContext],
        fieldDefinitions: [
            {
                name: fields.title,
                displayName: "Title",
                editorTemplate: "TextField",
                defaultValue: "Product Lines",
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
                name: fields.maxToShow,
                displayName: "Max To Show",
                editorTemplate: "IntegerField",
                defaultValue: 8,
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
